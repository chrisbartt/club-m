'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { resetPassword } from '@/domains/auth/actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params.token as string

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres')
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      const result = await resetPassword({ token, password, confirmPassword })

      if (result.success) {
        setSuccess(true)
      } else if (result.error === 'INVALID_INPUT') {
        setError('Verifiez que votre mot de passe contient au moins 8 caracteres.')
      } else {
        setTokenExpired(true)
        setError(result.error)
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Mot de passe reinitialise</CardTitle>
          <CardDescription>
            Votre mot de passe a ete reinitialise avec succes. Vous pouvez maintenant vous connecter.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Se connecter
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (tokenExpired) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Lien invalide ou expire</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Demander un nouveau lien
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Nouveau mot de passe</CardTitle>
        <CardDescription>Choisissez votre nouveau mot de passe</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Reinitialisation...' : 'Reinitialiser le mot de passe'}
          </Button>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Retour a la connexion
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
