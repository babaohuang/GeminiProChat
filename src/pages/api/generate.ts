// #vercel-disable-blocks
import { fetch } from 'undici'
// #vercel-end
import { generatePayload, parseStreamResponse } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'

const apiKey = import.meta.env.GEMINI_API_KEY
const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent'

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
  if (import.meta.env.PROD && !await verifySignature({ t: time, m: messages?.[messages.length - 1]?.parts[0]?.text || '' }, sign)) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid signature.',
      },
    }), { status: 401 })
  }
  
  console.log('Received messages:', messages);

  // 验证 messages 是否为数组
  if (!Array.isArray(messages)) {
    console.error('Expected messages to be an array, but received:', messages);
    return new Response(JSON.stringify({
      error: {
        message: 'The messages field must be an array.',
      },
    }), { status: 400 });
  }


  const initOptions = generatePayload(messages)

  const response = await fetch(`${baseUrl}?key=${apiKey}`, initOptions).catch((err: Error) => {
    console.error(err)
    return new Response(JSON.stringify({
      error: {
        code: err.name,
        message: err.message,
      },
    }), { status: 500 })
  }) as Response

  return parseStreamResponse(response) as Response
}
