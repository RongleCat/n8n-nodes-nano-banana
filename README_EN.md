English | [简体中文](./README.md)

## 🚀 Master n8n Automation & No More Overtime

Want to make your work easier? Scan the QR code below to follow WeChat Official Account **【曹工不加班】** and get:

- 📚 **Exclusive n8n Tutorials**
- 🧩 **VIP Community Nodes**
- 💡 **Advanced Workflow Templates**

![曹工不加班](https://pic.fmcat.top/AI/other/gzh.webp)

---

# n8n-nodes-nano-banana

This is an n8n community node that allows you to generate images using Google's Gemini models (Nano Banana).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Text to Image**: Generate images from a text description.
- **Image to Image**: Generate images based on a reference image and a text prompt.

## Features

- **Models**: Support for `Gemini 2.5 Flash` and `Gemini 3 Pro` (Nano Banana Pro).
- **Aspect Ratios**: Supports various aspect ratios like 1:1, 16:9, 4:3, 3:4, 9:16, etc.
- **Resolution**: Configurable resolution for Pro models (1K, 2K, 4K).
- **Output Formats**:
  - Binary File (standard n8n binary data)
  - Base64 String
  - Base64 Data URL
  - Image URL
  - Raw Response

## Credentials

You need to set up **Nano Banana API** credentials to use this node.

1.  **Connection Type**:
    - **Official**: Connect directly to Google's Generative Language API.
    - **OpenAI Compatible**: Connect via an OpenAI-compatible endpoint.
2.  **API Key**: Your Gemini API Key.
3.  **Base URL**: (Optional) Custom base URL for OpenAI compatible connections.

## Usage

### Text to Image

1.  Select **Text to Image** operation.
2.  Choose your **Model**.
3.  Enter a descriptive **Prompt**.
4.  Select the desired **Aspect Ratio**.
5.  Execute the node to get your generated image.

### Image to Image

1.  Select **Image to Image** operation.
2.  Provide **Reference Images**.
3.  Enter a **Prompt** to guide the generation.
4.  Execute the node.

#### Reference Images Field Guide

**Supported Formats:**

- **URL**: HTTP/HTTPS image links

  ```
  https://example.com/image.jpg
  ```

- **Data URI**: Base64-encoded image data

  ```
  data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
  ```

- **Raw Base64**: Direct Base64 string (auto-detected as PNG)

  ```
  iVBORw0KGgoAAAANSUhEUgAA...
  ```

- **Binary Field Name**: Read from previous node's binary data
  ```
  data
  image1
  ```

**Multiple Images Separator:**

Use **pipe `|`** or **newline** to separate multiple images:

```
data|image1
```

or

```
data
image1
```

**Mix Different Formats:**

```
data|https://example.com/image.jpg
```

or

```
data
https://example.com/image.jpg
data:image/png;base64,iVBORw0KGgo...
```

**Quantity Limits:**

- Flash model supports up to **3** reference images
- Pro model supports up to **14** reference images

## Compatibility

Compatible with n8n@1.0.0 or later.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Gemini API Image Generation Docs](https://ai.google.dev/gemini-api/docs/image-generation)
