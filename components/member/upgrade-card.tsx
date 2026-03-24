'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createUpgradeRequest } from '@/domains/upgrade/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TIER_LABELS } from '@/lib/constants'
import type { MemberTier } from '@/lib/generated/prisma/client'

interface Plan {
  tier: MemberTier
  price: string
  currency: string
  period: string
  features: string[]
}

interface UpgradeCardProps {
  plan: Plan
  currentTier: string
  isVerified: boolean
}

const TIER_ORDER: Record<string, number> = {
  FREE: 1,
  PREMIUM: 2,
  BUSINESS: 3,
}

export function UpgradeCard({ plan, currentTier, isVerified }: UpgradeCardProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const isAtOrAbove = (TIER_ORDER[currentTier] ?? 0) >= (TIER_ORDER[plan.tier] ?? 0)

  async function handleChoose() {
    setPending(true)

    const result = await createUpgradeRequest({ targetTier: plan.tier })

    if (result.success) {
      router.push(result.data.nextStep)
    } else {
      const messages: Record<string, string> = {
        ALREADY_AT_OR_ABOVE_TIER: 'Vous etes deja a ce niveau ou au-dessus.',
        UPGRADE_IN_PROGRESS: 'Une demande de mise a niveau est deja en cours.',
      }
      toast.error(messages[result.error] ?? result.error)
    }

    setPending(false)
  }

  return (
    <Card className={isAtOrAbove ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between">
          <span>{TIER_LABELS[plan.tier as MemberTier] ?? plan.tier}</span>
          <span className="text-2xl font-bold">
            {plan.price} {plan.currency}
            <span className="text-sm font-normal text-muted-foreground">
              /{plan.period}
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <svg
                className="mt-0.5 size-4 shrink-0 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          disabled={isAtOrAbove || pending}
          onClick={handleChoose}
        >
          {isAtOrAbove
            ? 'Plan actuel ou inferieur'
            : pending
              ? 'Traitement...'
              : 'Choisir ce plan'}
        </Button>
      </CardContent>
    </Card>
  )
}
