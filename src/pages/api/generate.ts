import { sendMessage } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'

const sitePassword = import.meta.env.SITE_PASSWORD || ''
const passList = sitePassword.split(',') || []

export const post: APIRoute = async(context) => {
  const body = await context.request.json()
  const { sign, time, messages, pass } = body

  if (!messages) {
    return new Response(JSON.stringify({
      error: {
        message: 'No input text.',
      },
    }), { status: 400 })
  }

  if (sitePassword && !(sitePassword === pass || passList.includes(pass))) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid password.',
      },
    }), { status: 401 })
  }

  if (import.meta.env.PROD && !await verifySignature({ t: time, m: messages[messages.length - 1].parts.map(part => part.text).join('') }, sign)) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid signature.',
      },
    }), { status: 401 })
  }

  try {
    const result = await sendMessage(messages)
    let text = ''
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      text += chunkText
    }
    return new Response(JSON.stringify({ text }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({
      error: {
        code: error.name,
        message: error.message,
      },
    }), { status: 500 })
  }
}
