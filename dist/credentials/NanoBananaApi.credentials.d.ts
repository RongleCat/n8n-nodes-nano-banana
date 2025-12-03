import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class NanoBananaApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    test: {
        request: {
            baseURL: string;
            url: string;
            qs: {
                key: string;
            };
        };
    };
    properties: INodeProperties[];
}
