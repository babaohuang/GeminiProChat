// openAI.ts
import { createParser } from 'eventsource-parser'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import type { ChatMessage } from '@/types'

export const generatePayload = (
  messages: ChatMessage[],
): RequestInit => ({
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'POST',
  body: JSON.stringify({
    contents: messages.map(message => ({
      role: message.role,
      parts: [{ text: message.content }]
    })),
  }),
})

export const parseStreamResponse = (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          try {
            const json = JSON.parse(event.data)
            json.contents.forEach((content: { parts: { text: string }[] }) => {
              content.parts.forEach(part => {
                const text = part.text
                const queue = encoder.encode(text)
                controller.enqueue(queue)
              })
            })
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any)
        parser.feed(decoder.decode(chunk))
    },
  })

  return new Response(stream)
}
