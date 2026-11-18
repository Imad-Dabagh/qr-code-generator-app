'use client'

import { useState } from 'react'
import { GeneratorScreen, type QrStyle } from '@/components/generator-screen'
import { PasswordScreen } from '@/components/password-screen'

export default function Home() {
  const [showPassword, setShowPassword] = useState(false)
  const [url, setUrl] = useState('')
  const [style, setStyle] = useState<QrStyle>('rounded')
  const [filename, setFilename] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) {
    return (
      <PasswordScreen
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((visible) => !visible)}
        onContinue={() => setUnlocked(true)}
      />
    )
  }

  return (
    <GeneratorScreen
      url={url}
      onUrlChange={setUrl}
      style={style}
      onStyleChange={setStyle}
      filename={filename}
      onFilenameChange={setFilename}
      onLogout={() => setUnlocked(false)}
    />
  )
}
