'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createBusinessProfile, updateBusinessProfile } from '@/domains/directory/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BusinessProfileFormProps {
  mode: 'create' | 'edit'
  defaultValues?: {
    id?: string
    businessName?: string
    description?: string
    category?: string
    phone?: string | null
    email?: string | null
    website?: string | null
    whatsapp?: string | null
    address?: string | null
    coverImage?: string | null
  }
}

export function BusinessProfileForm({ mode, defaultValues }: BusinessProfileFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)

    const data: Record<string, unknown> = {
      businessName: formData.get('businessName') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      coverImage: (formData.get('coverImage') as string) || undefined,
    }

    if (mode === 'edit' && defaultValues?.id) {
      data.id = defaultValues.id
    }

    const result =
      mode === 'create'
        ? await createBusinessProfile(data)
        : await updateBusinessProfile(data)

    if (result.success) {
      toast.success(
        mode === 'create'
          ? 'Profil business cree avec succes'
          : 'Profil business mis a jour',
      )
      router.refresh()
    } else {
      if ('details' in result && result.details) {
        setFieldErrors(result.details)
      } else {
        toast.error(result.error === 'PROFILE_ALREADY_EXISTS'
          ? 'Vous avez deja un profil business'
          : result.error)
      }
    }

    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Creer votre fiche business' : 'Modifier votre fiche business'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nom du business</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={defaultValues?.businessName ?? ''}
              required
            />
            {fieldErrors.businessName && (
              <p className="text-sm text-destructive">{fieldErrors.businessName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={defaultValues?.description ?? ''}
              required
            />
            {fieldErrors.description && (
              <p className="text-sm text-destructive">{fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categorie</Label>
            <Input
              id="category"
              name="category"
              defaultValue={defaultValues?.category ?? ''}
              placeholder="ex: Mode, Beaute, Restauration..."
              required
            />
            {fieldErrors.category && (
              <p className="text-sm text-destructive">{fieldErrors.category[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Image de couverture (URL)</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              defaultValue={defaultValues?.coverImage ?? ''}
              placeholder="https://..."
            />
            {fieldErrors.coverImage && (
              <p className="text-sm text-destructive">{fieldErrors.coverImage[0]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telephone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={defaultValues?.phone ?? ''}
              />
              {fieldErrors.phone && (
                <p className="text-sm text-destructive">{fieldErrors.phone[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email de contact</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={defaultValues?.email ?? ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={defaultValues?.website ?? ''}
                placeholder="https://..."
              />
              {fieldErrors.website && (
                <p className="text-sm text-destructive">{fieldErrors.website[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                defaultValue={defaultValues?.whatsapp ?? ''}
                placeholder="+243..."
              />
              {fieldErrors.whatsapp && (
                <p className="text-sm text-destructive">{fieldErrors.whatsapp[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              defaultValue={defaultValues?.address ?? ''}
            />
            {fieldErrors.address && (
              <p className="text-sm text-destructive">{fieldErrors.address[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={pending}>
            {pending
              ? 'Enregistrement...'
              : mode === 'create'
                ? 'Creer ma fiche'
                : 'Enregistrer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
