'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { isIP } from 'node:net'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { clearSession, createSession, getAuthConfig } from '@/lib/session'

const maxFailures = 5
const windowMs = 5 * 60 * 1000
const maxBuckets = 1024
const failures = new Map<string, { count: number; expiresAt: number }>()

function digest(password: string) {
  return createHash('sha256').update(password).digest()
}

export async function login(formData: FormData) {
  const config = getAuthConfig()
  if (!config) return { error: 'Sign-in is unavailable right now.' }

  // Only trust a client IP from the hosting platform. Other hosts share one bucket.
  const ip = process.env.VERCEL === '1'
    ? (await headers()).get('x-vercel-forwarded-for')
    : null
  const bucket = ip && isIP(ip) ? ip : 'shared'
  const now = Date.now()
  const previous = failures.get(bucket)
  const active = previous && previous.expiresAt > now ? previous : undefined
  const rateLimitError = { error: 'Too many attempts. Try again in a few minutes.' }

  if (active && active.count >= maxFailures) return rateLimitError

  const password = formData.get('password')
  if (typeof password !== 'string' || !password) return { validationError: 'Enter the shared password.' }
  if (!timingSafeEqual(digest(password), digest(config.password))) {
    if (!active && failures.size >= maxBuckets) {
      for (const [key, entry] of failures) {
        if (entry.expiresAt <= now) failures.delete(key)
      }
      if (failures.size >= maxBuckets) return rateLimitError
    }

    failures.set(bucket, {
      count: (active?.count ?? 0) + 1,
      expiresAt: active?.expiresAt ?? now + windowMs,
    })
    return { validationError: 'Incorrect password. Try again.' }
  }

  failures.delete(bucket)
  await createSession(config.signingKey)
  return { success: true }
}

export async function logout() {
  await clearSession()
  redirect('/')
}
