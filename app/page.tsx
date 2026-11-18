import { GeneratorScreen } from '@/components/generator-screen'
import { PasswordScreen } from '@/components/password-screen'
import { hasSession } from '@/lib/session'

export default async function Home() {
  return (await hasSession()) ? <GeneratorScreen /> : <PasswordScreen />
}
