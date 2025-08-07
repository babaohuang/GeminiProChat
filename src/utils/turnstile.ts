interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function verifyTurnstileToken(token: string, secretKey: string): Promise<boolean> {
  if (!token || !secretKey) {
    return false
  }

  try {
    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error('Turnstile verification failed with status:', response.status)
      return false
    }

    const data: TurnstileVerifyResponse = await response.json()
    
    if (!data.success && data['error-codes']) {
      console.error('Turnstile verification errors:', data['error-codes'])
    }

    return data.success
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}