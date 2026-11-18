import { QrCode } from 'lucide-react'

export function AppLogo() {
  return (
    <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
      <QrCode aria-hidden="true" className="size-5" strokeWidth={2.2} />
    </div>
  )
}
