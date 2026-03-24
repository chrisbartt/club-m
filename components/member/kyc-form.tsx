'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { submitKyc } from '@/domains/kyc/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function KycForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      idDocumentUrl: formData.get('idDocumentUrl') as string,
      selfieUrl: formData.get('selfieUrl') as string,
    }

    const result = await submitKyc(data)

    if (result.success) {
      toast.success('Documents soumis avec succes')
      router.refresh()
    } else {
      if (result.details) {
        setFieldErrors(result.details)
      } else {
        setError(
          result.error === 'KYC_ALREADY_PENDING'
            ? 'Une verification est deja en cours.'
            : result.error
        )
      }
    }

    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soumettre mes documents</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="idDocumentUrl">
              URL de votre piece d&apos;identite
            </Label>
            <Input
              id="idDocumentUrl"
              name="idDocumentUrl"
              type="url"
              placeholder="https://..."
              required
            />
            {fieldErrors.idDocumentUrl && (
              <p className="text-sm text-destructive">
                {fieldErrors.idDocumentUrl[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="selfieUrl">URL de votre selfie</Label>
            <Input
              id="selfieUrl"
              name="selfieUrl"
              type="url"
              placeholder="https://..."
              required
            />
            {fieldErrors.selfieUrl && (
              <p className="text-sm text-destructive">
                {fieldErrors.selfieUrl[0]}
              </p>
            )}
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? 'Envoi en cours...' : 'Soumettre ma verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
