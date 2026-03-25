import Link from 'next/link'
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
  Package,
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: string
  buyerName: string
  amount: number
  date: Date
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR') + ' $US'
}

function formatRelativeTime(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return "A l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffHour < 24) return `Il y a ${diffHour}h`
  if (diffDay === 1) return 'Hier'
  if (diffDay < 7) return `Il y a ${diffDay} jours`
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

function getActivityConfig(type: string) {
  switch (type) {
    case 'PENDING':
      return {
        icon: <ShoppingCart className="h-3.5 w-3.5" />,
        label: 'Nouvelle commande',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        dotColor: 'bg-blue-400',
      }
    case 'PAID':
      return {
        icon: <CreditCard className="h-3.5 w-3.5" />,
        label: 'Paiement recu',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
        dotColor: 'bg-emerald-400',
      }
    case 'SHIPPED':
      return {
        icon: <Package className="h-3.5 w-3.5" />,
        label: 'Commande expediee',
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-400',
        dotColor: 'bg-purple-400',
      }
    case 'DELIVERED':
      return {
        icon: <Truck className="h-3.5 w-3.5" />,
        label: 'Livraison confirmee',
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-400',
        dotColor: 'bg-green-400',
      }
    case 'COMPLETED':
      return {
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        label: 'Commande completee',
        iconBg: 'bg-cyan-500/10',
        iconColor: 'text-cyan-400',
        dotColor: 'bg-cyan-400',
      }
    case 'CANCELLED':
      return {
        icon: <XCircle className="h-3.5 w-3.5" />,
        label: 'Commande annulee',
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-400',
        dotColor: 'bg-red-400',
      }
    default:
      return {
        icon: <ShoppingCart className="h-3.5 w-3.5" />,
        label: type,
        iconBg: 'bg-white/5',
        iconColor: 'text-muted-foreground',
        dotColor: 'bg-white/20',
      }
  }
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-muted-foreground">
        Aucune activite recente
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, index) => {
        const config = getActivityConfig(activity.type)
        const isLast = index === activities.length - 1
        return (
          <div key={`${activity.id}-${activity.type}`} className="relative flex gap-3">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-white/[0.06]" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
            >
              <div className={config.iconColor}>{config.icon}</div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-5">
              <Link
                href={`/mon-business/commandes/${activity.id}`}
                className="group block"
              >
                <p className="text-[13px] font-medium text-white group-hover:text-purple-400 transition-colors">
                  {config.label}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {activity.buyerName} &middot;{' '}
                  <span className="text-white/60">
                    {formatCurrency(activity.amount)}
                  </span>
                </p>
              </Link>
              <p className="mt-1 text-[11px] text-white/30">
                {formatRelativeTime(activity.date)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
