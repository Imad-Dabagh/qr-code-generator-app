import 'server-only'

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const secure = process.env.NODE_ENV === 'production'
const cookieName = secure ? '__Host-qr-session' : 'qr-session'
const cookieOptions = { httpOnly: true, sameSite: 'lax', secure, path: '/' } as const
const sessionLifetime = 12 * 60 * 60 * 1000

export function getAuthConfig() {
  const password = process.env.APP_PASSWORD
  const secret = process.env.APP_SESSION_SECRET
  if (!password || !secret || !/^[a-f0-9]{64}$/i.test(secret)) return null

  // Changing either secret invalidates existing sessions.
  const signingKey = createHmac('sha256', Buffer.from(secret, 'hex'))
    .update('qr-session:v1:')
    .update(password)
    .digest()

  return { password, signingKey }
}

function sign(payload: string, key: Buffer) {
  return createHmac('sha256', key).update(payload).digest('base64url')
}

export async function hasSession() {
  const cookieStore = await cookies()
  const config = getAuthConfig()
  if (!config) return false

  const token = cookieStore.get(cookieName)?.value
  // Omitting Expires and Max-Age makes this a browser-session cookie.
  const match = token?.match(/^([0-9]{13}\.[a-f0-9]{32})\.([A-Za-z0-9_-]{43})$/)
  if (!match) return false

  const [, payload, signature] = match
  const expiresAt = Number(payload.split('.')[0])
  return (
    expiresAt > Date.now() &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(sign(payload, config.signingKey)))
  )
}

export async function createSession(key: Buffer) {
  const payload = `${Date.now() + sessionLifetime}.${randomBytes(16).toString('hex')}`
  const token = `${payload}.${sign(payload, key)}`
  const cookieStore = await cookies()
  cookieStore.set(cookieName, token, cookieOptions)
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(cookieName, '', { ...cookieOptions, maxAge: 0 })
}
