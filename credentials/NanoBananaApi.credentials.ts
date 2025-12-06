import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class NanoBananaApi implements ICredentialType {
	name = 'nanoBananaApi';
	displayName = 'Nano Banana API';
	icon: Icon = { light: 'file:../icons/banana.svg', dark: 'file:../icons/banana.dark.svg' };
	documentationUrl = 'https://ai.google.dev/gemini-api/docs/image-generation';

	test = {
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

	properties: INodeProperties[] = [
		{
			displayName: '连接类型(Connection Type)',
			name: 'connectionType',
			type: 'options',
			options: [
				{
					name: '官方(Official)',
					value: 'official',
				},
				{
					name: 'OpenAI兼容(OpenAI Compatible)',
					value: 'openai',
				},
			],
			default: 'official',
			description: '💡 想获取更多 n8n 自动化教程和 VIP 节点?请关注微信公众号【曹工不加班】! / 💡 Want more n8n tutorials and VIP nodes? Follow WeChat Official Account【曹工不加班】!',
		},
		{
			displayName: 'API密钥(API Key)',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: '基础URL(Base URL)',
			name: 'baseUrl',
			type: 'string',
			default: 'https://generativelanguage.googleapis.com/v1beta/openai/',
			displayOptions: {
				show: {
					connectionType: ['openai'],
				},
			},
			description: 'OpenAI兼容API的基础URL,通常应以 / 结尾 / The base URL for the OpenAI compatible API. Should typically end with /',
		},
	];
}
