import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'

export type QrStyle = 'classic' | 'rounded'

const size = 1000
// At 1000px this leaves at least four modules of white space, even for version 1.
const margin = 140

type QrResult = { url: string; style: QrStyle } & (
  | { src: string }
  | { error: string }
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
        if (!canceled) setResult({ url, style, src })
      } catch {
        if (!canceled) setResult({ url, style, error: 'Could not generate this QR code. Try another URL.' })
      }
    }

    void update()
    return () => { canceled = true }
  }, [url, style])

  const current = result?.url === url && result.style === style ? result : null
  const error = current && 'error' in current ? current.error : null
  const preview = url && !error && result && 'src' in result ? result.src : null
  return { preview, ready: !!current && 'src' in current, error }
}
