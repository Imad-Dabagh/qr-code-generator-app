'use client'

import { useState } from 'react'
import { Check, Download, Eye, EyeOff, LogOut, QrCode, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const qrPattern = [
  '111111100101101111111',
  '100000101110101000001',
  '101110100010101011101',
  '101110101101101011101',
  '101110100111101011101',
  '100000101010101000001',
  '111111101010101111111',
  '000000001101100000000',
  '110101111001011101101',
  '001110001111100010010',
  '111011101010111011111',
  '010100010111001010100',
  '101111111001111110101',
  '000000001110100000000',
  '111111101011101111111',
  '100000100110101000001',
  '101110101111101011101',
  '101110100001101011101',
  '101110101101101011101',
  '100000101010101000001',
  '111111101101101111111',
]

function Logo() {
  return (
    <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
      <QrCode aria-hidden="true" className="size-5" strokeWidth={2.2} />
    </div>
  )
}

function MiniQr({ rounded = false }: { rounded?: boolean }) {
  return (
    <div className="grid size-14 grid-cols-7 gap-[2px] rounded-md bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,.08)]">
      {Array.from({ length: 49 }, (_, index) => {
        const filled = qrPattern[Math.floor(index / 7)][(index % 7) * 3] === '1'
        return <span key={index} className={filled ? `bg-zinc-900 ${rounded ? 'rounded-[2px]' : ''}` : 'bg-transparent'} />
      })}
    </div>
  )
}

function QrPreview({ rounded }: { rounded: boolean }) {
  return (
    <div className="grid size-[232px] grid-cols-21 gap-0.5 bg-white p-3 sm:size-[272px] sm:p-4">
      {qrPattern.flatMap((row, rowIndex) =>
        [...row].map((cell, cellIndex) => (
          <span key={`${rowIndex}-${cellIndex}`} className={cell === '1' ? `bg-zinc-950 ${rounded ? 'rounded-[3px]' : ''}` : 'bg-white'} />
        )),
      )}
    </div>
  )
}

export default function Home() {
  const [showPassword, setShowPassword] = useState(false)
  const [url, setUrl] = useState('')
  const [style, setStyle] = useState<'rounded' | 'classic'>('rounded')
  const [filename, setFilename] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f6] px-6 py-12 text-zinc-950">
        <section className="flex w-full max-w-[400px] flex-col items-center text-center">
          <Logo />
          <div className="mt-7 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Private workspace</p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">QR Code Generator</h1>
            <p className="mx-auto max-w-[300px] text-sm leading-6 text-zinc-500">Create clean, ready-to-share QR codes in seconds.</p>
          </div>
          <form className="mt-8 flex w-full flex-col gap-3 text-left" onSubmit={(event) => { event.preventDefault(); setUnlocked(true) }}>
            <label htmlFor="password" className="text-sm font-medium text-zinc-800">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/5" />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="min-h-5 text-xs text-zinc-400" aria-live="polite" />
            <Button type="submit" className="mt-1 h-12 rounded-xl bg-zinc-950 text-sm font-medium hover:bg-zinc-800">Continue</Button>
          </form>
          <p className="mt-8 text-xs text-zinc-400">Your workspace is private and secure.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f7f6] text-zinc-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3"><Logo /><span className="text-sm font-semibold tracking-[-0.02em]">QR Code Generator</span></div>
        <button onClick={() => setUnlocked(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-white hover:text-zinc-900"><LogOut className="size-4" /> Log out</button>
      </header>
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 lg:px-10 lg:pt-14">
        <div className="mb-10 max-w-xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500"><Sparkles className="size-3.5" /> Simple by design</div><h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Make a QR code<br /><span className="text-zinc-400">for anything.</span></h1><p className="mt-4 max-w-md text-base leading-7 text-zinc-500">Paste a link, choose a style, and download a polished QR code ready to use anywhere.</p></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(24,24,27,.03)] sm:p-8">
            <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">01 / Configure</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Your QR code</h2></div>
            <div className="flex flex-col gap-7">
              <div><label htmlFor="url" className="text-sm font-medium">Website URL</label><p className="mt-1.5 text-xs leading-5 text-zinc-400">The QR code will open this link directly.</p><input id="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className="mt-3 h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5" /></div>
              <div><div className="flex items-end justify-between"><div><p className="text-sm font-medium">QR Code Style</p><p className="mt-1.5 text-xs text-zinc-400">Choose the look that fits your brand.</p></div><span className="text-xs text-zinc-400">{style === 'rounded' ? 'Rounded' : 'Classic'}</span></div><div className="mt-4 grid grid-cols-2 gap-3">
                {(['rounded', 'classic'] as const).map((option) => <button key={option} type="button" onClick={() => setStyle(option)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${style === option ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950' : 'border-zinc-200 hover:border-zinc-400'}`}><MiniQr rounded={option === 'rounded'} /><span><span className="block text-sm font-medium capitalize">{option}</span><span className="mt-1 block text-xs text-zinc-400">{option === 'rounded' ? 'Soft corners' : 'Sharp modules'}</span></span>{style === option && <Check className="ml-auto self-start size-4" />}</button>)}
              </div></div>
              <div><label htmlFor="filename" className="text-sm font-medium">Filename <span className="font-normal text-zinc-400">(Optional)</span></label><input id="filename" value={filename} onChange={(event) => setFilename(event.target.value)} placeholder="qr-code" className="mt-3 h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5" /><p className="mt-2 text-xs text-zinc-400">Leave empty to use qr-code.</p></div>
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-[0_12px_40px_rgba(24,24,27,.12)] sm:p-8">
            <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">02 / Preview</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Your result</h2></div><span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">{style}</span></div>
            <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-xl bg-white p-5 sm:min-h-[360px]"><div className="flex flex-col items-center gap-4"><QrPreview rounded={style === 'rounded'} /><p className="text-xs text-zinc-400">{url ? 'Preview updates as you type' : 'Enter a URL to generate your preview'}</p></div></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><Button disabled={!url} className="h-12 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-500"><Download data-icon="inline-start" /> PNG</Button><Button disabled={!url} variant="outline" className="h-12 rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white disabled:border-white/10 disabled:text-zinc-600"><Download data-icon="inline-start" /> SVG</Button></div>
            <p className="mt-4 text-center text-xs text-zinc-600">High resolution · Black on white</p>
          </section>
        </div>
      </div>
    </main>
  )
}
