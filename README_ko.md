# GeminiProChat

[English](README.md) | [中文](README_cn.md) | [Italiano](README_it.md) | [日本語](README_jp.md) | 한국어

Gemini Pro Chat을 위한 미니멀한 웹 UI입니다.

> [!WARNING]
> **면책 조항:** 이 프로젝트는 Google과 제휴하거나, Google의 승인 또는 후원을 받지 않았습니다. Google의 Gemini Pro API를 사용하는 독립적인 프로젝트입니다.

라이브 데모: [Gemini Pro Chat](https://gprochat.orzllc.com)

[![image](https://github.com/babaohuang/GeminiProChat/assets/559171/d02fd440-401a-410d-a112-4b10935624c6)](https://www.geminiprochat.com)

## 배포

### Vercel로 배포하기(권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/babaohuang/GeminiProChat&env=GEMINI_API_KEY&envDescription=Google%20API%20Key%20for%20GeminiProChat&envLink=https://makersuite.google.com/app/apikey&project-name=gemini-pro-chat&repository-name=gemini-pro-chat&demo-title=Gemini%20Pro%20Chat&demo-description=Minimal%20web%20UI%20for%20Gemini%20Pro.&demo-url=https%3A%2F%2Fgeminiprochat.com&demo-image=https%3A%2F%2Fgeminiprochat.com%2Ficon.svg)

위 버튼을 클릭하고 안내에 따르면 나만의 앱 복사본을 배포할 수 있습니다.


### Railway에 배포하기

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/v9QL5u?referralCode=tSzmIe)

위 버튼을 클릭하고 안내에 따르면 Railway에 배포할 수 있습니다.

### Zeabur에 배포하기

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/1103PJ)

위 버튼을 클릭하고 안내에 따르면 Zeabur에 배포할 수 있습니다.

### Docker로 배포하기

Docker로 배포하려면 다음 명령어를 사용하면 됩니다.

```bash
docker run --name geminiprochat \
--restart always \
-p 3000:3000 \
-itd \
-e GEMINI_API_KEY=your_api_key_here \
babaohuang/geminiprochat:latest
```
`your_api_key_here` 부분은 반드시 본인의 GEMINI API 키로 바꿔주세요.

이렇게 하면 **geminiprochat** 서비스가 시작되며, `http://localhost:3000`에서 접속할 수 있습니다.

## 환경 변수

환경 변수를 통해 웹사이트를 제어할 수 있습니다.

| 이름 | 설명 | 필수 여부 |
| --- | --- | --- |
| `GEMINI_API_KEY` | GEMINI API 키입니다. [여기](https://makersuite.google.com/app/apikey)에서 발급받을 수 있습니다.| **✔** |
| `API_BASE_URL` | GEMINI API용 커스텀 base url입니다. 언제 사용해야 하는지는 [여기](https://github.com/babaohuang/GeminiProChat?tab=readme-ov-file#solution-for-user-location-is-not-supported-for-the-api-use)를 참고하세요. | ❌ |
| `HEAD_SCRIPTS` | 페이지의 `</head>` 앞에 애널리틱스나 기타 스크립트를 삽입합니다. | ❌ |
| `PUBLIC_SECRET_KEY` | 프로젝트용 비밀 문자열입니다. API 호출 서명을 생성하는 데 사용됩니다. | ❌ |
| `SITE_PASSWORD` | 사이트 비밀번호를 설정합니다. 콤마로 구분해 여러 개의 비밀번호를 지정할 수도 있습니다. 설정하지 않으면 사이트는 공개 상태가 됩니다. | ❌ |
| `GEMINI_MODEL_NAME` | 사용할 Gemini 모델을 지정합니다. 설정하지 않으면 기본값은 `gemini-2.5-flash`입니다. | ❌ |

## 로컬에서 실행하기

### 사전 환경
1. **Node**: 개발 환경과 배포 환경 모두 `Node v18` 이상을 사용하고 있는지 확인하세요. 로컬에서 여러 `node` 버전을 관리할 때는 [nvm](https://github.com/nvm-sh/nvm)을 사용할 수 있습니다.

   ```bash
    node -v
   ```

2. **PNPM**: 의존성 관리에는 [pnpm](https://pnpm.io/) 사용을 권장합니다. pnpm을 아직 설치하지 않았다면 다음 명령어로 설치할 수 있습니다.

   ```bash
    npm i -g pnpm
   ```

3. **GEMINI_API_KEY**: 이 애플리케이션을 실행하기 전에 Google에서 API 키를 발급받아야 합니다. [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)에서 API 키를 등록할 수 있습니다.

### 시작하기

1. 의존성을 설치합니다.

   ```bash
    pnpm install
   ```

2. `.env.example` 파일을 복사한 뒤 `.env`로 이름을 바꾸고, 해당 파일에 [`GEMINI_API_KEY`](https://makersuite.google.com/app/apikey)를 추가합니다.

   ```bash
    GEMINI_API_KEY=AIzaSy...
   ```

3. 애플리케이션을 실행합니다. 로컬 프로젝트는 `http://localhost:3000/`에서 실행됩니다.

   ```bash
    pnpm run dev
   ```

## 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트에서 영감을 받았으며, 이를 기반으로 만들어졌습니다.

- [ChatGPT-Demo](https://github.com/anse-app/chatgpt-demo) - 기본 코드베이스와 기능을 제공해 주었습니다.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=babaohuang/geminiprochat&type=Timeline)](https://star-history.com/#babaohuang/geminiprochat&Timeline)

## 커피 한 잔 사주기

이 저장소가 도움이 되셨다면, 커피 한 잔 사주세요. 정말 감사하겠습니다!😄

<a href="https://www.buymeacoffee.com/babaohuang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## 추천 AI 도구


[ElevenMusic | World's best AI music generator](https://elevenmusic.ai?utm_source=geminiprochatgithub)
