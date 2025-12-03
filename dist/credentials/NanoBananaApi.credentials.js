"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoBananaApi = void 0;
class NanoBananaApi {
    constructor() {
        this.name = 'nanoBananaApi';
        this.displayName = 'Nano Banana API';
        this.icon = { light: 'file:../icons/banana.svg', dark: 'file:../icons/banana.dark.svg' };
        this.documentationUrl = 'https://ai.google.dev/gemini-api/docs/image-generation';
        this.test = {
            request: {
                baseURL: '={{$credentials?.connectionType === "openai" ? $credentials?.baseUrl?.replace(new RegExp("/$"), "") : "https://generativelanguage.googleapis.com"}}',
                url: '={{$credentials?.connectionType === "openai" ? "/models" : "/v1beta/models"}}',
                qs: {
                    key: '={{$credentials?.connectionType === "official" ? $credentials?.apiKey : undefined}}',
                },
                headers: {
                    Authorization: '={{$credentials?.connectionType === "openai" ? "Bearer " + $credentials?.apiKey : undefined}}',
                },
            },
        };
        this.properties = [
            {
                displayName: 'Auth Code',
                name: 'authCode',
                type: 'string',
                default: '',
                description: 'Get it from the WeChat Official Account. Required for usage.',
                placeholder: 'cgnot...',
                required: true,
            },
            {
                displayName: 'Connection Type',
                name: 'connectionType',
                type: 'options',
                options: [
                    {
                        name: 'Official',
                        value: 'official',
                    },
                    {
                        name: 'OpenAI Compatible',
                        value: 'openai',
                    },
                ],
                default: 'official',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                displayOptions: {
                    show: {
                        connectionType: ['openai'],
                    },
                },
                description: 'The base URL for the OpenAI compatible API. Should typically end with /',
            },
        ];
    }
}
exports.NanoBananaApi = NanoBananaApi;
//# sourceMappingURL=NanoBananaApi.credentials.js.map