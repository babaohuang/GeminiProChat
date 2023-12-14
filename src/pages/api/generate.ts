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
    const stream = await startChatAndSendMessageStream(history, newMessage)

    const responseStream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder('utf-8')
        for await (const chunk of stream) {
          // Assuming `chunk` is a `Response` object, we need to get the text from it
          const textChunk = await chunk.text()
          // Decode the text chunk while respecting UTF-8 multi-byte characters
          const text = decoder.decode(new TextEncoder().encode(textChunk), { stream: true })
          // Enqueue the text to the stream
          controller.enqueue(text)
        }
        // Once the stream is finished, flush the decoder to get any trailing text
        controller.enqueue(decoder.decode())
        controller.close()
      },
    })

    return new Response(responseStream, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({
      error: {
        code: error.name,
      },
    }), { status: 500 })
  }
}
