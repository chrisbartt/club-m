interface OrderTimelineProps {
  status: string
  createdAt: string
  shippedAt?: string | null
  deliveredAt?: string | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function OrderTimeline({ status, createdAt, shippedAt, deliveredAt }: OrderTimelineProps) {
  const isShipped = status === 'SHIPPED' || status === 'DELIVERED'
  const isDelivered = status === 'DELIVERED'

  const steps = [
    { label: 'Commande payee', done: true, date: createdAt },
    { label: 'Expediee', done: isShipped, date: shippedAt },
    { label: 'Livree', done: isDelivered, date: deliveredAt },
  ]

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          {/* Vertical line + circle */}
          <div className="flex flex-col items-center">
            <div
              className={`h-4 w-4 rounded-full border-2 shrink-0 ${
                step.done
                  ? 'bg-green-500 border-green-500'
                  : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
              }`}
            />
            {i < steps.length - 1 && (
              <div
                className={`w-0.5 flex-1 min-h-8 ${
                  step.done ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
          </div>
          {/* Content */}
          <div className="pb-6">
            <p className={`text-sm font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </p>
            {step.done && step.date && (
              <p className="text-xs text-muted-foreground">{formatDate(step.date)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
