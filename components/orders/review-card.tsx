import { StarDisplay } from '@/components/orders/star-display'

interface ReviewCardProps {
  review: {
    rating: number
    comment: string | null
    createdAt: string
    member: { firstName: string }
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 30) return `Il y a ${days} jours`
  const months = Math.floor(days / 30)
  return `Il y a ${months} mois`
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="space-y-1 border-b py-3 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarDisplay rating={review.rating} />
          <span className="text-sm font-medium">{review.member.firstName}</span>
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}
    </div>
  )
}
