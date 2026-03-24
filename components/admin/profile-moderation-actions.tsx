'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'
import { approveProfile, rejectProfile } from '@/domains/directory/admin-actions'
import { Button } from '@/components/ui/button'

interface ProfileModerationActionsProps {
  profileId: string
  isApproved: boolean
}

export function ProfileModerationActions({ profileId, isApproved }: ProfileModerationActionsProps) {
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
    <div className="flex items-center gap-2">
      {!isApproved ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={isPending}
          className="text-green-600 hover:text-green-700"
        >
          <Check className="mr-1 h-4 w-4" />
          Approuver
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReject}
        disabled={isPending}
        className="text-red-600 hover:text-red-700"
      >
        <X className="mr-1 h-4 w-4" />
        Rejeter
      </Button>
    </div>
  )
}
