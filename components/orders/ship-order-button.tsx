'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { markAsShipped } from '@/domains/orders/actions'
import { Button } from '@/components/ui/button'

interface ShipOrderButtonProps {
  orderId: string
}

export function ShipOrderButton({ orderId }: ShipOrderButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleShip() {
    startTransition(async () => {
      const result = await markAsShipped({ orderId })
      if (result.success) {
        toast.success('Commande marquee comme expediee !')
        router.refresh()
      } else {
        const messages: Record<string, string> = {
          NOT_OWNER: 'Cette commande ne vous appartient pas.',
          RESOURCE_NOT_FOUND: 'Commande introuvable.',
          ORDER_ALREADY_CONFIRMED: 'Cette commande a deja ete traitee.',
        }
        toast.error(messages[result.error] ?? 'Une erreur est survenue.')
      }
    })
  }

  return (
    <Button onClick={handleShip} disabled={isPending}>
      {isPending ? 'Traitement...' : 'Marquer comme expediee'}
    </Button>
  )
}
