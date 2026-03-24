'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { updatePassword } from '@/domains/members/profile-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const result = await updatePassword(data)

    if (result.success) {
      toast.success('Mot de passe modifie')
      formRef.current?.reset()
    } else {
      if (result.details) {
        setFieldErrors(result.details)
      } else {
        toast.error(
          result.error === 'INVALID_CURRENT_PASSWORD'
            ? 'Le mot de passe actuel est incorrect'
            : result.error
        )
      }
    }

    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
            />
            {fieldErrors.currentPassword && (
              <p className="text-sm text-destructive">
                {fieldErrors.currentPassword[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
            />
            {fieldErrors.newPassword && (
              <p className="text-sm text-destructive">
                {fieldErrors.newPassword[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-destructive">
                {fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? 'Modification...' : 'Modifier le mot de passe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
