import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Create clean, ready-to-share QR codes in seconds.',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          theme="light"
          visibleToasts={2}
          mobileOffset={{ left: 16, right: 16, bottom: 'max(16px, env(safe-area-inset-bottom))' }}
          toastOptions={{ classNames: { toast: 'font-sans shadow-sm' } }}
        />
      </body>
    </html>
  )
}
