import { Resource } from './elements/resource';
import { IService } from './types';

/**
 * Return a Service object to create Resources and Attributes
 * @param {*} json
 */
export function Service(json: any): IService {
  const service: any = { json };
  Object.keys(json.Resources).forEach(r => {
    service[r] = Resource.bind({ json, name: r });
  });
  return service;
}
