'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { logout } from '@/app/actions/session'
import { Check, Download, LogOut, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppLogo } from './app-logo'
import { MiniQr } from './mock-qr'
import { getQrUrl, useQrCode, type QrFormat, type QrStyle } from './use-qr-code'

const qrStyles = [
  { value: 'rounded', label: 'Rounded', description: 'Soft corners' },
  { value: 'classic', label: 'Classic', description: 'Sharp modules' },
] as const

export function GeneratorScreen() {
  const [url, setUrl] = useState('')
  const [style, setStyle] = useState<QrStyle>('rounded')
  const [filename, setFilename] = useState('')
  const input = url.trim()
  const destination = getQrUrl(input)
  const invalid = !!input && !destination
  const { preview, ready, error, failed, download } = useQrCode(destination, style)

  async function downloadQr(format: QrFormat) {
    const label = format.toUpperCase()
    const id = `qr-download-${format}`
    try {
      if (await download(format, filename)) {
        toast.success(`${label} download started.`, { id })
      }
    } catch {
      toast.error(`Could not download the ${label}. Try again.`, { id })
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f6] text-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <AppLogo />
          <span className="text-sm font-semibold tracking-[-0.02em]">
            QR Code Generator
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-900"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </form>
      </header>
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 lg:px-10 lg:pt-14">
        <div className="mb-10 max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500">
            <Sparkles className="size-3.5" /> Simple by design
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Make a QR code
            <br />
            <span className="text-zinc-400">for anything.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-zinc-500">
            Paste a link, choose a style, and download a polished QR code ready
            to use anywhere.
          </p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(24,24,27,.03)] sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                01 / Configure
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                Your QR code
              </h2>
            </div>
            <div className="flex flex-col gap-7">
              <div>
                <label htmlFor="url" className="text-sm font-medium">
                  Website URL
                </label>
                <p id="url-help" className="mt-1.5 text-xs leading-5 text-zinc-400">
                  The QR code will open this link directly.
                </p>
                <input
                  id="url"
                  value={url}
                  type="url"
                  autoComplete="url"
                  spellCheck={false}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? 'url-help url-error' : 'url-help'}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="mt-3 h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                />
                {invalid && (
                  <p id="url-error" className="mt-2 text-xs text-red-700">
                    Enter a valid URL starting with https:// or http://.
                  </p>
                )}
              </div>
              <div role="radiogroup" aria-labelledby="qr-style-label">
                <div className="flex items-end justify-between">
                  <div>
                    <p id="qr-style-label" className="text-sm font-medium">
                      QR Code Style
                    </p>
                    <p className="mt-1.5 text-xs text-zinc-400">
                      Choose the look that fits your brand.
                    </p>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {style === 'rounded' ? 'Rounded' : 'Classic'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 min-[480px]:grid-cols-2 gap-3">
                  {qrStyles.map(({ value, label, description }) => (
                    <label key={value} className="relative block">
                      <input
                        className="peer sr-only"
                        type="radio"
                        name="qr-style"
                        value={value}
                        checked={style === value}
                        onChange={() => setStyle(value)}
                      />
                      <span className="flex h-full items-center gap-3 rounded-xl border border-zinc-200 p-3 text-left transition hover:border-zinc-400 peer-checked:border-zinc-950 peer-checked:bg-zinc-50 peer-checked:ring-1 peer-checked:ring-zinc-950 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-950">
                        <MiniQr rounded={value === 'rounded'} />
                        <span>
                          <span className="block text-sm font-medium">
                            {label}
                          </span>
                          <span className="mt-1 block text-xs text-zinc-400">
                            {description}
                          </span>
                        </span>
                        {style === value && (
                          <Check
                            aria-hidden="true"
                            className="ml-auto self-start size-4"
                          />
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="filename" className="text-sm font-medium">
                  Filename{' '}
                  <span className="font-normal text-zinc-400">(Optional)</span>
                </label>
                <input
                  id="filename"
                  value={filename}
                  onChange={(event) => setFilename(event.target.value)}
                  placeholder="qr-code"
                  className="mt-3 h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                />
                <p className="mt-2 text-xs text-zinc-400">
                  Leave empty to use qr-code.
                </p>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-[0_12px_40px_rgba(24,24,27,.12)] sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  02 / Preview
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  Your result
                </h2>
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                {style}
              </span>
            </div>
            <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-xl bg-white p-5 sm:min-h-[360px]">
              <div className="flex w-full min-w-0 flex-col items-center gap-4">
                <div className="aspect-square w-full max-w-[232px] sm:max-w-[272px]">
                  {preview && (
                    <img
                      src={preview}
                      alt="QR code preview"
                      width={1000}
                      height={1000}
                      className="block size-full"
                    />
                  )}
                </div>
                <p className="text-center text-xs text-zinc-500" aria-live="polite">
                  {error || (!destination
                    ? 'Enter a URL to generate your preview'
                    : failed ? 'Preview unavailable' : ready ? 'Ready to download' : 'Updating preview…')}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                disabled={!ready}
                onClick={() => void downloadQr('png')}
                className="h-12 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                <Download data-icon="inline-start" /> PNG
              </Button>
              <Button
                disabled={!ready}
                onClick={() => void downloadQr('svg')}
                variant="outline"
                className="h-12 rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white disabled:border-white/10 disabled:text-zinc-600"
              >
                <Download data-icon="inline-start" /> SVG
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-zinc-600">
              High resolution · Black on white
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
