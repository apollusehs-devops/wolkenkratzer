// @flow
import _ from 'lodash';
import { IParameter, Parameter } from './elements/parameter';
import { IDescription } from './elements/description';
// import { IMetadata } from './elements/metadata';
import { IMapping } from './elements/mapping';
import { ICondition } from './elements/condition';
import { IResource } from './elements/resource';
import { IOutput, Output } from './elements/output';
import type { IElement } from './elements/element';
import { Mapping } from './elements/mapping';
import { ICreationPolicy } from './attributes/creationpolicy';
import { IResourceMetadata } from './attributes/metadata';
import { Ref, FnSub } from './intrinsic';
import { Pseudo } from './pseudo';
import type {
  IRef,
  IFnGetAtt,
  IFnJoin,
  Conditional,
  IIntrinsic,
  IFnAnd,
  IFnEquals,
  IFnIf,
  IFnNot,
  IFnOr
} from './intrinsic';

export interface ITemplate {
  +kind: 'Template',
  +AWSTemplateFormatVersion: string,
  +Description?: void | string,
  +Parameters: { +[s: string]: IParameter },
  // +Metadata: { +[s: string]: IMetadata };
  +Mappings: { +[s: string]: IMapping },
  +Conditions: { +[s: string]: ICondition },
  +Resources: { +[s: string]: IResource },
  +Outputs: { +[s: string]: IOutput },
  +add: Function,
  +remove: Function,
  +removeDescription: Function,
  +build: Function
}

export interface IAddOptions {
  Output: boolean,
  Parameters: Array<string>
}

/**
 * Returns a new Template.
 */
