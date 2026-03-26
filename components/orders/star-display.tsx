import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarDisplayProps {
  rating: number
  size?: 'sm' | 'md'
}

export function StarDisplay({ rating, size = 'sm' }: StarDisplayProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  )
}
