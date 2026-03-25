'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const DEV_ACCOUNTS = [
  { email: 'grace@clubm.cd', password: 'member123', label: 'Grace Fashion', role: 'Business', color: 'bg-purple-600 hover:bg-purple-700', redirect: '/mon-business' },
  { email: 'esther@clubm.cd', password: 'member123', label: 'Chez Esther Traiteur', role: 'Business', color: 'bg-purple-600 hover:bg-purple-700', redirect: '/mon-business' },
  { email: 'ornella@clubm.cd', password: 'member123', label: 'Belle Ornella', role: 'Business', color: 'bg-purple-600 hover:bg-purple-700', redirect: '/mon-business' },
  { email: 'sarah@clubm.cd', password: 'member123', label: 'Sarah Events', role: 'Business', color: 'bg-purple-600 hover:bg-purple-700', redirect: '/mon-business' },
  { email: 'christelle@clubm.cd', password: 'member123', label: 'Christi Cosmetics', role: 'Business', color: 'bg-purple-600 hover:bg-purple-700', redirect: '/mon-business' },
  { email: 'fabiola@example.com', password: 'member123', label: 'Fabiola Tshisekedi', role: 'Free', color: 'bg-emerald-600 hover:bg-emerald-700', redirect: '/dashboard' },
  { email: 'admin@clubm.cd', password: 'admin123', label: 'Admin Club M', role: 'Admin', color: 'bg-blue-600 hover:bg-blue-700', redirect: '/admin/dashboard' },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function quickLogin(account: typeof DEV_ACCOUNTS[0]) {
    setLoading(account.email)
    const result = await signIn('credentials', {
      email: account.email,
      password: account.password,
      redirect: false,
    })
    if (result?.error) {
      setLoading(null)
      alert('Erreur de connexion: ' + result.error)
    } else {
      router.push(account.redirect)
      router.refresh()
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connexion rapide (Dev)</CardTitle>
        <CardDescription>Cliquez sur un compte pour vous connecter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Membres Business</p>
        {DEV_ACCOUNTS.filter(a => a.role === 'Business').map((account) => (
          <button
            key={account.email}
            onClick={() => quickLogin(account)}
            disabled={loading !== null}
            className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-white transition-colors ${account.color} disabled:opacity-50`}
          >
            <div className="text-left">
              <div className="font-medium">{account.label}</div>
              <div className="text-xs opacity-80">{account.email}</div>
            </div>
            <div className="text-xs opacity-70">
              {loading === account.email ? 'Connexion...' : account.role}
            </div>
          </button>
        ))}

        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-4 mb-2">Autres comptes</p>
        {DEV_ACCOUNTS.filter(a => a.role !== 'Business').map((account) => (
          <button
            key={account.email}
            onClick={() => quickLogin(account)}
            disabled={loading !== null}
            className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-white transition-colors ${account.color} disabled:opacity-50`}
          >
            <div className="text-left">
              <div className="font-medium">{account.label}</div>
              <div className="text-xs opacity-80">{account.email}</div>
            </div>
            <div className="text-xs opacity-70">
              {loading === account.email ? 'Connexion...' : account.role}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
