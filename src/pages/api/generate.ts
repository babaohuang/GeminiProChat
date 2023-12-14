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
        const decoder = new TextDecoder('utf-8', { stream: true }) // Use the streaming option
        let buffer = new Uint8Array()

        for await (const chunk of stream) {
          const chunkAsText = await chunk.text()
          const chunkAsUint8Array = new TextEncoder().encode(chunkAsText)
          // Combine the buffered bytes with the new bytes
          const combinedChunk = new Uint8Array(buffer.length + chunkAsUint8Array.length)
          combinedChunk.set(buffer)
          combinedChunk.set(chunkAsUint8Array, buffer.length)

          // Find the last complete UTF-8 character
          let end = combinedChunk.length
          while (end > 0 && (combinedChunk[end - 1] & 0xC0) === 0x80)
            end--

          // Decode the complete characters, and buffer the rest
          const text = decoder.decode(combinedChunk.subarray(0, end), { stream: true })
          buffer = combinedChunk.subarray(end)
          controller.enqueue(new TextEncoder().encode(text))
        }

        // Decode any remaining bytes
        if (buffer.length > 0) {
          const text = decoder.decode(buffer, { stream: false }) // Flush the decoder
          controller.enqueue(new TextEncoder().encode(text))
        }

        controller.close()
      },
    })

    return new Response(responseStream, { status: 200, headers: { 'Content-Type': 'text/plain' } })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({
      error: {
        code: error.name,
      },
    }), { status: 500 })
  }
}
