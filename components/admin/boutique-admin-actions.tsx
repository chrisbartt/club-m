'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X, ExternalLink } from 'lucide-react'
import { approveProfile, rejectProfile } from '@/domains/directory/admin-actions'
import { Button } from '@/components/ui/button'

interface BoutiqueAdminActionsProps {
  profileId: string
  slug: string
  isApproved: boolean
}

export function BoutiqueAdminActions({ profileId, slug, isApproved }: BoutiqueAdminActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleApprove() {
    startTransition(async () => {
      const result = await approveProfile(profileId)
      if (result.success) {
        toast.success('Profil approuve')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectProfile(profileId)
      if (result.success) {
        toast.success('Profil rejete')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!isApproved ? (
        <Button
          onClick={handleApprove}
          disabled={isPending}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="mr-2 h-4 w-4" />
          Approuver
        </Button>
      ) : (
        <Button
          variant="destructive"
          onClick={handleReject}
          disabled={isPending}
        >
          <X className="mr-2 h-4 w-4" />
          Rejeter
        </Button>
      )}
      <Button variant="outline" asChild>
        <a href={`/boutique/${slug}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Voir la boutique
        </a>
      </Button>
    </div>
  )
}
