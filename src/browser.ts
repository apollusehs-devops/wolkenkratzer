export { Template } from './template';
export { Parameter } from './elements/parameter';
export { Description } from './elements/description';
export { Output } from './elements/output';
export { Mapping } from './elements/mapping';
export { Resource, CustomResource } from './elements/resource';
export { Condition } from './elements/condition';
export {
  Ref,
  FnGetAtt,
  FnEquals,
  FnJoin,
  FnFindInMap,
  FnSub,
  FnAnd
} from './intrinsic';
import { Service } from './service';
export { CreationPolicy } from './attributes/creationpolicy';
export { ResourceMetadata } from './attributes/metadata';
export { Transform } from './transform';
export { Pseudo } from './pseudo';

import * as stubs from './spec/spec';

stubs.resourceList.forEach(r => {
  exports[r] = Service(stubs[r]);
});
