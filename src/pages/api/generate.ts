import { startChatAndSendMessageStream } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'

const sitePassword = import.meta.env.SITE_PASSWORD || ''
const passList = sitePassword.split(',') || []

export const post: APIRoute = async(context) => {
  const body = await context.request.json()
  const { sign, time, messages, pass } = body

  if (!messages || messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid message history: The last message must be from user role.',
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
    const history = messages.slice(0, -1) // All messages except the last one
    const newMessage = messages[messages.length - 1].parts.map(part => part.text).join('')

    // Start chat and send message with streaming
    const responseStream = await startChatAndSendMessageStream(history, newMessage)

    return new Response(responseStream, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (error) {
    console.error(error)
    const errorMessage = error.message
    const regex = /https?:\/\/[^\s]+/g
    const filteredMessage = errorMessage.replace(regex, '').trim()
    const messageParts = filteredMessage.split('[400 Bad Request]')
    const cleanMessage = messageParts.length > 1 ? messageParts[1].trim() : filteredMessage

    return new Response(JSON.stringify({
      error: {
        code: error.name,
        message: cleanMessage,
      },
    }), { status: 500 })
  }
}
