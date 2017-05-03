export interface IOutput {
    readonly kind: 'output';
    readonly Name: string;
    readonly Description?: string;
    readonly Value: string;
    readonly Export?: {
        Name: string;
    };
}
export declare function Output(params?: IOutput): IOutput;