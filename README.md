# GeminiProChat

Minimal web UI for GeminiPro Chat.

Live demo: [Gemini Pro Chat](https://www.geminiprochat.com)

[![image](https://github.com/babaohuang/GeminiProChat/assets/559171/d02fd440-401a-410d-a112-4b10935624c6)](https://www.geminiprochat.com)

## Acknowledgements

This project is inspired by and based on the following open-source project:

- [ChatGPT-Demo](https://github.com/anse-app/chatgpt-demo) - For the foundational codebase and features.


## Running Locally

### Pre environment
1. **Node**: Check that both your development environment and deployment environment are using `Node v18` or later. You can use [nvm](https://github.com/nvm-sh/nvm) to manage multiple `node` versions locally.

   ```bash
    node -v
   ```

2. **PNPM**: We recommend using [pnpm](https://pnpm.io/) to manage dependencies. If you have never installed pnpm, you can install it with the following command:

   ```bash
    npm i -g pnpm
   ```

3. **GEMINI_API_KEY**: Before running this application, you need to obtain the API key from Google. You can register the API key at [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).

### Getting Started

1. Install dependencies

   ```bash
    pnpm install
   ```

2. Copy the `.env.example` file, then rename it to `.env`, and add your [GEMINI API key](https://makersuite.google.com/app/apikey) to the `.env` file.

   ```bash
    GEMINI_API_KEY=AIzaSy...
   ```

3. Run the application, the local project runs on `http://localhost:3000/`

   ```bash
    pnpm run dev
   ```

## Deploy

### Deploy With Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/babaohuang/GeminiProChat&env=GEMINI_API_KEY)

Just click the button above and follow the instructions to deploy your own copy of the app.

