# GeminiProChat

[English](README.md) | [中文](README_cn.md) | [Italiano](README_it.md) | 日本語

WebUIでGemini Proとチャットしましょう！

> [!WARNING]
> **免責事項：** このプロジェクトはGoogleとは提携しておらず、Googleによる承認や後援を受けていません。これはGoogleのGemini Pro APIを使用する独立したプロジェクトです。

Demo： [Gemini Pro Chat](https://www.geminiprochat.com)

[![image](https://github.com/babaohuang/GeminiProChat/assets/559171/d02fd440-401a-410d-a112-4b10935624c6)](https://www.geminiprochat.com)

## デプロイ

### Vercelでデプロイ（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/babaohuang/GeminiProChat&env=GEMINI_API_KEY&envDescription=Google%20API%20Key%20for%20GeminiProChat&envLink=https://makersuite.google.com/app/apikey&project-name=gemini-pro-chat&repository-name=gemini-pro-chat&demo-title=Gemini%20Pro%20Chat&demo-description=Minimal%20web%20UI%20for%20Gemini%20Pro.&demo-url=https%3A%2F%2Fgeminiprochat.com&demo-image=https%3A%2F%2Fgeminiprochat.com%2Ficon.svg)

上記のボタンをクリックして、手順に従ってアプリのコピーデプロイできます。

> [!NOTE]
> #### **"User location is not supported for the API use"** の解決策  
> **"User location is not supported for the API use"** のissueあれば，次の手順で解決します。
>
> 1. Repo [**palm-netlify-proxy**](https://github.com/antergone/palm-netlify-proxy) の **“Deploy With Netlify”** をクリック。
> 2. デプロイ完了でNetlifyからドメイン名（例えば`https://xxx.netlify.app`）をゲット。
> 3. **Gemini Pro Chat** コピープロテクトで，環境変数`API_BASE_URL`を設定する。palm proxyをデプロイして得たドメイン（https://xxx.vercel.app）を値として使用する。
> 4. **Gemini Pro Chat** 再デプロイする。
>
>  [**antergone**](https://github.com/antergone/palm-netlify-proxy) さんからの解決策にありがとうございます。

### Railwayでデプロイ

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/v9QL5u?referralCode=tSzmIe)

上記のボタンをクリックして、手順に従ってRailwayにデプロイできます。

### eaburでデプロイ

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/1103PJ)

上記のボタンをクリックして、手順に従ってeaburにデプロイできます。

### Dockerでデプロイ

Dockerでデプロイしたい方は、次のコマンドを実行し出来ます。

```bash
docker run --name geminiprochat \
--restart always \
-p 3000:3000 \
-itd \
-e GEMINI_API_KEY=your_api_key_here \
babaohuang/geminiprochat:latest
```
`your_api_key_here`に自分のGemini API keyを置き換えてください。

これで **geminiprochat** サービスをスタート、urlは http://localhost:3000。

## 環境変数

環境変数でウェブサイトを設定できます。

| 変数 | 説明 | 必要 |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini API key。[ここ](https://makersuite.google.com/app/apikey)でゲット。| **✔** |
| `API_BASE_URL` | Gemini APIのカスタムbase url。[ここ](https://github.com/babaohuang/GeminiProChat/README_cn.md#solution-for-user-location-is-not-supported-for-the-api-use)で使い方をご覧ください。| ❌ |
| `HEAD_SCRIPTS` | ウェブページの`</head>`前にscriptを入ってください。 | ❌ |
| `PUBLIC_SECRET_KEY` | プロジェクトの秘密文字列。APIコールのジェネレートシグネチャーために使います。 | ❌ |
| `SITE_PASSWORD` | ウェブサイトのパスワードを設定する。コンマ使って複数のパスワードもできる。設定しないウェブサイトは公開サイトになる。| ❌ |

## ローカルでの実行

### 要求環境
1. **Node**: `Node v18` 以上の開発まだはデプロイ環境。[nvm](https://github.com/nvm-sh/nvm) 使って`node`バージョンを管理できます。

   ```bash
    node -v
   ```

2. **PNPM**: [pnpm](https://pnpm.io/) 使って依存関係を管理する推奨。pnpm使ってない方は以下のコメントでインストールできます。

   ```bash
    npm i -g pnpm
   ```

3. **GEMINI_API_KEY**: アプリを使ってため、GoogleからAPI keyをゲットする必要です。[https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)からAPI keyを申込してください 。

### デプロイ

1. 依存関係のインストールしてください。

   ```bash
    pnpm install
   ```

2. ファイル`.env.example`をコピーし、 `.env`に名前を変更し、そのファイルに[`GEMINI_API_KEY`](https://makersuite.google.com/app/apikey)を入ってください。

   ```bash
    GEMINI_API_KEY=AIzaSy...
   ```

3. アプリを実行すると、`http://localhost:3000/`にご覧ください。

   ```bash
    pnpm run dev
   ```

## 謝辞

このアプリは以下のRepoを基づいて開発しました。

- [ChatGPT-Demo](https://github.com/anse-app/chatgpt-demo)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=babaohuang/geminiprochat&type=Timeline)](https://star-history.com/#babaohuang/geminiprochat&Timeline)

## Buy me a coffee

このアプリは役に立ちあれば、コーヒー一杯ちょうだい？😄

<a href="https://www.buymeacoffee.com/babaohuang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
