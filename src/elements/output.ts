import { IRef, IFnGetAtt } from '../intrinsic';

export interface IOutputProperties {
    readonly Description?: string;
    readonly Value: IRef | string;
    readonly Export?: {
        Name: string
    };
}

export interface IOutput {
    readonly kind: 'Output';
    readonly Name: string;
    readonly Properties: IOutputProperties;
}

export function Output(name: string, properties: IOutputProperties = {} as IOutputProperties): IOutput {
    if (!name || !properties.Value) {
        throw new SyntaxError(`New Output with ${JSON.stringify({ name, properties })} parameters is invalid. Name and Value are required.`);
    }
    return { kind: 'Output', Name: name, Properties: properties };
}
