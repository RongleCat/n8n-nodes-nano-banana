import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	JsonObject,
	Icon,
} from 'n8n-workflow';

export class NanoBanana implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nano Banana',
		name: 'nanoBanana',
		icon: {
			light: 'file:../../icons/banana.svg',
			dark: 'file:../../icons/banana.dark.svg',
		} as Icon,
		group: ['transform'],
		version: 1,
		description:
			'使用 Nano Banana (Gemini) 生成图片。💡 想获取更多教程?关注公众号【曹工不加班】/ Generate images using Nano Banana (Gemini). 💡 Want more tutorials? Follow【曹工不加班】',
		defaults: {
			name: 'Nano Banana',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nanoBananaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: '操作(Operation)',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: '文本生成图片(Text to Image)',
						value: 'textToImage',
						action: '从文本生成图片 / Generate image from text',
					},
					{
						name: '图片生成图片(Image to Image)',
						value: 'imageToImage',
						action: '从图片和文本生成图片 / Generate image from image and text',
					},
				],
				default: 'textToImage',
			},
			{
				displayName: '模型(Model)',
				name: 'model',
				type: 'options',
				options: [
					{
						name: 'Nano Banana (Flash)',
						value: 'gemini-2.5-flash-image',
					},
					{
						name: 'Nano Banana Pro (Pro)',
						value: 'gemini-3-pro-image-preview',
					},
				],
				default: 'gemini-2.5-flash-image',
				description: '用于生成的模型 / The model to use for generation',
			},
			{
				displayName: '提示词(Prompt)',
				name: 'prompt',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['textToImage', 'imageToImage'],
					},
				},
				description: '用于图片生成的文本提示词 / The text prompt for the image generation',
			},
			{
				displayName: '参考图片(Reference Images)',
				name: 'referenceImages',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						operation: ['imageToImage'],
					},
				},
				description:
					'参考图片,支持URL、Base64字符串或二进制字段名。多个图片可用竖线(|)或换行分隔。支持混合使用不同格式。Flash最多支持3张,Pro最多支持14张 / Reference images as URLs, Base64 strings, or binary field names. Multiple images can be separated by pipes (|) or newlines. Supports mixing different formats. Flash supports max 3, Pro supports max 14.',
			},
			{
				displayName: '宽高比(Aspect Ratio)',
				name: 'aspectRatio',
				type: 'options',
				options: [
					{ name: '1:1', value: '1:1' },
					{ name: '16:9', value: '16:9' },
					{ name: '2:3', value: '2:3' },
					{ name: '21:9', value: '21:9' },
					{ name: '3:2', value: '3:2' },
					{ name: '3:4', value: '3:4' },
					{ name: '4:3', value: '4:3' },
					{ name: '4:5', value: '4:5' },
					{ name: '5:4', value: '5:4' },
					{ name: '9:16', value: '9:16' },
				],
				default: '1:1',
			},
			{
				displayName: '分辨率(Resolution)',
				name: 'resolution',
				type: 'options',
				options: [
					{ name: '1K', value: '1K' },
					{ name: '2K', value: '2K' },
					{ name: '4K', value: '4K' },
				],
				default: '1K',
				displayOptions: {
					show: {
						model: ['gemini-3-pro-image-preview'],
					},
				},
			},
			{
				displayName: '输出格式(Output Format)',
				name: 'outputFormat',
				type: 'options',
				options: [
					{ name: '二进制文件(Binary File)', value: 'binary' },
					{ name: '图片URL(Image URL)', value: 'url' },
					{ name: 'Base64数据URL(Base64 Data URL)', value: 'dataUrl' },
					{ name: 'Base64字符串(Base64 String)', value: 'base64' },
				],
				default: 'binary',
				description: '输出数据的格式 / Format of the output data',
			},
			{
				displayName: '输出属性名称(Output Property Name)',
				name: 'outputPropertyName',
				type: 'string',
				default: 'data',
				description:
					'存储输出数据的属性名称(二进制文件或文本字符串)。对于多张图片,会添加索引后缀 / Name of the property to store the output data (binary file or text string). For multiple images, indices will be appended.',
				displayOptions: {
					show: {
						outputFormat: ['binary'],
					},
				},
			},
			{
				displayName: '生成失败时报错(Throw On Failure)',
				name: 'throwOnFailure',
				type: 'boolean',
				default: true,
				description:
					'Whether to throw an error when image generation fails (including API errors, parse failures, etc.). On: throws error with details; Off: returns success:false with error details. 当图片生成失败时(包括API错误、解析失败等)的处理方式。开启:抛出错误并显示详细信息;关闭:返回 success:false 和错误详情',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						outputFormat: ['binary'],
					},
				},
				options: [
					{
						displayName: '输出文件名(Output File Name)',
						name: 'outputFileName',
						type: 'string',
						default: '',
						placeholder: 'generated_image.png',
						description:
							'二进制文件的文件名。留空则使用默认命名(image_0.png, image_1.png等)。对于多张图片,会自动添加索引后缀 / File name for the binary data. Leave empty for default naming (image_0.png, image_1.png, etc). For multiple images, indices will be appended automatically.',
					},
				],
			},
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData = await Promise.all(
			items.map(async (_, i) => {
				try {
					const credentials = await this.getCredentials('nanoBananaApi');

					const operation = this.getNodeParameter('operation', i) as string;
					const model = this.getNodeParameter('model', i) as string;
					const prompt = this.getNodeParameter('prompt', i) as string;
					const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
					const resolution = this.getNodeParameter('resolution', i, '1K') as string;
					const outputFormat = this.getNodeParameter('outputFormat', i, 'binary') as string;
					const outputPropertyName = this.getNodeParameter(
						'outputPropertyName',
						i,
						'data',
					) as string;
					const throwOnFailure = this.getNodeParameter(
						'throwOnFailure',
						i,
						true,
					) as boolean;
					const options = this.getNodeParameter('options', i, {}) as { outputFileName?: string };
					const outputFileName = options.outputFileName || '';

					// 1. Image Validation & Preparation
					const refImages: string[] = [];
					if (operation === 'imageToImage') {
						const refImagesInput = this.getNodeParameter('referenceImages', i);

						// Phase 1: Split input into array of items to process
						let itemsToProcess: string[] = [];
						if (Array.isArray(refImagesInput)) {
							itemsToProcess = refImagesInput as string[];
						} else if (typeof refImagesInput === 'string' && refImagesInput.trim()) {
							// Split by pipe or newline, filter empty values
							itemsToProcess = refImagesInput
								.split(/[\n|]/)
								.map((s) => s.trim())
								.filter((s) => s);
						}

						// Phase 2: Process each item to convert to base64 data URI
						for (let idx = 0; idx < itemsToProcess.length; idx++) {
							const item = itemsToProcess[idx];

							try {
								// Check if it's already a data URI (starts with "data:")
								if (item.startsWith('data:')) {
									const matches = item.match(/^data:(.+);base64,(.+)$/);
									if (matches && matches[1].startsWith('image/')) {
										// Valid image data URI
										refImages.push(item);
									} else {
										throw new NodeOperationError(
											this.getNode(),
											'Data URI is not a valid image format or missing base64 encoding',
											{ itemIndex: i },
										);
									}
								}
								// Check if it's a URL (starts with http:// or https://)
								else if (item.startsWith('http://') || item.startsWith('https://')) {
									// Download and convert to base64
									const response = await fetch(item);
									if (!response.ok) {
										throw new NodeOperationError(
											this.getNode(),
											`HTTP ${response.status} ${response.statusText}`,
											{ itemIndex: i },
										);
									}
									const arrayBuffer = await response.arrayBuffer();
									const base64 = Buffer.from(arrayBuffer).toString('base64');
									const mimeType = response.headers.get('content-type') || 'image/png';

									if (!mimeType.startsWith('image/')) {
										throw new NodeOperationError(
											this.getNode(),
											`URL returned MIME type "${mimeType}" which is not an image`,
											{ itemIndex: i },
										);
									}

									refImages.push(`data:${mimeType};base64,${base64}`);
								}
								// Check if it's pure base64 (very long alphanumeric string)
								else if (/^[a-zA-Z0-9+/=\s]+$/.test(item) && item.replace(/\s/g, '').length > 100) {
									// Treat as raw base64, assume PNG
									const cleanBase64 = item.replace(/\s/g, '');
									refImages.push(`data:image/png;base64,${cleanBase64}`);
								}
								// Otherwise, treat as binary field name
								else {
									const binaryData = items[i].binary?.[item];
									if (!binaryData) {
										throw new NodeOperationError(
											this.getNode(),
											`Binary field "${item}" not found. Available fields: ${Object.keys(items[i].binary || {}).join(', ') || 'none'}`,
											{ itemIndex: i },
										);
									}

									const mimeType = binaryData.mimeType || 'image/png';
									if (!mimeType.startsWith('image/')) {
										throw new NodeOperationError(
											this.getNode(),
											`Binary field "${item}" has MIME type "${mimeType}" which is not an image`,
											{ itemIndex: i },
										);
									}

									const buffer = await this.helpers.getBinaryDataBuffer(i, item);
									const base64 = buffer.toString('base64');
									refImages.push(`data:${mimeType};base64,${base64}`);
								}
							} catch (error) {
								const errorMessage = error instanceof Error ? error.message : String(error);
								throw new NodeOperationError(
									this.getNode(),
									`Failed to process reference image #${idx + 1} ("${item.length > 50 ? item.substring(0, 50) + '...' : item}"): ${errorMessage}`,
									{ itemIndex: i },
								);
							}
						}

						const maxImages = model === 'gemini-2.5-flash-image' ? 3 : 14;
						if (refImages.length > maxImages) {
							throw new NodeOperationError(
								this.getNode(),
								`Model ${model} supports maximum ${maxImages} reference images, but ${refImages.length} were provided.`,
								{ itemIndex: i },
							);
						}
					}

					// Pre-process reference images (download URLs, extract Base64)
					const processedRefImages: Array<{ mimeType: string; data: string }> = [];
					if (operation === 'imageToImage' && refImages.length > 0) {
						for (const img of refImages) {
							let base64Data = img;
							let mimeType = 'image/png'; // Default

							if (img.startsWith('data:')) {
								const matches = img.match(/^data:(.+);base64,(.+)$/);
								if (matches) {
									mimeType = matches[1];
									base64Data = matches[2];
								}
							} else if (img.startsWith('http') || img.startsWith('https')) {
								try {
									const response = await fetch(img);
									if (!response.ok) {
										throw new NodeOperationError(
											this.getNode(),
											`HTTP ${response.status} ${response.statusText}`,
											{ itemIndex: i },
										);
									}
									const arrayBuffer = await response.arrayBuffer();
									mimeType = response.headers.get('content-type') || 'image/png';
									base64Data = Buffer.from(arrayBuffer).toString('base64');
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
								} catch (error: any) {
									throw new NodeOperationError(
										this.getNode(),
										`Failed to process reference image URL: ${img}. Reason: ${error.message}`,
										{ itemIndex: i },
									);
								}
							} else {
								// Raw Base64: Remove whitespace/newlines
								base64Data = base64Data.replace(/\s/g, '');
							}

							processedRefImages.push({
								mimeType,
								data: base64Data,
							});
						}
					}

					const connectionType = credentials.connectionType as string;
					const apiKey = credentials.apiKey as string;

					// Structure to hold extracted image info
					const extractedImages: Array<{ type: 'base64' | 'url'; data: string; mimeType: string }> =
						[];
					let rawResponse: JsonObject = {};
					let responseText = '';

					if (connectionType === 'official') {
						// --- OFFICIAL GEMINI API ---
						const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
						const endpoint = `${baseUrl}/${model}:generateContent`;

						const parts: Array<JsonObject> = [{ text: prompt }];

						// Add Reference Images
						if (processedRefImages.length > 0) {
							for (const img of processedRefImages) {
								parts.push({
									inlineData: {
										mimeType: img.mimeType,
										data: img.data,
									},
								});
							}
						}

						const generationConfig: JsonObject = {
							responseModalities: ['IMAGE'],
							imageConfig: {
								aspectRatio: aspectRatio,
							} as JsonObject,
						};

						if (model === 'gemini-3-pro-image-preview') {
							(generationConfig.imageConfig as JsonObject).imageSize = resolution;
						}

						const body: JsonObject = {
							contents: [
								{
									parts: parts,
								},
							],
							generationConfig: generationConfig,
						};

						const responseData = (await this.helpers.httpRequest({
							method: 'POST',
							url: endpoint,
							headers: {
								'x-goog-api-key': apiKey,
								'Content-Type': 'application/json',
							},
							body,
							json: true,
						})) as {
							candidates?: Array<{
								content?: {
									parts?: Array<{ inlineData?: { data: string; mimeType: string }; text?: string }>;
								};
							}>;
						};

						rawResponse = responseData as JsonObject;

						// Extract images
						if (responseData.candidates && responseData.candidates[0]?.content?.parts) {
							for (const part of responseData.candidates[0].content.parts) {
								if (part.text) {
									responseText += part.text;
								}
								if (part.inlineData) {
									extractedImages.push({
										type: 'base64',
										data: part.inlineData.data,
										mimeType: part.inlineData.mimeType,
									});
								}
							}
						}
					} else {
						// --- OPENAI COMPATIBLE ---
						// Support both Text-to-Image and Image-to-Image via Chat Completions (Vision)

						let baseUrl = credentials.baseUrl as string;
						if (!baseUrl.endsWith('/')) baseUrl += '/';

						const url = `${baseUrl}chat/completions`;

						// Prepare Messages
						const messages: JsonObject[] = [];
						const userMessageContent: JsonObject[] = [{ type: 'text', text: prompt }];

						// Add Reference Images if available
						if (processedRefImages.length > 0) {
							for (const img of processedRefImages) {
								userMessageContent.push({
									type: 'image_url',
									image_url: {
										url: `data:${img.mimeType};base64,${img.data}`,
									},
								});
							}
						}

						// If simple text, use string content for better compatibility (though array is standard for vision)
						if (userMessageContent.length === 1) {
							messages.push({
								role: 'user',
								content: prompt,
							});
						} else {
							messages.push({
								role: 'user',
								content: userMessageContent,
							});
						}

						// Prepare Image Config
						const imageConfig: JsonObject = {
							aspectRatio: aspectRatio,
						};

						// Only add resolution for Pro model
						if (model === 'gemini-3-pro-image-preview') {
							imageConfig.imageSize = resolution;
						}

						const body: JsonObject = {
							model: model,
							messages: messages,
							extra_body: {
								imageConfig: imageConfig,
							},
						};

						const response = (await this.helpers.httpRequest({
							method: 'POST',
							url: url,
							headers: {
								Authorization: `Bearer ${apiKey}`,
								'Content-Type': 'application/json',
							},
							body,
							json: true,
							returnFullResponse: true,
							ignoreHttpStatusErrors: true,
						})) as { statusCode: number; body: JsonObject };

						if (response.statusCode >= 400) {
							const errorMsg =
								(response.body?.error as JsonObject)?.message || JSON.stringify(response.body);
							throw new NodeOperationError(
								this.getNode(),
								`API Error ${response.statusCode}: ${errorMsg}`,
								{ itemIndex: i },
							);
						}

						rawResponse = response.body as JsonObject;
						const responseData = response.body as {
							choices?: Array<{ message?: { content?: string } }>;
						};

						if (responseData.choices && responseData.choices.length > 0) {
							const content = responseData.choices[0].message?.content;
							if (content) {
								responseText = content;
								// Attempt to extract Base64 or URL from content
								// Content may contain:
								// 1. Markdown image syntax: ![alt](url_or_datauri)
								// 2. Raw data URL: data:image/xxx;base64,xxx
								// 3. Raw HTTP URL: https://...
								// 4. Raw base64 string

								// Step 1: Extract all markdown image URLs first
								// Match ![...](...)  - capture the URL part
								const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
								let markdownMatch;
								const extractedUrls: string[] = [];

								while ((markdownMatch = markdownImageRegex.exec(content)) !== null) {
									extractedUrls.push(markdownMatch[1]);
								}

								// Step 2: Process extracted markdown URLs + check for non-markdown patterns
								let foundData = false;

								// Process markdown image URLs (these take priority)
								for (const url of extractedUrls) {
									// Check if it's a data URI (may contain newlines/whitespace in base64)
									const dataUriMatch = url.match(/^data:(image\/[a-zA-Z0-9+-]+);base64,(.+)$/s);
									if (dataUriMatch) {
										// Clean base64: remove whitespace/newlines that may be present
										const cleanBase64 = dataUriMatch[2].replace(/\s/g, '');
										extractedImages.push({
											type: 'base64',
											mimeType: dataUriMatch[1],
											data: cleanBase64,
										});
										foundData = true;
									} else if (url.startsWith('http://') || url.startsWith('https://')) {
										// HTTP URL from markdown
										extractedImages.push({
											type: 'url',
											data: url,
											mimeType: 'image/png',
										});
										foundData = true;
									}
								}

								// If no markdown images found, check for raw patterns in content
								if (!foundData) {
									// Check for raw data URL (not wrapped in markdown)
									const rawDataUrlMatch = content.match(
										/data:(image\/[a-zA-Z0-9+-]+);base64,([a-zA-Z0-9+/=\s]+)/s,
									);
									if (rawDataUrlMatch) {
										const cleanBase64 = rawDataUrlMatch[2].replace(/\s/g, '');
										extractedImages.push({
											type: 'base64',
											mimeType: rawDataUrlMatch[1],
											data: cleanBase64,
										});
										foundData = true;
									}
								}

								if (!foundData) {
									// Check for raw HTTP URLs (not in markdown)
									const urlRegex = /(https?:\/\/[^\s)]+)/g;
									const urls = content.match(urlRegex);
									if (urls) {
										for (const url of urls) {
											const cleanUrl = url.replace(/[)"]$/, '');
											extractedImages.push({
												type: 'url',
												data: cleanUrl,
												mimeType: 'image/png',
											});
											foundData = true;
										}
									}
								}

								if (!foundData) {
									// Check if entire content looks like raw base64
									const cleanContent = content.replace(/\s/g, '');
									if (/^[a-zA-Z0-9+/=]+$/.test(cleanContent) && cleanContent.length > 100) {
										extractedImages.push({
											type: 'base64',
											data: cleanContent,
											mimeType: 'image/png',
										});
									}
								}
							}
						}
					}

					// --- PROCESS OUTPUT ---

					// --- CHECK PARSE RESULT ---
					if (extractedImages.length === 0) {
						if (throwOnFailure) {
							// 报错模式:抛出异常并显示原始响应
							throw new NodeOperationError(
								this.getNode(),
								`无法从API响应中解析出图片内容。原始响应: ${JSON.stringify(rawResponse, null, 2)} / Failed to parse image content from API response. Original response: ${JSON.stringify(rawResponse, null, 2)}`,
								{ itemIndex: i },
							);
						} else {
							// 静默模式:返回特定格式
							return {
								json: {
									success: false,
									count: 0,
									originalResponse: rawResponse,
								},
							};
						}
					}

					// --- PROCESS OUTPUT ---

					if (outputFormat === 'binary') {
						// Convert to n8n binary
						const binaries: INodeExecutionData['binary'] = {};
						for (let j = 0; j < extractedImages.length; j++) {
							const img = extractedImages[j];
							const keyName = j === 0 ? outputPropertyName : `${outputPropertyName}_${j}`;

							// Determine file name
							let fileName = outputFileName || `image_${j}.png`;
							if (extractedImages.length > 1 && outputFileName) {
								// Add index to custom file name for multiple images
								const dotIndex = outputFileName.lastIndexOf('.');
								if (dotIndex > 0) {
									fileName = `${outputFileName.substring(0, dotIndex)}_${j}${outputFileName.substring(dotIndex)}`;
								} else {
									fileName = `${outputFileName}_${j}`;
								}
							}

							if (img.type === 'base64') {
								binaries[keyName] = await this.helpers.prepareBinaryData(
									Buffer.from(img.data, 'base64'),
									fileName,
									img.mimeType,
								);
							} else {
								// For URL, we can't easily convert to binary without downloading.
								// Throw error or skip? User asked for conversion but downloading adds network overhead/failure points.
								// Let's try to download if it's a URL.
								try {
									// Use native fetch for better binary support
									const response = await fetch(img.data);
									if (!response.ok) {
										throw new NodeOperationError(
											this.getNode(),
											`HTTP ${response.status} ${response.statusText}`,
											{ itemIndex: i },
										);
									}
									const arrayBuffer = await response.arrayBuffer();
									const imageBuffer = Buffer.from(arrayBuffer);

									binaries[keyName] = await this.helpers.prepareBinaryData(
										imageBuffer,
										fileName,
										img.mimeType,
									);
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
								} catch (error: any) {
									throw new NodeOperationError(
										this.getNode(),
										`Failed to download image from URL: ${img.data}. Reason: ${error.message}`,
										{ itemIndex: i },
									);
								}
							}
						}
						return {
							json: {
								success: true,
								count: extractedImages.length,
								originalResponse: rawResponse,
							},
							binary: binaries,
						};
					} else {
						// Base64, DataURL, URL
						const outputData: string[] = [];

						for (const img of extractedImages) {
							if (outputFormat === 'url') {
								if (img.type === 'url') {
									outputData.push(img.data);
								} else {
									// Base64 -> URL is not possible without upload.
									// Return null or empty string to indicate failure to extract URL
									// Or throw error?
									// User said: "extract compliant url link", implies if it exists.
								}
							} else if (outputFormat === 'base64') {
								if (img.type === 'base64') {
									outputData.push(img.data);
								} else {
									// URL -> Base64
									try {
										// Use native fetch for better binary support
										const response = await fetch(img.data);
										if (!response.ok) {
											throw new NodeOperationError(
												this.getNode(),
												`HTTP ${response.status} ${response.statusText}`,
												{ itemIndex: i },
											);
										}
										const arrayBuffer = await response.arrayBuffer();
										const imageBuffer = Buffer.from(arrayBuffer);
										outputData.push(imageBuffer.toString('base64'));
									} catch {
										// Ignore or push empty
									}
								}
							} else if (outputFormat === 'dataUrl') {
								let b64 = '';
								const mime = img.mimeType;

								if (img.type === 'base64') {
									b64 = img.data;
								} else {
									// URL -> Base64
									try {
										// Use native fetch for better binary support
										const response = await fetch(img.data);
										if (!response.ok) {
											throw new NodeOperationError(
												this.getNode(),
												`HTTP ${response.status} ${response.statusText}`,
												{ itemIndex: i },
											);
										}
										const arrayBuffer = await response.arrayBuffer();
										const imageBuffer = Buffer.from(arrayBuffer);
										b64 = imageBuffer.toString('base64');
										// Try to guess mime from response headers? skipping for simplicity
									} catch {
										// Ignore
									}
								}

								if (b64) {
									outputData.push(`data:${mime};base64,${b64}`);
								}
							}
						}

						if (outputFormat === 'url' && outputData.length === 0 && responseText) {
							outputData.push(responseText);
						}

						const responseJson: JsonObject = {
							success: true,
							count: extractedImages.length,
							originalResponse: rawResponse,
						};

						// Assign to output property
						// If multiple images, use array. If single, use string (or array based on consistency preference).
						// To be safe and consistent with other nodes, if count > 1, use array. If count == 1, use value?
						// Or always array? User didn't specify. Let's use: if single item, value; if multiple, array.
						if (outputData.length === 1) {
							responseJson[outputPropertyName] = outputData[0];
						} else if (outputData.length > 1) {
							responseJson[outputPropertyName] = outputData;
						}

						return {
							json: responseJson,
						};
					}
				} catch (error) {
					if (this.continueOnFail()) {
						return { json: { error: error.message } };
					}
					throw error;
				}
			}),
		);

		return [returnData];
	}
}
