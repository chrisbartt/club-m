'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { bookEvent } from '@/domains/tickets/actions'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'

type BookingButtonProps = {
  eventSlug: string
  price: number
  currency: Currency
  disabled?: boolean
  disabledReason?: string
}

export function BookingButton({
  eventSlug,
  price,
  currency,
  disabled,
  disabledReason,
}: BookingButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const currencySymbol = CURRENCY_SYMBOLS[currency]

  async function handleBook() {
    setLoading(true)
    try {
      const result = await bookEvent(eventSlug)

      if (result.success) {
        toast.success('Reservation confirmee !')
        router.push('/tickets')
      } else {
        const messages: Record<string, string> = {
          EVENT_NOT_BOOKABLE: 'Cet evenement n\'est plus disponible',
          INSUFFICIENT_TIER: 'Votre abonnement ne permet pas d\'acceder a cet evenement',
          EVENT_FULL: 'Cet evenement est complet',
          ALREADY_BOOKED: 'Vous avez deja reserve pour cet evenement',
          NO_PRICE_AVAILABLE: 'Aucun tarif disponible',
        }
        toast.error(messages[result.error] ?? 'Une erreur est survenue')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (disabled) {
    return (
      <div className="space-y-2">
        <Button disabled className="w-full">
          Reserver — {price}{currencySymbol}
        </Button>
        {disabledReason && (
          <p className="text-sm text-muted-foreground text-center">
            {disabledReason}
          </p>
        )}
      </div>
    )
  }

  return (
    <Button
      onClick={handleBook}
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? 'Reservation en cours...' : `Reserver — ${price}${currencySymbol}`}
    </Button>
  )
}
