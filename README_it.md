# GeminiProChat

[English](README.md) | [中文](README_cn.md) | Italiano

Interfaccia utente web minimale per Gemini Pro Chat.

Live demo: [Gemini Pro Chat](https://www.geminiprochat.com)

[![image](https://github.com/babaohuang/GeminiProChat/assets/559171/d02fd440-401a-410d-a112-4b10935624c6)](https://www.geminiprochat.com)

## Distribuire

### Distribuire Con Vercel(Consigliato)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/babaohuang/GeminiProChat&env=GEMINI_API_KEY&envDescription=Google%20API%20Key%20for%20GeminiProChat&envLink=https://makersuite.google.com/app/apikey&project-name=gemini-pro-chat&repository-name=gemini-pro-chat&demo-title=Gemini%20Pro%20Chat&demo-description=Minimal%20web%20UI%20for%20Gemini%20Pro.&demo-url=https%3A%2F%2Fgeminiprochat.com&demo-image=https%3A%2F%2Fgeminiprochat.com%2Ficon.svg)

Clicca sul pulsante in alto e seguire le istruzioni per distribuire la tua copia dell'app.

> [!NOTE]
>
> #### Soluzione per "User location is not supported for the API use"
> Se riscontri il problema **"User location is not supported for the API use"**, segui questi passaggi per risolverlo:
>
> 1. Vai a questo repository [**palm-netlify-proxy**](https://github.com/antergone/palm-netlify-proxy) e fai clic su **"Deploy With Netlify"**.
> 2. Una volta completata la distribuzione, riceverai un nome di dominio assegnato da Netlify (ad esempio, `https://xxx.netlify.app`).
> 3. Nel tuo progetto **Gemini Pro Chat**, imposta una variabile di ambiente denominata "API_BASE_URL" con il valore corrispondente al dominio ottenuto dalla distribuzione del proxy Palm (`https://xxx.netlify.app`).
> 4. Ridistribuisci il tuo progetto **Gemini Pro Chat** per finalizzare la configurazione. Questo dovrebbe risolvere il problema.
>
> Grazie a [**antergone**](https://github.com/antergone/palm-netlify-proxy) per fornire questa soluzione.
>

### Distribuire Con Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/v9QL5u?referralCode=tSzmIe)

Clicca sul pulsante in alto e segui le istruzioni per schierarlo sulla Railway.

### Distribuire Con Zeabur

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/1103PJ)

Clicca sul pulsante in alto e segui le istruzioni per schierarlo su Zeabur.

### Distribuire Con Docker

Per eseguire la distribuzione con Docker, è possibile utilizzare il comando seguente:

```bash
docker run --name geminiprochat \
--restart always \
-p 3000:3000 \
-itd \
-e GEMINI_API_KEY=your_api_key_here \
babaohuang/geminiprochat:latest
```
Assicurati di sostituire `your_api_key_here` con la tua chiave API GEMINI.

Questo avvierà il servizio **geminiprochat**, accessibile da `http://localhost:3000`.

## Variabile d'ambiente

È possibile controllare il sito Web tramite variabili d'ambiente.

| Name | Description | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | La tua chiave API per GEMINI. Puoi ottenerlo da [qui](https://makersuite.google.com/app/apikey). | **✔** |
| `API_BASE_URL` | Custom base url for GEMINI API. Click [here](https://github.com/babaohuang/GeminiProChat?tab=readme-ov-file#solution-for-user-location-is-not-supported-for-the-api-use) to see when to use this. | ❌ |
| `HEAD_SCRIPTS` | Inserisci analisi o altri script prima di `</head>` della pagina | ❌ |
| `PUBLIC_SECRET_KEY` | Stringa segreta per il progetto. Utilizzare per generare firme per le chiamate API | ❌ |
| `SITE_PASSWORD` | Imposta la password per il sito, supporta più password separate da virgola. Se non impostato, il sito sarà pubblico | ❌ |

## Esecuzione locale

### Pre environment
1. **Node**: Verifica che sia l'ambiente di sviluppo che l'ambiente di distribuzione utilizzino `Node v18` o versione successiva. Puoi utilizzare [nvm](https://github.com/nvm-sh/nvm) per gestire più versioni di `nodo` localmente.

   ```bash
    node -v
   ```

2. **PNPM**: Ti consigliamo di utilizzare [pnpm](https://pnpm.io/) per gestire le dipendenze. Se non hai mai installato pnpm, puoi installarlo con il seguente comando:

   ```bash
    npm i -g pnpm
   ```

3. **GEMINI_API_KEY**: Prima di eseguire questa applicazione, devi ottenere la chiave API da Google. Puoi registrare la chiave API su [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).

### Iniziare

1. Installa le dipendenze

   ```bash
    pnpm install
   ```

2. Copia il file `.env.example`, quindi rinominalo in `.env` e aggiungi la tua [`GEMINI_API_KEY`](https://makersuite.google.com/app/apikey) al file `.env`.

   ```bash
    GEMINI_API_KEY=AIzaSy...
   ```

3. Esegui l'applicazione, il progetto locale viene eseguito su `http://localhost:3000/`.

   ```bash
    pnpm run dev
   ```

## Ringraziamenti

Questo progetto è ispirato e basato sul seguente progetto open source:

- [ChatGPT-Demo](https://github.com/anse-app/chatgpt-demo) - Per la base di codice e le funzionalità di base.

## Storia delle stelle

[![Star History Chart](https://api.star-history.com/svg?repos=babaohuang/geminiprochat&type=Timeline)](https://star-history.com/#babaohuang/geminiprochat&Timeline)

## Offrimi un caffè

Se questo repository ti è utile, offrimi un caffè, grazie mille!😄

<a href="https://www.buymeacoffee.com/babaohuang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
