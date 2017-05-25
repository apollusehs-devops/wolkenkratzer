// @flow

import { Resource } from './elements/resource';

export interface IService {}

export function Service(name: string): IService {
  const json = require(`../stubs/json/${name}.json`);
  const service: any = { json };
  Object.keys(json.Resources).map(r => {
    service[r] = Resource.bind({ json, name: r });
  });
  return service;
}
