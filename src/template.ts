import { IParameter } from './elements/parameter';
import { IDescription } from './elements/description';
// import { IMetadata } from './elements/metadata';
// import { IMapping } from './elements/mapping';
import { ICondition } from './elements/condition';
import { IResource } from './elements/resource';
import { IOutput } from './elements/output';
import { IRef } from './intrinsic';

export interface ITemplate {
    readonly AWSTemplateFormatVersion: string;
    readonly Description?: string;
    readonly Parameters: { [s: string]: IParameter };
    // readonly Metadata: { [s: string]: IMetadata };
    // readonly Mappings: { [s: string]: IMapping };
    readonly Conditions: { [s: string]: ICondition };
    readonly Resources: { [s: string]: IResource };
    readonly Outputs: { [s: string]: IOutput };
    readonly addDescription: Function;
    readonly removeDescription: Function;
    readonly addCondition: Function;
    readonly addParameter: Function;
    readonly addOutput: Function;
    readonly addResource: Function;
    readonly removeOutput: Function;
    readonly removeParameter: Function;
    readonly build: Function;
}

export function Template(): ITemplate {
    return {
        AWSTemplateFormatVersion: '2010-09-09',
        Conditions: {},
        Outputs: {},
        Parameters: {},
        Resources: {},
        addCondition: function (e: ICondition): ITemplate {
            // TODO: Validate intrinsics
            let result = { ...this };
            result.Conditions[e.Name] = e;
            return result;
        },
        addDescription: function (e: IDescription): ITemplate {
            let result = { ...this };
            let desc = { Description: e.Content };
            result = { ...this, ...desc };
            return result;
        },
        addOutput: function (e: IOutput): ITemplate {
            if (typeof e.Properties.Value !== 'string' && e.Properties.Value.Ref) {
                _validateRef(this, e.Properties.Value);
            }
            let result = { ...this };
            result.Outputs[e.Name] = e;
            return result;
        },
        addParameter: function (e: IParameter): ITemplate {
            let result = { ...this };
            result.Parameters[e.Name] = e;
            return result;
        },
        addResource: function (e: IResource): ITemplate {
            let result = { ...this };
            result.Resources[e.Name] = e;
            return result;
        },
        build: function (): object {
            let result: any = {
                AWSTemplateFormatVersion: '2010-09-09',
                Resources: {}
            };
            if (Object.keys(this.Conditions).length > 0) {
                result.Conditions = {};
                Object.keys(this.Conditions).map(c => {
                    result.Conditions[c] = _stripName(this.Conditions[c]).Condition;
                });
            }
            if (Object.keys(this.Parameters).length > 0) {
                result.Parameters = {};
                Object.keys(this.Parameters).map(p => {
                    result.Parameters[p] = this.Parameters[p].Properties;
                });
            }
            if (Object.keys(this.Outputs).length > 0) {
                result.Outputs = {};
                Object.keys(this.Outputs).map(o => {
                    result.Outputs[o] = JSON.parse(_buildOutput(this.Outputs[o]));
                });
            }
            if (Object.keys(this.Resources).length > 0) {
                result.Resources = {};
                Object.keys(this.Resources).map(r => {
                    result.Resources[r] = _stripName(this.Resources[r]);
                });
            }
            if (this.Description) {
                result.Description = this.Description;
            }
            return result;
        },
        removeDescription: function (): ITemplate {
            const { Description, ...remaining } = this;
            return remaining;
        },
        removeOutput: function (e: IOutput | string): ITemplate {
            let result = { ...this };
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
        },
        removeParameter: function (e: IParameter | string): ITemplate {
            let result = { ...this };
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
    };
}

function _validateRef(t: ITemplate, ref: IRef): undefined | SyntaxError {
    if (!(t.Parameters[ref.Ref] || t.Resources[ref.Ref])) {
        throw new SyntaxError(`Could not find ${ref}`);
    }
    return;
}

function _stripName(t: IParameter | IOutput | IResource | ICondition): any {
    let { Name, ...rest } = t;
    return rest;
}

function _buildOutput(t: IOutput): string {
    let outputResult = Object.assign({}, t.Properties);
    if (typeof outputResult.Value !== 'string') {
        outputResult = { ...outputResult, Value: outputResult.Value };
    }
    return JSON.stringify(outputResult);
}
