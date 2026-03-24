import { BadgeCheck } from 'lucide-react'

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium text-emerald-500 ${className ?? ''}`}>
      <BadgeCheck className="h-3.5 w-3.5" />
      Verifie
    </span>
  )
}
