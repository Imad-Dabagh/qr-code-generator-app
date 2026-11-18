import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { toast } from 'sonner'

export type QrStyle = 'classic' | 'rounded'
export type QrFormat = 'png' | 'svg'

const size = 1000
// At 1000px this leaves at least four modules of white space, even for version 1.
const margin = 140

type QrResult = { url: string; style: QrStyle } & (
  | { src: string; svg: Blob; image: HTMLImageElement }
  | { error: string | null }
)

export function getQrUrl(input: string) {
  // Use the URL parser to validate, but encode the entered URL without normalization.
  if (!/^https?:\/\/[^/?#]/i.test(input) || /[\s\\\u0000-\u001f\u007f]/u.test(input)) {
    return null
  }
  return URL.canParse(input) ? input : null
}

export function useQrCode(url: string | null, style: QrStyle) {
  const qr = useRef<QRCodeStyling | null>(null)
  const [result, setResult] = useState<QrResult | null>(null)

  useEffect(() => {
    if (!url) {
      setResult(null)
      return
    }

    let canceled = false
    const update = async () => {
      const bytes = new TextEncoder().encode(url)
      if (bytes.length > 1273) {
        setResult({ url, style, error: 'This URL is too long for a QR code. Try a shorter link.' })
        return
      }

      try {
        qr.current ??= new QRCodeStyling({
          type: 'svg',
          width: size,
          height: size,
          margin,
          qrOptions: { errorCorrectionLevel: 'H', mode: 'Byte' },
          backgroundOptions: { color: '#ffffff' },
        })
        const shape = style === 'rounded' ? 'rounded' : 'square'
        // The library's byte encoder uses one byte per character. Supply UTF-8
        // bytes so international URLs decode to the original text.
        const data = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
        qr.current.update({
          data,
          dotsOptions: { type: shape, color: '#000000' },
          cornersSquareOptions: { type: shape, color: '#000000' },
          cornersDotOptions: { type: shape, color: '#000000' },
        })
        const svg = await qr.current.getRawData('svg')
        if (!(svg instanceof Blob)) throw new Error('Missing QR image')

        const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(await svg.text())
        if (canceled) return
        const image = new Image()
        image.src = src
        await image.decode()
        if (!canceled) setResult({ url, style, src, svg, image })
      } catch {
        if (!canceled) {
          setResult({ url, style, error: null })
          toast.error('Could not generate the QR code. Try again.', { id: 'qr-generation' })
        }
      }
    }

    void update()
    return () => { canceled = true }
  }, [url, style])

  const current = result?.url === url && result.style === style ? result : null
  const failed = current !== null && 'error' in current
  const error = failed ? current.error : null
  const preview = url && !failed && result && 'src' in result ? result.src : null
  const downloadable = current && 'src' in current ? current : null

  async function download(format: QrFormat, filename: string) {
    if (!downloadable) return false

    const blob = format === 'svg' ? downloadable.svg : await toPng(downloadable.image)
    const safeBase = normalizeFilename(filename)

    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${safeBase}.${format}`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(href), 1000)
    return true
  }

  return { preview, ready: !!downloadable, error, failed, download }
}

function normalizeFilename(filename: string) {
  const name = filename
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/gu, '-')
    .replace(/[^\p{L}\p{M}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!name) return 'qr-code'
  return /^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])$/i.test(name) ? `qr-${name}` : name
}

function toPng(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  context.drawImage(image, 0, 0, size, size)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not export PNG'))
    }, 'image/png')
  })
}
