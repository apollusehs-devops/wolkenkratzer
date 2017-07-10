// @flow

import { IRef, Ref, FnSub, FnJoin, IFnGetAtt } from '../intrinsic';
import { cloneDeep } from 'lodash';

export interface IOutputProperties {
  +Description?: string,
  +Value: IRef | string,
  +Export?: {
    Name: string
  },
  +Condition?: string
}

export interface IOutput {
  +kind: 'Output',
  +Name: string,
  +Properties: IOutputProperties,
  +Condition?: string
}

export function Output(name: string, properties: IOutputProperties): IOutput {
  if (!name || !properties || !properties.Value) {
    throw new SyntaxError(
      `New Output with ${JSON.stringify({
        name,
        properties
      })} parameters is invalid. Name and Value are required.`
    );
  }
  const newProps = cloneDeep(properties);
  // If Value is a Ref object, create a Ref object
  if (typeof newProps.Value === 'object' && !newProps.Value.kind) {
    if (newProps.Value.Ref) {
      newProps.Value = Ref(newProps.Value.Ref);
    } else if (newProps.Value['Fn::Join']) {
      newProps.Value = FnJoin(
        newProps.Value['Fn::Join'][0],
        newProps.Value['Fn::Join'][1]
      );
    }
  }
  // If Export Name is Intrinsic, create an Intrinsic object
  if (
    newProps.Export &&
    newProps.Export.Name &&
    typeof newProps.Export.Name === 'object' &&
    newProps.Export.Name['Fn::Sub'] &&
    !newProps.Export.Name.kind
  ) {
    newProps.Export.Name = FnSub(newProps.Export.Name['Fn::Sub']);
  }
  return { kind: 'Output', Name: name, Properties: newProps };
}
