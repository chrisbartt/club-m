'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { flagReview } from '@/domains/reviews/actions'

interface FlagReviewButtonProps {
  reviewId: string
}

export function FlagReviewButton({ reviewId }: FlagReviewButtonProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleFlag() {
    if (reason.length < 10) {
      toast.error('La raison doit faire au moins 10 caracteres')
      return
    }

    startTransition(async () => {
      const result = await flagReview({ reviewId, reason })
      if (result.success) {
        toast.success('Avis signale')
        router.refresh()
      } else {
        toast.error('Erreur lors du signalement')
      }
    })
  }

  if (!showForm) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="text-muted-foreground">
        <Flag className="mr-2 h-3 w-3" />
        Signaler cet avis
      </Button>
    )
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="text-sm font-medium">Pourquoi signaler cet avis ?</p>
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Expliquez la raison (min 10 caracteres)..."
        rows={2}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleFlag} disabled={isPending || reason.length < 10}>
          {isPending ? 'Envoi...' : 'Envoyer le signalement'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
          Annuler
        </Button>
      </div>
    </div>
  )
}