export function Template(inputTemplate?: mixed): ITemplate {
  return {
    AWSTemplateFormatVersion: '2010-09-09',
    Conditions: {},
    Mappings: {},
    Outputs: {},
    Parameters: {},
    Resources: {},
    add: function(e: IElement, options?: IAddOptions): ITemplate {
      const _t = _.cloneDeep(this);
      switch (e.kind) {
        case 'CreationPolicy':
          return _addCreationPolicy(_t, e);
        case 'ResourceMetadata':
          return _addResourceMetadata(_t, e);
        case 'Condition':
          return _addCondition(_t, e);
        case 'Mapping':
          return _addMapping(_t, e);
        case 'Parameter':
          return _addParameter(_t, e);
        case 'Output':
          return _addOutput(_t, e);
        case 'Resource':
          let newT = _addResource(_t, e);
          if (options) {
            const nameSplit = e.Type.split('::').splice(1);
            const shortName = nameSplit.join('');
            if (options.Output) {
              newT = _addOutput(
                newT,
                Output(`${e.Name}${shortName}Output`, {
                  Value: Ref(e.Name),
                  Export: {
                    Name: FnSub(
                      `\$\{${Pseudo.AWS_STACK_NAME}\}-${nameSplit[0]}-${nameSplit[1]}-${e.Name}`
                    )
                  }
                })
              );
            }
            if (options.Parameters) {
              options.Parameters.map(p => {
                newT = _addParameter(
                  newT,
                  Parameter(`${e.Name}${shortName}Param`, {
                    Type: 'String'
                  })
                );
              });
            }
          }
          return newT;
        case 'Description':
          return _addDescription(_t, e);
        default:
          throw new SyntaxError(
            `${JSON.stringify(e)} is not a valid type, could not be added.`
          );
      }
    },
    build: function(): mixed {
      let result: any = {
        AWSTemplateFormatVersion: '2010-09-09',
        Resources: {}
      };
      if (Object.keys(this.Conditions).length > 0) {
        result.Conditions = {};
        Object.keys(this.Conditions).map(c => {
          result.Conditions[c] = _json(this.Conditions[c]);
        });
      }
      if (Object.keys(this.Parameters).length > 0) {
        result.Parameters = {};
        Object.keys(this.Parameters).map(p => {
          result.Parameters[p] = _json(this.Parameters[p]);
        });
      }
      if (Object.keys(this.Mappings).length > 0) {
        result.Mappings = {};
        Object.keys(this.Mappings).map(m => {
          result.Mappings[m] = _json(this.Mappings[m]);
        });
      }
      if (Object.keys(this.Outputs).length > 0) {
        result.Outputs = {};
        Object.keys(this.Outputs).map(o => {
          result.Outputs[o] = _json(this.Outputs[o]);
        });
      }
      if (Object.keys(this.Resources).length > 0) {
        result.Resources = {};
        Object.keys(this.Resources).map(r => {
          result.Resources[r] = _json(this.Resources[r]);
        });
      }
      if (this.Description) {
        result.Description = this.Description;
      }
      return result;
    },
    kind: 'Template',
    remove: function(e: IElement | string): ITemplate {
      let result = _.cloneDeep(this);
      let element: IElement;
      if (typeof e === 'string') {
        let parameter: IParameter | void = result.Parameters[e];
        if (parameter) {
          element = parameter;
        } else {
          let output: IOutput | void = result.Outputs[e];
          if (output) {
            element = output;
          } else {
            let mapping: IMapping | void = result.Mappings[e];
            if (mapping) {
              element = mapping;
            } else {
              throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
            }
          }
        }
      } else {
        element = e;
      }
      switch (element.kind) {
        /*case 'Condition':
                    return _removeCondition(this, e);*/
        case 'Parameter':
          return _removeParameter(this, element);
        case 'Output':
          return _removeOutput(this, element);
        /*case 'Resource':
                    return _removeResource(this, e);*/
        case 'Mapping':
          return _removeMapping(this, element);
        default:
          throw new SyntaxError(
            `${JSON.stringify(e)} is not a valid type, could not be added.`
          );
      }
    },
    removeDescription: function(): ITemplate {
      const { Description, ...remaining } = this;
      return remaining;
    },
    merge: function(t: ITemplate): ITemplate {
      const _t = _.cloneDeep(this);
      const combined = {};
      [
        'Conditions',
        'Mapping',
        'Outputs',
        'Parameters',
        'Resources',
        'Description'
      ].map(block => {
        if (t[block]) {
          combined[block] = { ..._t[block], ...t[block] };
        }
      });
      return {
        ..._t,
        ...combined
      };
    },
    import: function(inputTemplate: mixed): ITemplate {
      let _t = _.cloneDeep(this);
      return _calcFromExistingTemplate(_t, inputTemplate);
    }
  };
}

function _validateRef(t: ITemplate, ref: IRef): void | SyntaxError {
  if (ref.Ref) {
    if (!(t.Parameters[ref.Ref] || t.Resources[ref.Ref])) {
      throw new SyntaxError(`Could not find ${JSON.stringify(ref)}`);
    }
  }
  return;
}

function _validateFnGetAtt(t: ITemplate, att: IFnGetAtt): void | SyntaxError {
  if (!t.Resources[att.FnGetAtt[0]]) {
    throw new SyntaxError(`Could not find ${JSON.stringify(att)}`);
  }
  return;
}

function _strip(t: IParameter | IOutput | IResource | ICondition): any {
  let { kind, Name, ...rest } = t;
  return rest;
}

function _stripKind(target: any): mixed {
  let { kind, ...rest } = target;
  return rest;
}

function _cleanObject(object: any): mixed {
  if (Array.isArray(object)) {
    for (let v = 0; v < object.length; v++) {
      object[v] = _cleanObject(object[v]);
    }
  } else {
    if (object.kind) {
      object = _json(object);
    } else {
      for (let o in object) {
        if (object[o] !== null && typeof object[o] === 'object') {
          object[o] = _cleanObject(object[o]);
        }
      }
    }
  }
  return object;
}

