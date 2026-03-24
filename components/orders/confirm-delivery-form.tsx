'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { confirmDelivery } from '@/domains/orders/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ConfirmDeliveryFormProps {
  orderId: string
}

export function ConfirmDeliveryForm({ orderId }: ConfirmDeliveryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [code, setCode] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) {
      toast.error('Le code doit contenir 6 caracteres.')
      return
    }

    startTransition(async () => {
      const result = await confirmDelivery({
        orderId,
        confirmationCode: code.toUpperCase(),
      })

      if (result.success) {
        toast.success('Livraison confirmee !')
        router.refresh()
      } else {
        const messages: Record<string, string> = {
          CONFIRMATION_CODE_INVALID: 'Code de confirmation incorrect.',
          CONFIRMATION_CODE_EXPIRED: 'Le code de confirmation a expire.',
          NOT_OWNER: 'Cette commande ne vous appartient pas.',
          RESOURCE_NOT_FOUND: 'Commande introuvable.',
          ORDER_ALREADY_CONFIRMED: 'Cette commande a deja ete confirmee.',
          INVALID_INPUT: 'Donnees invalides.',
        }
        toast.error(messages[result.error] ?? 'Une erreur est survenue.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="confirmation-code">Code de confirmation</Label>
        <Input
          id="confirmation-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="EX: A1B2C3"
          className="font-mono text-lg uppercase tracking-widest"
          maxLength={6}
        />
        <p className="text-xs text-muted-foreground">
          Le code a 6 caracteres fourni par l&apos;acheteur lors de la livraison.
        </p>
      </div>
      <Button type="submit" disabled={isPending || code.length !== 6}>
        {isPending ? 'Verification...' : 'Confirmer la livraison'}
      </Button>
    </form>
  )
}
