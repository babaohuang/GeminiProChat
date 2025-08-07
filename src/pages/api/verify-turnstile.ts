import { verifyTurnstileToken } from '@/utils/turnstile'
import { createSession } from '@/utils/session'
import type { APIRoute } from 'astro'

const turnstileSecretKey = import.meta.env.TURNSTILE_SECRET_KEY || ''

export const post: APIRoute = async(context) => {
  const body = await context.request.json()
  const { token, sessionId } = body

  if (!token || !sessionId) {
    return new Response(JSON.stringify({
      error: {
        message: 'Token and session ID are required.',
      },
    }), { status: 400 })
  }

  // If Turnstile is not configured, always succeed
  if (!turnstileSecretKey) {
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  // Verify the Turnstile token
  const isValid = await verifyTurnstileToken(token, turnstileSecretKey)
  
  if (isValid) {
    // Get client IP for extra security (optional)
    const ipAddress = context.request.headers.get('x-forwarded-for') || 
                     context.request.headers.get('x-real-ip') || 
                     context.clientAddress

    // Create session
    createSession(sessionId, ipAddress)
    
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } else {
    return new Response(JSON.stringify({
      error: {
        message: 'Verification failed. Please try again.',
      },
    }), { status: 403 })
  }
}