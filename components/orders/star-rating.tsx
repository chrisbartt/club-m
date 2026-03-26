'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            className={cn(
              'h-7 w-7 transition-colors',
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted hover:text-amber-300'
            )}
          />
        </button>
      ))}
    </div>
  )
}
