'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { submitKyc } from '@/domains/kyc/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CloudinaryUpload } from '@/components/shared/cloudinary-upload'

export function KycForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [idDocumentUrl, setIdDocumentUrl] = useState('')
  const [selfieUrl, setSelfieUrl] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors({})

    const data = { idDocumentUrl, selfieUrl }

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
            <Label>Piece d&apos;identite</Label>
            <CloudinaryUpload
              folder="kyc"
              onUpload={(urls) => setIdDocumentUrl(urls[0] || '')}
              currentImage={idDocumentUrl || undefined}
            />
            {fieldErrors.idDocumentUrl && (
              <p className="text-sm text-destructive">
                {fieldErrors.idDocumentUrl[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Selfie</Label>
            <CloudinaryUpload
              folder="kyc"
              onUpload={(urls) => setSelfieUrl(urls[0] || '')}
              currentImage={selfieUrl || undefined}
            />
            {fieldErrors.selfieUrl && (
              <p className="text-sm text-destructive">
                {fieldErrors.selfieUrl[0]}
              </p>
            )}
          </div>

          <Button type="submit" disabled={pending || !idDocumentUrl || !selfieUrl}>
            {pending ? 'Envoi en cours...' : 'Soumettre ma verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
