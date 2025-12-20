import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class NanoBananaApi implements ICredentialType {
	name = 'nanoBananaApi';
	displayName = 'Nano Banana API';
	icon: Icon = { light: 'file:../icons/banana.svg', dark: 'file:../icons/banana.dark.svg' };
	documentationUrl = 'https://ai.google.dev/gemini-api/docs/image-generation';

	// Platform configurations for credential testing
	// To add a new platform: add entry to PLATFORMS object below and update properties
	test = {
		request: {
			// IIFE pattern: define platform configs as object, lookup by connectionType
			baseURL: '={{(() => { const cfg = { official: "https://generativelanguage.googleapis.com", openrouter: "https://openrouter.ai/api", openai: $credentials?.baseUrl?.replace(/\\/$/, "") }; return cfg[$credentials?.connectionType] || cfg.official; })()}}',
			url: '={{(() => { const cfg = { official: "/v1beta/models", openrouter: "/v1/models", openai: "/models" }; return cfg[$credentials?.connectionType] || cfg.official; })()}}',
			qs: {
				key: '={{$credentials?.connectionType === "official" ? $credentials?.apiKey : undefined}}',
			},
			headers: {
				Authorization: '={{$credentials?.connectionType !== "official" ? "Bearer " + $credentials?.apiKey : undefined}}',
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
				{
					name: 'OpenRouter',
					value: 'openrouter',
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
		{
			displayName: '请求格式(Request Format)',
			name: 'requestFormat',
			type: 'options',
			options: [
				{
					name: 'OpenAI兼容(OpenAI Compatible)',
					value: 'openai',
				},
				{
					name: 'Gemini原生(Gemini Native)',
					value: 'gemini',
				},
			],
			default: 'gemini',
			displayOptions: {
				show: {
					connectionType: ['openai'],
				},
			},
			description: 'Gemini原生格式使用官方API请求结构,仅替换Base URL;OpenAI兼容格式使用Chat Completions接口 / Gemini Native uses official API request structure with Base URL replaced; OpenAI Compatible uses Chat Completions API',
		},
	];
}
