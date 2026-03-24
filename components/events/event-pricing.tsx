import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { EventPrice, PricingRole, Currency } from '@/lib/generated/prisma/client'

const ROLE_LABELS: Record<PricingRole, string> = {
  PUBLIC: 'Public',
  FREE: 'Membre Free',
  PREMIUM: 'Membre Premium',
  BUSINESS: 'Membre Business',
}

type EventPricingProps = {
  prices: EventPrice[]
  userRole?: PricingRole
}

export function EventPricing({ prices, userRole }: EventPricingProps) {
  if (prices.length === 0) return null

  const userPrice = userRole
    ? prices.find((p) => p.targetRole === userRole) ??
      prices.find((p) => p.targetRole === 'PUBLIC')
    : null

  const otherPrices = prices.filter(
    (p) => !userPrice || p.id !== userPrice.id
  )

  return (
    <div className="space-y-3">
      {userPrice && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <p className="text-sm text-muted-foreground">Votre prix</p>
          <p className="text-2xl font-bold text-primary">
            {Number(userPrice.price)}
            {CURRENCY_SYMBOLS[userPrice.currency]}
          </p>
        </div>
      )}

      {otherPrices.length > 0 && (
        <div className="space-y-1">
          {otherPrices.map((price) => (
            <div
              key={price.id}
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              <span>Prix {ROLE_LABELS[price.targetRole]}</span>
              <span className={userPrice ? 'line-through' : 'font-medium text-foreground'}>
                {Number(price.price)}
                {CURRENCY_SYMBOLS[price.currency]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
