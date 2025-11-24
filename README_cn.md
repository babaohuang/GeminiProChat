# GeminiProChat

[English](README.md) | 中文 | [Italiano](README_it.md) | [日本語](README_jp.md) | [Español](README_es.md)

与 Gemini Pro 聊天的最简 WebUI。

体验网址： [Gemini Pro Chat](https://www.geminiprochat.com)

> [!WARNING]
> **免责声明：** 本项目与Google没有任何关联，也未得到Google的认可或赞助。这是一个独立项目，使用了Google的Gemini Pro API。
>
> 本项目为开源项目，使用者必须在遵循 GOOGLE 的[使用条款](https://ai.google.dev/terms)以及**法律法规**的情况下使用，不得用于非法用途。
> 
> 根据[《生成式人工智能服务管理暂行办法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)的要求，请勿对中国地区公众提供一切未经备案的生成式人工智能服务。

[![image](https://github.com/babaohuang/GeminiProChat/assets/559171/d02fd440-401a-410d-a112-4b10935624c6)](https://www.geminiprochat.com)

## 部署

### 使用 Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/babaohuang/GeminiProChat&env=GEMINI_API_KEY&envDescription=Google%20API%20Key%20for%20GeminiProChat&envLink=https://makersuite.google.com/app/apikey&project-name=gemini-pro-chat&repository-name=gemini-pro-chat&demo-title=Gemini%20Pro%20Chat&demo-description=Minimal%20web%20UI%20for%20Gemini%20Pro.&demo-url=https%3A%2F%2Fgeminiprochat.com&demo-image=https%3A%2F%2Fgeminiprochat.com%2Ficon.svg)

只需点击上面的按钮，并按照说明操作，即可部署自己的副本。

> [!NOTE]
> #### 关于 API 使用过程中 “User location is not supported for the API use” 的解决方案
> 如果你遇到了 **“User location is not supported for the API use”** 的问题，请按照以下步骤进行解决：
>
> 1. 前往 [**palm-netlify-proxy**](https://github.com/antergone/palm-netlify-proxy) 仓库并点击其中的 **“Deploy With Netlify**。
> 2. 部署完成后，你将收到 Netlify 分配的域名 （例如 `https://xxx.netlify.app`）。
> 3. 在你的 **Gemini Pro Chat** 项目中，设置名为 `API_BASE_URL` 的环境变量，其值为部署 palm-proxy 时获得的域名 (`https://xxx.netlify.app`)。
> 4. 重新部署你的 **Gemini Pro Chat** 项目来完成配置。这应该可以解决问题。
>
> 感谢 [**antergone**](https://github.com/antergone/palm-netlify-proxy) 提供解决方案。

### 使用 Railway 部署

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/v9QL5u?referralCode=tSzmIe)

只需点击上面的按钮，然后按照说明在 Railway 上进行部署。

### 使用 Zeabur 部署

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/1103PJ)

只需点击上面的按钮，然后按照说明在 Zeabur 上进行部署。

### 使用 Docker 部署

要使用 Docker 进行部署，可以使用以下命令：

```bash
docker run --name geminiprochat \
--restart always \
-p 3000:3000 \
-itd \
-e GEMINI_API_KEY=your_api_key_here \
babaohuang/geminiprochat:latest
```
请确保将 `your_api_key_here` 替换为你自己的 Gemini API 密钥。

这将启动 **geminiprochat** 服务，访问地址为 “http://localhost:3000”。

## 环境变量

你可以通过环境变量来控制网站。

| 名称 | 说明 | 必填 |
| --- | --- | --- |
| `GEMINI_API_KEY` | 你的 Gemini API 密钥。可以从[此处](https://makersuite.google.com/app/apikey) 获取。| **✔** |
| `API_BASE_URL` | Gemini API 的自定义基本 URL。点击[此处](https://github.com/babaohuang/GeminiProChat/README_cn.md#solution-for-user-location-is-not-supported-for-the-api-use)查看何时使用这个。| ❌ |
| `HEAD_SCRIPTS` | 在页面的"</head>"之前注入分析或其他脚本 | ❌ |
| `PUBLIC_SECRET_KEY` | 项目的密文字符串。用于为 API 调用生成签名 | ❌ |
| `SITE_PASSWORD` | 为网站设置密码，支持用逗号分隔的多个密码。如果不设置，网站将允许公开访问 | ❌ |
| `GEMINI_MODEL_NAME` | 自定义要使用的 Gemini 模型。如果不设置，默认为 `gemini-2.5-flash` | ❌ |

## 本地运行

### 前期环境
1. **Node**: 检查你的开发环境和部署环境是否都在使用 `Node v18` 或更高版本。你可以使用 [nvm](https://github.com/nvm-sh/nvm) 在本地管理多个 `node` 版本。

   ```bash
    node -v
   ```

2. **PNPM**: 我们建议使用 [pnpm](https://pnpm.io/) 来管理依赖关系。如果从未安装过 pnpm，可以使用以下命令进行安装：

   ```bash
    npm i -g pnpm
   ```

3. **GEMINI_API_KEY**: 在运行此应用程序之前，你需要从 Google 获取 API 密钥。你可以前往 [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)，申请 API 密钥。

### 部署

1. 安装依赖

   ```bash
    pnpm install
   ```

2. 复制 `.env.example` 文件并重命名为 `.env`，并在 `.env` 文件中添加 [`GEMINI_API_KEY`](https://makersuite.google.com/app/apikey)。

   ```bash
    GEMINI_API_KEY=AIzaSy...
   ```

3. 运行应用程序，项目会在 `http://localhost:3000/` 上运行。

   ```bash
    pnpm run dev
   ```

## 鸣谢

本项目受到以下开源项目的启发，并以其为基础：

- [ChatGPT-Demo](https://github.com/anse-app/chatgpt-demo) - 基础代码库和功能。

## 星势

[![Star History Chart](https://api.star-history.com/svg?repos=babaohuang/geminiprochat&type=Timeline)](https://star-history.com/#babaohuang/geminiprochat&Timeline)

## 请杯咖啡

如果这个项目对你有帮助，请杯咖啡，非常感谢！😄

<a href="https://www.buymeacoffee.com/babaohuang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## 推荐的 AI 工具


[ElevenMusic | World's best AI music generator](https://elevenmusic.ai?utm_source=geminiprochatgithub)
