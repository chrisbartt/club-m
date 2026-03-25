'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { verifyEmail } from '@/domains/auth/actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const params = useParams()
  const token = params.token as string

  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function verify() {
      try {
        const result = await verifyEmail({ token })
        if (result.success) {
          setStatus('success')
        } else {
          setErrorMessage(result.error)
          setStatus('error')
        }
      } catch {
        setErrorMessage('Une erreur est survenue. Veuillez reessayer.')
        setStatus('error')
      }
    }

    verify()
  }, [token])

  if (status === 'loading') {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verification en cours...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#a55b46] border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Email verifie !</CardTitle>
          <CardDescription>
            Votre adresse email a ete verifiee avec succes.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard">Acceder au tableau de bord</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <CardTitle className="text-2xl">Lien invalide ou expire</CardTitle>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-3">
        <Button variant="outline" asChild className="w-full">
          <Link href="/login">Retour a la connexion</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
