'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { purchaseProduct } from '@/domains/orders/actions'
import { Button } from '@/components/ui/button'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Currency } from '@/lib/generated/prisma/client'

interface PurchaseButtonProps {
  productId: string
  price: number
  currency: string
  disabled?: boolean
  disabledReason?: string
}

export function PurchaseButton({
  productId,
  price,
  currency,
  disabled,
  disabledReason,
}: PurchaseButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const symbol = CURRENCY_SYMBOLS[currency as Currency] ?? '$'

  function handlePurchase() {
    // Redirect to checkout — payment requires Mobile Money provider selection
    router.push('/panier')
  }

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className="w-full"
        onClick={handlePurchase}
        disabled={disabled || isPending}
      >
        {isPending
          ? 'Traitement en cours...'
          : `Acheter — ${price.toLocaleString('fr-FR')}${symbol}`}
      </Button>
      {disabled && disabledReason && (
        <p className="text-sm text-muted-foreground text-center">{disabledReason}</p>
      )}
    </div>
  )
}
