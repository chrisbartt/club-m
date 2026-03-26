'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/orders/star-rating'
import { createReview } from '@/domains/reviews/actions'

interface ReviewFormProps {
  orderId: string
}

export function ReviewForm({ orderId }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (rating === 0) {
      toast.error('Selectionnez une note')
      return
    }

    startTransition(async () => {
      const result = await createReview({
        orderId,
        rating,
        comment: comment || undefined,
      })

      if (result.success) {
        toast.success('Avis publie !')
        router.refresh()
      } else {
        toast.error(
          result.error === 'ALREADY_REVIEWED'
            ? 'Vous avez deja laisse un avis'
            : result.error === 'ORDER_NOT_DELIVERED'
              ? 'La commande doit etre livree'
              : 'Erreur lors de la publication'
        )
      }
    })
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Laisser un avis</h3>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Votre note</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Commentaire (optionnel)</p>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre experience..."
          maxLength={1000}
          rows={3}
        />
      </div>
      <Button onClick={handleSubmit} disabled={isPending || rating === 0} size="sm">
        {isPending ? 'Publication...' : 'Publier mon avis'}
      </Button>
    </div>
  )
}
