'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { togglePublishProfile } from '@/domains/directory/actions'
import { Button } from '@/components/ui/button'

interface PublishToggleProps {
  profileId: string
  isPublished: boolean
  isApproved: boolean
}

export function PublishToggle({ profileId, isPublished, isApproved }: PublishToggleProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  if (!isApproved) return null

  async function handleToggle() {
    setPending(true)
    const result = await togglePublishProfile(profileId)

    if (result.success) {
      toast.success(result.data.isPublished ? 'Profil publie' : 'Profil masque')
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setPending(false)
  }

  return (
    <Button
      variant={isPublished ? 'outline' : 'default'}
      onClick={handleToggle}
      disabled={pending}
    >
      {pending
        ? 'En cours...'
        : isPublished
          ? 'Masquer mon profil'
          : 'Publier mon profil'}
    </Button>
  )
}
