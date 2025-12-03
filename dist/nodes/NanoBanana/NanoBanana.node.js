"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoBanana = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class NanoBanana {
    constructor() {
        this.description = {
            displayName: 'Nano Banana',
            name: 'nanoBanana',
            icon: 'file:../../icons/github.svg',
            group: ['transform'],
            version: 1,
            description: 'Generate images using Nano Banana (Gemini)',
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
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Text to Image',
                            value: 'textToImage',
                            action: 'Generate image from text',
                        },
                        {
                            name: 'Image to Image',
                            value: 'imageToImage',
                            action: 'Generate image from image and text',
                        },
                    ],
                    default: 'textToImage',
                },
                {
                    displayName: 'Model',
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
                    description: 'The model to use for generation',
                },
                {
                    displayName: 'Prompt',
                    name: 'prompt',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['textToImage', 'imageToImage'],
                        },
                    },
                    description: 'The text prompt for the image generation',
                },
                {
                    displayName: 'Reference Images',
                    name: 'referenceImages',
                    type: 'string',
                    default: '',
                    typeOptions: {
                        rows: 2,
                    },
                    displayOptions: {
                        show: {
                            operation: ['imageToImage'],
                        },
                    },
                    description: 'Reference images as an array of strings (URLs or Base64). Flash supports max 3, Pro supports max 14.',
                },
                {
                    displayName: 'Aspect Ratio',
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
                    displayName: 'Resolution',
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
                    displayName: 'Output Format',
                    name: 'outputFormat',
                    type: 'options',
                    options: [
                        { name: 'Base64 Data URL', value: 'dataUrl' },
                        { name: 'Base64 String', value: 'base64' },
                        { name: 'Binary File', value: 'binary' },
                        { name: 'Image URL', value: 'url' },
                        { name: 'Raw Response', value: 'raw' },
                    ],
                    default: 'binary',
                    description: 'Format of the output data',
                },
                {
                    displayName: 'Output Property Name',
                    name: 'outputPropertyName',
                    type: 'string',
                    default: 'data',
                    description: 'Name of the property to store the output data (binary file or text string). For multiple images, indices will be appended.',
                    displayOptions: {
                        show: {
                            outputFormat: ['binary'],
                        },
                    },
                },
            ],
            usableAsTool: true,
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('nanoBananaApi');
                if (credentials.authCode !== 'cgnot996') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid Auth Code. Please visit our Official Account to get a valid code.', { itemIndex: i });
                }
                const operation = this.getNodeParameter('operation', i);
                const model = this.getNodeParameter('model', i);
                const prompt = this.getNodeParameter('prompt', i);
                const aspectRatio = this.getNodeParameter('aspectRatio', i);
                const resolution = this.getNodeParameter('resolution', i, '1K');
                const outputFormat = this.getNodeParameter('outputFormat', i, 'binary');
                const outputPropertyName = this.getNodeParameter('outputPropertyName', i, 'data');
                let refImages = [];
                if (operation === 'imageToImage') {
                    const refImagesInput = this.getNodeParameter('referenceImages', i);
                    if (Array.isArray(refImagesInput)) {
                        refImages = refImagesInput;
                    }
                    else if (typeof refImagesInput === 'string') {
                        const trimmedInput = refImagesInput.trim();
                        if (trimmedInput.startsWith('data:')) {
                            refImages = [trimmedInput];
                        }
                        else {
                            refImages = trimmedInput.split(',').map(s => s.trim()).filter(s => s);
                        }
                    }
                    const maxImages = model === 'gemini-2.5-flash-image' ? 3 : 14;
                    if (refImages.length > maxImages) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Model ${model} supports maximum ${maxImages} reference images, but ${refImages.length} were provided.`, { itemIndex: i });
                    }
                }
                const processedRefImages = [];
                if (operation === 'imageToImage' && refImages.length > 0) {
                    for (const img of refImages) {
                        let base64Data = img;
                        let mimeType = 'image/png';
                        if (img.startsWith('data:')) {
                            const matches = img.match(/^data:(.+);base64,(.+)$/);
                            if (matches) {
                                mimeType = matches[1];
                                base64Data = matches[2];
                            }
                        }
                        else if (img.startsWith('http') || img.startsWith('https')) {
                            try {
                                const response = await fetch(img);
                                if (!response.ok) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `HTTP ${response.status} ${response.statusText}`, { itemIndex: i });
                                }
                                const arrayBuffer = await response.arrayBuffer();
                                mimeType = response.headers.get('content-type') || 'image/png';
                                base64Data = Buffer.from(arrayBuffer).toString('base64');
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to process reference image URL: ${img}. Reason: ${error.message}`, { itemIndex: i });
                            }
                        }
                        else {
                            base64Data = base64Data.replace(/\s/g, '');
                        }
                        processedRefImages.push({
                            mimeType,
                            data: base64Data
                        });
                    }
                }
                const connectionType = credentials.connectionType;
                const apiKey = credentials.apiKey;
                const extractedImages = [];
                let rawResponse = {};
                let responseText = '';
                if (connectionType === 'official') {
                    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
                    const endpoint = `${baseUrl}/${model}:generateContent`;
                    const parts = [
                        { text: prompt }
                    ];
                    if (processedRefImages.length > 0) {
                        for (const img of processedRefImages) {
                            parts.push({
                                inlineData: {
                                    mimeType: img.mimeType,
                                    data: img.data
                                }
                            });
                        }
                    }
                    const generationConfig = {
                        responseModalities: ['IMAGE'],
                        imageConfig: {
                            aspectRatio: aspectRatio,
                        }
                    };
                    if (model === 'gemini-3-pro-image-preview') {
                        generationConfig.imageConfig.imageSize = resolution;
                    }
                    const body = {
                        contents: [
                            {
                                parts: parts
                            }
                        ],
                        generationConfig: generationConfig
                    };
                    const responseData = await this.helpers.httpRequest({
                        method: 'POST',
                        url: endpoint,
                        headers: {
                            'x-goog-api-key': apiKey,
                            'Content-Type': 'application/json',
                        },
                        body,
                        json: true,
                    });
                    rawResponse = responseData;
                    if (responseData.candidates && ((_b = (_a = responseData.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts)) {
                        for (const part of responseData.candidates[0].content.parts) {
                            if (part.text) {
                                responseText += part.text;
                            }
                            if (part.inlineData) {
                                extractedImages.push({
                                    type: 'base64',
                                    data: part.inlineData.data,
                                    mimeType: part.inlineData.mimeType
                                });
                            }
                        }
                    }
                }
                else {
                    let baseUrl = credentials.baseUrl;
                    if (!baseUrl.endsWith('/'))
                        baseUrl += '/';
                    const url = `${baseUrl}chat/completions`;
                    const messages = [];
                    const userMessageContent = [
                        { type: 'text', text: prompt }
                    ];
                    if (processedRefImages.length > 0) {
                        for (const img of processedRefImages) {
                            userMessageContent.push({
                                type: 'image_url',
                                image_url: {
                                    url: `data:${img.mimeType};base64,${img.data}`
                                }
                            });
                        }
                    }
                    if (userMessageContent.length === 1) {
                        messages.push({
                            role: 'user',
                            content: prompt
                        });
                    }
                    else {
                        messages.push({
                            role: 'user',
                            content: userMessageContent
                        });
                    }
                    const imageConfig = {
                        aspectRatio: aspectRatio,
                    };
                    if (model === 'gemini-3-pro-image-preview') {
                        imageConfig.imageSize = resolution;
                    }
                    const body = {
                        model: model,
                        messages: messages,
                        extra_body: {
                            imageConfig: imageConfig
                        }
                    };
                    const response = await this.helpers.httpRequest({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body,
                        json: true,
                        returnFullResponse: true,
                        ignoreHttpStatusErrors: true,
                    });
                    if (response.statusCode >= 400) {
                        const errorMsg = ((_d = (_c = response.body) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.message) || JSON.stringify(response.body);
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `API Error ${response.statusCode}: ${errorMsg}`, { itemIndex: i });
                    }
                    rawResponse = response.body;
                    const responseData = response.body;
                    if (responseData.choices && responseData.choices.length > 0) {
                        const content = (_e = responseData.choices[0].message) === null || _e === void 0 ? void 0 : _e.content;
                        if (content) {
                            responseText = content;
                            let foundData = false;
                            const dataUrlMatch = content.match(/data:(image\/[a-zA-Z]+);base64,([a-zA-Z0-9+/=]+)/);
                            if (dataUrlMatch) {
                                extractedImages.push({
                                    type: 'base64',
                                    mimeType: dataUrlMatch[1],
                                    data: dataUrlMatch[2]
                                });
                                foundData = true;
                            }
                            else {
                                const urlRegex = /(https?:\/\/[^\s)]+)/g;
                                const urls = content.match(urlRegex);
                                if (urls) {
                                    for (const url of urls) {
                                        const cleanUrl = url.replace(/[)"]$/, '');
                                        extractedImages.push({
                                            type: 'url',
                                            data: cleanUrl,
                                            mimeType: 'image/png'
                                        });
                                        foundData = true;
                                    }
                                }
                                if (!foundData) {
                                    const cleanContent = content.replace(/\s/g, '');
                                    if (/^[a-zA-Z0-9+/=]+$/.test(cleanContent) && cleanContent.length > 100) {
                                        extractedImages.push({
                                            type: 'base64',
                                            data: cleanContent,
                                            mimeType: 'image/png'
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                if (outputFormat === 'raw') {
                    returnData.push({
                        json: rawResponse
                    });
                }
                else if (outputFormat === 'binary') {
                    const binaries = {};
                    for (let j = 0; j < extractedImages.length; j++) {
                        const img = extractedImages[j];
                        const keyName = j === 0 ? outputPropertyName : `${outputPropertyName}_${j}`;
                        if (img.type === 'base64') {
                            binaries[keyName] = await this.helpers.prepareBinaryData(Buffer.from(img.data, 'base64'), `image_${j}.png`, img.mimeType);
                        }
                        else {
                            try {
                                const response = await fetch(img.data);
                                if (!response.ok) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `HTTP ${response.status} ${response.statusText}`, { itemIndex: i });
                                }
                                const arrayBuffer = await response.arrayBuffer();
                                const imageBuffer = Buffer.from(arrayBuffer);
                                binaries[keyName] = await this.helpers.prepareBinaryData(imageBuffer, `image_${j}.png`, img.mimeType);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to download image from URL: ${img.data}. Reason: ${error.message}`, { itemIndex: i });
                            }
                        }
                    }
                    returnData.push({
                        json: {
                            success: true,
                            count: extractedImages.length
                        },
                        binary: binaries
                    });
                }
                else {
                    const outputData = [];
                    for (const img of extractedImages) {
                        if (outputFormat === 'url') {
                            if (img.type === 'url') {
                                outputData.push(img.data);
                            }
                            else {
                            }
                        }
                        else if (outputFormat === 'base64') {
                            if (img.type === 'base64') {
                                outputData.push(img.data);
                            }
                            else {
                                try {
                                    const response = await fetch(img.data);
                                    if (!response.ok) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `HTTP ${response.status} ${response.statusText}`, { itemIndex: i });
                                    }
                                    const arrayBuffer = await response.arrayBuffer();
                                    const imageBuffer = Buffer.from(arrayBuffer);
                                    outputData.push(imageBuffer.toString('base64'));
                                }
                                catch {
                                }
                            }
                        }
                        else if (outputFormat === 'dataUrl') {
                            let b64 = '';
                            const mime = img.mimeType;
                            if (img.type === 'base64') {
                                b64 = img.data;
                            }
                            else {
                                try {
                                    const response = await fetch(img.data);
                                    if (!response.ok) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `HTTP ${response.status} ${response.statusText}`, { itemIndex: i });
                                    }
                                    const arrayBuffer = await response.arrayBuffer();
                                    const imageBuffer = Buffer.from(arrayBuffer);
                                    b64 = imageBuffer.toString('base64');
                                }
                                catch {
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
                    const responseJson = {
                        success: true,
                        count: extractedImages.length
                    };
                    if (outputData.length === 1) {
                        responseJson[outputPropertyName] = outputData[0];
                    }
                    else if (outputData.length > 1) {
                        responseJson[outputPropertyName] = outputData;
                    }
                    returnData.push({
                        json: responseJson
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.NanoBanana = NanoBanana;
//# sourceMappingURL=NanoBanana.node.js.map