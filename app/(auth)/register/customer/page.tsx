'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { registerCustomer } from '@/domains/members/actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function RegisterCustomerPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    try {
      const result = await registerCustomer({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
      })

      if (!result.success) {
        if (result.details) {
          setFieldErrors(result.details)
        }
        toast.error(
          result.error === 'EMAIL_TAKEN'
            ? 'Cette adresse email est deja utilisee'
            : 'Erreur lors de l\'inscription'
        )
        return
      }

      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast.error('Compte cree, mais erreur de connexion. Connectez-vous manuellement.')
        router.push('/login')
      } else {
        toast.success('Bienvenue !')
        router.push('/')
        router.refresh()
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Compte Client</CardTitle>
        <CardDescription>Creez votre compte client Club M</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              {fieldErrors.firstName && (
                <p className="text-sm text-destructive">{fieldErrors.firstName[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-sm text-destructive">{fieldErrors.lastName[0]}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {fieldErrors.password && (
              <p className="text-sm text-destructive">{fieldErrors.password[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telephone (optionnel)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+243 ..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {fieldErrors.phone && (
              <p className="text-sm text-destructive">{fieldErrors.phone[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Inscription...' : 'Creer mon compte'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Deja un compte ?{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