function _buildResource(t: IResource): mixed {
  let { Type, Properties, CreationPolicy, Metadata } = t;
  let newProps: mixed = {};
  if (Properties) {
    Object.keys(Properties).map(p => {
      if (Properties[p].kind) {
        newProps[p] = _json(Properties[p]);
      } else {
        newProps[p] = _cleanObject(Properties[p]);
      }
    });
  }
  let result = { Type, Properties: newProps };
  if (CreationPolicy) {
    result.CreationPolicy = _json(CreationPolicy);
  }
  if (Metadata) {
    result.Metadata = _json(Metadata);
  }
  return result;
}

function _buildCondition(t: ICondition): string {
  let { Condition } = t;
  let result = _json(Condition);
  Object.keys(result).map(k => {
    result[k][0] = _json(result[k][0]);
  });
  return result;
}

function _buildCreationPolicy(t: ICreationPolicy): mixed {
  let { Content } = t;
  return Content;
}

function _buildResourceMetadata(t: IResourceMetadata): mixed {
  let { Content } = t;
  return Content;
}

function _buildFnJoin(t: IFnJoin): mixed {
  if (Array.isArray(t.Values)) {
    return { 'Fn::Join': [t.Delimiter, t.Values] };
  } else {
    return { 'Fn::Join': [t.Delimiter, _json(t.Values)] };
  }
}

function _buildMapping(t: IMapping): string {
  let result = t.Content;
  return result;
}

function _buildOutput(t: IOutput): string {
  let outputResult: any = Object.assign({}, t.Properties);
  if (typeof outputResult.Value !== 'string') {
    let stripped = _json(outputResult.Value);
    outputResult = { ...outputResult, Value: stripped };
  }
  if (
    outputResult.Export &&
    outputResult.Export.Name &&
    typeof outputResult.Export.Name !== 'string'
  ) {
    let stripped = _json(outputResult.Export.Name);
    outputResult = { ...outputResult, Export: { Name: stripped } };
  }
  return outputResult;
}

export function _json(
  t: IElement | IRef | IFnGetAtt | IFnJoin | FnSub | ICreationPolicy
): mixed {
  switch (t.kind) {
    case 'Ref':
      return { Ref: t.Ref };
    case 'FnGetAtt':
      return { 'Fn::GetAtt': t.FnGetAtt };
    case 'FnJoin':
      return _buildFnJoin(t);
    case 'FnEquals':
      return { 'Fn::Equals': t.FnEquals };
    case 'FnSub':
      return { 'Fn::Sub': t.FnSub };
    case 'CreationPolicy':
      return _buildCreationPolicy(t);
    case 'ResourceMetadata':
      return _buildResourceMetadata(t);
    case 'Condition':
      return _buildCondition(t);
    case 'Mapping':
      return _buildMapping(t);
    case 'Parameter':
      return _strip(t).Properties;
    case 'Output':
      return _buildOutput(t);
    case 'Resource':
      return _buildResource(t);
    default:
      throw new SyntaxError(`Can't call _json on ${JSON.stringify(t)}`);
  }
}

function _addDescription(t: ITemplate, e: IDescription): ITemplate {
  let result = { ...t };
  let desc = { Description: e.Content };
  result = { ...t, ...desc };
  return result;
}

function _addCreationPolicy(t: ITemplate, e: ICreationPolicy): ITemplate {
  let result = { ...t };
  if (!result.Resources[e.Resource]) {
    throw new SyntaxError(
      'Cannot add CreationPolicy to a Resource that does not exist in the template.'
    );
  }
  let resource = { ...result.Resources[e.Resource] };
  resource.CreationPolicy = e;
  result.Resources[e.Resource] = resource;
  return result;
}

function _addResourceMetadata(t: ITemplate, e: IResourceMetadata): ITemplate {
  let result = { ...t };
  if (!result.Resources[e.Resource]) {
    throw new SyntaxError(
      'Cannot add Metadata to a Resource that does not exist in the template.'
    );
  }
  let resource = { ...result.Resources[e.Resource] };
  resource.Metadata = e;
  result.Resources[e.Resource] = resource;
  return result;
}

