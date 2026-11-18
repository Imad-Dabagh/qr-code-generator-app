'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '@/app/actions/session'
import { Button } from '@/components/ui/button'
import { AppLogo } from './app-logo'

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
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f6] px-6 py-12 text-zinc-950">
      <section className="flex w-full max-w-[400px] flex-col items-center text-center">
        <AppLogo />
        <div className="mt-7 flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Private workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            QR Code Generator
          </h1>
          <p className="mx-auto max-w-[300px] text-sm leading-6 text-zinc-500">
            Create clean, ready-to-share QR codes in seconds.
          </p>
        </div>
        <form
          className="mt-8 flex w-full flex-col gap-3 text-left"
          action={formAction}
          aria-busy={pending}
        >
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-800"
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
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/5"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={pending}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <p id="password-status" className="min-h-5 text-xs text-red-700" aria-live="polite">
            {pending ? null : error}
          </p>
          <Button
            type="submit"
            disabled={pending}
            className="mt-1 h-12 rounded-xl bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {pending ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
        <p className="mt-8 text-xs text-zinc-500">
          Use the shared password to access this workspace.
        </p>
      </section>
    </main>
  )
}
