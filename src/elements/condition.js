// @flow
import {
  IFnAnd,
  IFnEquals,
  IFnIf,
  IFnNot,
  IFnOr,
  buildIntrinsic
} from '../intrinsic';
import _ from 'lodash';

export interface ICondition {
  +kind: 'Condition',
  +Name: string,
  +Condition: IFnAnd | IFnEquals | IFnIf | IFnNot | IFnOr
}

export function Condition(
  name: string,
  conditionFn: IFnAnd | IFnEquals | IFnIf | IFnNot | IFnOr
): ICondition {
  let newCondFn = _.cloneDeep(conditionFn);
  if (typeof newCondFn === 'object' && !newCondFn.kind) {
    newCondFn = buildIntrinsic(newCondFn);
  }
  return { kind: 'Condition', Name: name, Condition: newCondFn };
}
