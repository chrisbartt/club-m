'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateProfile } from '@/domains/members/profile-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProfileFormProps {
  defaultValues: {
    firstName: string
    lastName: string
    phone: string | null
    bio: string | null
  }
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [pending, setPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: (formData.get('phone') as string) || null,
      bio: (formData.get('bio') as string) || null,
    }

    const result = await updateProfile(data)

    if (result.success) {
      toast.success('Profil mis a jour')
    } else {
      if (result.details) {
        setFieldErrors(result.details)
      } else {
        toast.error(result.error)
      }
    }

    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={defaultValues.firstName}
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
                name="lastName"
                defaultValue={defaultValues.lastName}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-sm text-destructive">{fieldErrors.lastName[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={defaultValues.phone ?? ''}
            />
            {fieldErrors.phone && (
              <p className="text-sm text-destructive">{fieldErrors.phone[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={defaultValues.bio ?? ''}
            />
            {fieldErrors.bio && (
              <p className="text-sm text-destructive">{fieldErrors.bio[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
