// Simple in-memory session store (in production, use Redis or database)
const sessions = new Map<string, { 
  verifiedAt: number
  ipAddress?: string 
}>()

// Session expires after 2 hours
const SESSION_DURATION = 2 * 60 * 60 * 1000

export function generateSessionId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
}

export function createSession(sessionId: string, ipAddress?: string): void {
  sessions.set(sessionId, {
    verifiedAt: Date.now(),
    ipAddress
  })
  
  // Clean up expired sessions periodically
  cleanupExpiredSessions()
}

export function isSessionValid(sessionId: string, ipAddress?: string): boolean {
  const session = sessions.get(sessionId)
  if (!session) return false
  
  // Check if session expired
  if (Date.now() - session.verifiedAt > SESSION_DURATION) {
    sessions.delete(sessionId)
    return false
  }
  
  // Optional: Check IP address match for extra security
  if (ipAddress && session.ipAddress && session.ipAddress !== ipAddress) {
    return false
  }
  
  return true
}

export function removeSession(sessionId: string): void {
  sessions.delete(sessionId)
}

function cleanupExpiredSessions(): void {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (now - session.verifiedAt > SESSION_DURATION) {
      sessions.delete(id)
    }
  }
}