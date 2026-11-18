'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '@/app/actions/session'
import { Button } from '@/components/ui/button'
import { AppLogo } from './app-logo'
import { QrBackground } from './qr-background'

export function PasswordScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, formAction, pending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      try {
        const result = await login(formData)
        if (result.success) toast.success('Signed in.', { id: 'sign-in' })
        else if (result.error) toast.error(result.error, { id: 'sign-in' })
        return result.validationError ?? null
      } catch {
        toast.error('Could not sign in. Please try again.', { id: 'sign-in' })
        return null
      }
    },
    null,
  )

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center bg-[#f7f7f6] px-4 py-6 text-zinc-950 sm:px-6 sm:py-10">
      <QrBackground />
      <section aria-labelledby="login-heading" className="flex w-full max-w-[420px] flex-col items-center rounded-3xl border border-zinc-200/80 bg-white p-6 text-center shadow-[0_2px_6px_rgba(24,24,27,0.04),0_16px_40px_-12px_rgba(24,24,27,0.16),0_32px_72px_-24px_rgba(24,24,27,0.12)] sm:p-8">
        <div className="[&>div]:size-16 [&>div]:rounded-[20px] [&_svg]:size-9 sm:[&>div]:size-18 sm:[&_svg]:size-10">
          <AppLogo />
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <h1 id="login-heading" className="text-2xl font-bold tracking-[-0.04em] sm:text-[28px]">
            Welcome back
          </h1>
          <p className="mx-auto max-w-[300px] text-sm leading-6 text-zinc-500">
            Create clean, ready-to-share QR codes in seconds.
          </p>
        </div>
        <form
          className="mt-6 flex w-full flex-col gap-1 text-left"
          action={formAction}
          aria-busy={pending}
        >
          <label
            htmlFor="password"
            className="sr-only"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={pending}
              aria-invalid={!pending && !!error}
              aria-describedby="password-status"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 pr-14 text-base sm:text-sm outline-none transition placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/5 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/10"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={pending}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <p id="password-status" className="-mb-1 min-h-4 text-xs leading-4 text-red-700" aria-live="polite">
            {pending ? null : error}
          </p>
          <Button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-xl bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {pending ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
      </section>
    </main>
  )
}
