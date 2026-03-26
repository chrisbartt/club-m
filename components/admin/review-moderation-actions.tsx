'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { moderateReview } from '@/domains/reviews/actions'

interface ReviewModerationActionsProps {
  reviewId: string
}

export function ReviewModerationActions({ reviewId }: ReviewModerationActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleModerate(decision: 'MAINTAIN' | 'HIDE') {
    startTransition(async () => {
      const result = await moderateReview(reviewId, decision)
      if (result.success) {
        toast.success(decision === 'MAINTAIN' ? 'Avis maintenu' : 'Avis masque')
        router.refresh()
      } else {
        toast.error('Erreur')
      }
    })
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => handleModerate('MAINTAIN')} disabled={isPending}>
        Maintenir
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleModerate('HIDE')} disabled={isPending}>
        Masquer
      </Button>
    </div>
  )
}
