import type {
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class NanoBananaApi implements ICredentialType {
	name = 'nanoBananaApi';
	displayName = 'Nano Banana API';
	icon: Icon = { light: 'file:../icons/github.svg', dark: 'file:../icons/github.dark.svg' };
	documentationUrl = 'https://ai.google.dev/gemini-api/docs/image-generation';
    
    test = {
		request: {
			baseURL: 'https://generativelanguage.googleapis.com',
			url: '/v1beta/models',
			qs: {
				key: '={{$credentials?.apiKey}}',
			},
		},
	};

  properties: INodeProperties[] = [
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
