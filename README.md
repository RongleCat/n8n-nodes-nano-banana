[English](./README_EN.md) | 简体中文

## 🚀 拒绝无效加班，掌握 n8n 自动化黑科技

想让工作更轻松?扫码关注微信公众号 **【曹工不加班】**,免费获取:

- 📚 **独家保姆级 n8n 实战教程**
- 🧩 **社区专享 VIP 节点**
- 💡 **高阶自动化工作流模板**

![曹工不加班](https://pic.fmcat.top/AI/other/gzh.webp)

---

# n8n-nodes-nano-banana

这是一个 n8n 社区节点，允许你使用 Google 的 Gemini 模型 (Nano Banana) 生成图像。

[n8n](https://n8n.io/) 是一个 [公平代码许可](https://docs.n8n.io/sustainable-use-license/) 的工作流自动化平台。

[安装](#安装)
[操作](#操作)
[凭证](#凭证)
[兼容性](#兼容性)
[使用说明](#使用说明)
[资源](#资源)

## 安装

请遵循 n8n 社区节点文档中的 [安装指南](https://docs.n8n.io/integrations/community-nodes/installation/)。

## 操作

- **文本生图 (Text to Image)**：根据文本描述生成图像。
- **图生图 (Image to Image)**：基于参考图像和文本提示词生成图像。

## 功能特性

- **模型**：支持 `Gemini 2.5 Flash` 和 `Gemini 3 Pro` (Nano Banana Pro)。
- **纵横比**：支持多种纵横比，如 1:1, 16:9, 4:3, 3:4, 9:16 等。
- **分辨率**：Pro 模型可配置分辨率 (1K, 2K, 4K)。
- **输出格式**：
  - 二进制文件 (标准 n8n 二进制数据)
  - Base64 字符串
  - Base64 Data URL
  - 图像 URL
  - 原始响应 (Raw Response)

## 凭证

你需要设置 **Nano Banana API** 凭证才能使用此节点。

1.  **连接类型**:
    - **Official**:直接连接到 Google 的 Generative Language API。
    - **OpenAI Compatible**:通过 OpenAI 兼容的端点连接。
2.  **API Key**:你的 Gemini API 密钥。
3.  **Base URL**:(可选)用于 OpenAI 兼容连接的自定义 Base URL。

## 使用说明

### 文本生图 (Text to Image)

1.  选择 **Text to Image** 操作。
2.  选择你的 **模型 (Model)**。
3.  输入描述性的 **提示词 (Prompt)**。
4.  选择所需的 **纵横比 (Aspect Ratio)**。
5.  执行节点以获取生成的图像。

### 图生图 (Image to Image)

1.  选择 **Image to Image** 操作。
2.  提供 **参考图像 (Reference Images)**（URL 或 Base64 字符串）。
    - Flash 模型最多支持 3 张参考图。
    - Pro 模型最多支持 14 张参考图。
3.  输入 **提示词 (Prompt)** 来引导生成。
4.  执行节点。

## 兼容性

兼容 n8n@1.0.0 或更高版本。

## 资源

- [n8n 社区节点文档](https://docs.n8n.io/integrations/#community-nodes)
- [Gemini API 图像生成文档](https://ai.google.dev/gemini-api/docs/image-generation)