function _addCondition(t: ITemplate, e: ICondition): ITemplate {
  // TODO: Validate intrinsics
  let result = { ...t };
  result.Conditions[e.Name] = e;
  return result;
}

function _addOutput(t: ITemplate, e: IOutput): ITemplate {
  if (typeof e.Properties.Value !== 'string') {
    if (e.Properties.Value.Ref) {
      _validateRef(t, e.Properties.Value);
    } else if (
      typeof e.Properties.Value !== 'string' &&
      e.Properties.Value['Fn::GetAtt']
    ) {
      _validateFnGetAtt(t, e.Properties.Value);
    }
  }

  let result = { ...t };
  result.Outputs[e.Name] = e;
  return result;
}

function _addParameter(t: ITemplate, e: IParameter): ITemplate {
  let result = { ...t };
  result.Parameters[e.Name] = e;
  return result;
}

function _addMapping(t: ITemplate, e: IMapping): ITemplate {
  let result = { ...t };
  if (result.Mappings[e.Name]) {
    result.Mappings[e.Name] = {
      ...e,
      Content: { ...result.Mappings[e.Name].Content, ...e.Content }
    };
  } else {
    result.Mappings[e.Name] = e;
  }
  return result;
}

function _addResource(t: ITemplate, e: IResource): ITemplate {
  let result = { ...t };
  result.Resources[e.Name] = e;
  return result;
}

function _removeMapping(t: ITemplate, e: IMapping | string): ITemplate {
  let result = { ...t };
  let mapping: IMapping;
  if (typeof e === 'string') {
    if (result.Mappings[e]) {
      mapping = result.Mappings[e];
    } else {
      throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
    }
  } else {
    mapping = e;
  }
  if (result.Mappings[mapping.Name]) {
    delete result.Mappings[mapping.Name];
  } else {
    throw new SyntaxError(`Could not find ${JSON.stringify(mapping)}`);
  }
  return result;
}

function _removeOutput(t: ITemplate, e: IOutput | string): ITemplate {
  let result = { ...t };
  let out: IOutput;
  if (typeof e === 'string') {
    if (result.Outputs[e]) {
      out = result.Outputs[e];
    } else {
      throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
    }
  } else {
    out = e;
  }
  if (result.Outputs[out.Name]) {
    delete result.Outputs[out.Name];
  } else {
    throw new SyntaxError(`Could not find ${JSON.stringify(out)}`);
  }
  return result;
}

function _removeParameter(t: ITemplate, e: IParameter | string): ITemplate {
  let result = { ...t };
  let param: IParameter;
  if (typeof e === 'string') {
    if (result.Parameters[e]) {
      param = result.Parameters[e];
    } else {
      throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
    }
  } else {
    param = e;
  }
  if (result.Parameters[param.Name]) {
    delete result.Parameters[param.Name];
  } else {
    throw new SyntaxError(`Could not find ${JSON.stringify(param)}`);
  }
  return result;
}

function _calcFromExistingTemplate(t: ITemplate, inputTemplate: mixed) {
  if (inputTemplate.Parameters) {
    Object.keys(inputTemplate.Parameters).map(p => {
      t = t.add(Parameter(p, inputTemplate.Parameters[p]));
    });
  }
  if (inputTemplate.Outputs) {
    Object.keys(inputTemplate.Outputs).map(o => {
      console.log('o');
      t = t.add(Output(o, inputTemplate.Outputs[o]));
    });
  }
  /*

  if (inputTemplate.Mappings) {
    Object.keys(inputTemplate.Mappings).map(m => {
      t = t.add(Mapping(m, inputTemplate.Mappings[m]));
    });
  }
  if (inputTemplate.Resources) {
    Object.keys(inputTemplate.Resources).map(r => {
      t = t.add(Mapping(r, inputTemplate.Resources[r]));
    });
  }
  */
  if (inputTemplate.Conditions) {
    Object.keys(inputTemplate.Conditions).map(c => {
      t = t.add(Condition(c, inputTemplate.Conditions[c]));
    });
  }
  return t;
}