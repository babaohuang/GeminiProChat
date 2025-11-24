# GeminiProChat

[English](README.md) | [中文](README_cn.md) | [Italiano](README_it.md) | [日本語](README_jp.md) | Español

Interfaz web minimalista para Gemini Pro Chat.

> [!WARNING]
> **Descargo de responsabilidad:** Este proyecto no está afiliado, respaldado ni patrocinado por Google. Es un proyecto independiente que utiliza la API de Gemini Pro de Google.

Demo en vivo: [Gemini Pro Chat](https://gprochat.orzllc.com)

[![image](https://github.com/babaohuang/GeminiProChat/assets/559171/d02fd440-401a-410d-a112-4b10935624c6)](https://www.geminiprochat.com)

## Despliegue

### Desplegar con Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/babaohuang/GeminiProChat&env=GEMINI_API_KEY&envDescription=Google%20API%20Key%20for%20GeminiProChat&envLink=https://makersuite.google.com/app/apikey&project-name=gemini-pro-chat&repository-name=gemini-pro-chat&demo-title=Gemini%20Pro%20Chat&demo-description=Minimal%20web%20UI%20for%20Gemini%20Pro.&demo-url=https%3A%2F%2Fgeminiprochat.com&demo-image=https%3A%2F%2Fgeminiprochat.com%2Ficon.svg)

Haz clic en el botón de arriba y sigue las instrucciones para desplegar tu propia copia de la aplicación.


### Desplegar en Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/v9QL5u?referralCode=tSzmIe)

Haz clic en el botón de arriba y sigue las instrucciones para desplegar en Railway.

### Desplegar en Zeabur

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/1103PJ)

Haz clic en el botón de arriba y sigue las instrucciones para desplegar en Zeabur.

### Desplegar con Docker

Para desplegar con Docker, puedes utilizar el siguiente comando:

```bash
docker run --name geminiprochat \
--restart always \
-p 3000:3000 \
-itd \
-e GEMINI_API_KEY=your_api_key_here \
babaohuang/geminiprochat:latest
```
Asegúrate de reemplazar `your_api_key_here` con tu propia clave API de GEMINI.

Esto iniciará el servicio **geminiprochat**, accesible en `http://localhost:3000`. 

## Variables de Entorno

Puedes controlar el sitio web a través de variables de entorno.

| Nombre | Descripción | Requerido |
| --- | --- | --- |
| `GEMINI_API_KEY` | Tu clave API para GEMINI. Puedes obtenerla [aquí](https://makersuite.google.com/app/apikey).| **✔** |
| `API_BASE_URL` | URL base personalizada para la API de GEMINI. Haz clic [aquí](https://github.com/babaohuang/GeminiProChat?tab=readme-ov-file#solution-for-user-location-is-not-supported-for-the-api-use) para ver cuándo usar esto. | ❌ |
| `HEAD_SCRIPTS` | Inyectar análisis u otros scripts antes de `</head>` de la página. | ❌ |
| `PUBLIC_SECRET_KEY` | String secreta para el proyecto. Se usa para generar firmas (signatures) para las llamadas a la API. | ❌ |
| `SITE_PASSWORD` | Establecer contraseña para el sitio, soporta múltiples contraseñas separadas por coma. Si no se establece, el sitio será público. | ❌ |
| `GEMINI_MODEL_NAME` | El modelo Gemini a utilizar. Por defecto es `gemini-2.5-flash` si no se establece. | ❌ |

## Ejecución Local

### Requisitos previos
1. **Node**: Verifica que tanto tu entorno de desarrollo como el de despliegue estén usando `Node v18` o superior. Puedes usar [nvm](https://github.com/nvm-sh/nvm) para gestionar múltiples versiones de `node` localmente.

   ```bash
    node -v
   ```

2. **PNPM**: Recomendamos usar [pnpm](https://pnpm.io/) para gestionar las dependencias. Si nunca has instalado pnpm, puedes instalarlo con el siguiente comando:

   ```bash
    npm i -g pnpm
   ```

3. **GEMINI_API_KEY**: Antes de ejecutar esta aplicación, necesitas obtener la clave API de Google. Puedes registrar la clave API en [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).

### Primeros Pasos

1. Instalar dependencias

   ```bash
    pnpm install
   ```

2. Copia el archivo `.env.example`, renómbralo a `.env`, y añade tu [`GEMINI_API_KEY`](https://makersuite.google.com/app/apikey) al archivo `.env`.

   ```bash
    GEMINI_API_KEY=AIzaSy...
   ```

3. Ejecuta la aplicación, el proyecto local se ejecuta en `http://localhost:3000/`.

   ```bash
    pnpm run dev
   ```

## Agradecimientos

Este proyecto está inspirado y basado en el siguiente proyecto de código abierto:

- [ChatGPT-Demo](https://github.com/anse-app/chatgpt-demo) - Para la base de código y las características fundamentales.

## Historial de Estrellas (Stars)

[![Star History Chart](https://api.star-history.com/svg?repos=babaohuang/geminiprochat&type=Timeline)](https://star-history.com/#babaohuang/geminiprochat&Timeline)

## Invitame un café

Si este repositorio te resulta útil, invítame un café, ¡muchas gracias! 😄

<a href="https://www.buymeacoffee.com/babaohuang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Herramientas de IA Recomendadas


[ElevenMusic | World's best AI music generator](https://elevenmusic.ai?utm_source=geminiprochatgithub)