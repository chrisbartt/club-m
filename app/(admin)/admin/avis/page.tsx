import { requireAdmin } from '@/lib/auth-guards'
import { getFlaggedReviews } from '@/domains/reviews/queries'
import { StarDisplay } from '@/components/orders/star-display'
import { ReviewModerationActions } from '@/components/admin/review-moderation-actions'

export default async function AdminAvisPage() {
  await requireAdmin()
  const reviews = await getFlaggedReviews()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Avis signales</h1>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">Aucun avis signale.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarDisplay rating={review.rating} />
                  <span className="text-sm font-medium">
                    {review.member.firstName} {review.member.lastName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    sur {review.product.name}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm">{review.comment}</p>
              )}
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">Raison du signalement :</p>
                <p className="text-sm">{review.flagReason}</p>
              </div>
              <ReviewModerationActions reviewId={review.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
