import { Package, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineEntry {
  id: string
  status: string
  note: string | null
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Package; color: string }> = {
  PENDING: { label: 'Commande creee', icon: Package, color: 'text-muted-foreground' },
  PAID: { label: 'Paiement confirme', icon: CreditCard, color: 'text-green-600' },
  SHIPPED: { label: 'Expediee', icon: Truck, color: 'text-blue-600' },
  DELIVERED: { label: 'Livree', icon: CheckCircle, color: 'text-green-600' },
}

interface OrderTimelineProps {
  timeline: TimelineEntry[]
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  if (timeline.length === 0) return null

  return (
    <div className="space-y-0">
      {timeline.map((entry, index) => {
        const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.PENDING
        const Icon = config.icon
        const isLast = index === timeline.length - 1

        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full border-2', config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="h-8 w-px bg-border" />}
            </div>
            <div className="pb-6">
              <p className="text-sm font-medium">{config.label}</p>
              {entry.note && (
                <p className="text-xs text-muted-foreground">{entry.note}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
