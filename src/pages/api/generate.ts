import { startChatAndSendMessageStream } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'

export const config = {
  runtime: 'edge', // this is a pre-requisite
  // execute this function on iad1 or hnd1, based on the connecting client location
  regions: ['arn1', 'bom1', 'cdg1', 'cle1', 'cpt1', 'dub1', 'fra1', 'gru1', 'hnd1', 'iad1', 'icn1', 'kix1', 'lhr1', 'pdx1', 'sfo1', 'sin1', 'syd1'],
}

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
        for await (const chunk of stream) {
          const text = await chunk.text()
          const queue = new TextEncoder().encode(text)
          controller.enqueue(queue)
        }
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
