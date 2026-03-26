'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { openDispute } from '@/domains/disputes/actions'

const DISPUTE_REASONS = [
  'Produit non recu',
  'Produit non conforme',
  'Produit endommage',
  'Autre',
] as const

interface DisputeFormProps {
  orderId: string
}

export function DisputeForm({ orderId }: DisputeFormProps) {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (!reason) {
      toast.error('Selectionnez une raison')
      return
    }
    if (description.length < 10) {
      toast.error('La description doit contenir au moins 10 caracteres')
      return
    }

    startTransition(async () => {
      const result = await openDispute({ orderId, reason, description })

      if (result.success) {
        toast.success('Litige ouvert avec succes')
        router.refresh()
      } else {
        const messages: Record<string, string> = {
          DISPUTE_ALREADY_EXISTS: 'Un litige existe deja pour cette commande',
          DISPUTE_DEADLINE_PASSED: 'Le delai de 14 jours est depasse',
          ORDER_STATUS_INVALID: 'La commande n\'est pas dans un statut valide',
          ORDER_NOT_FOUND: 'Commande introuvable',
        }
        toast.error(messages[result.error] ?? 'Erreur lors de l\'ouverture du litige')
      }
    })
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Ouvrir un litige</h3>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Raison</p>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue placeholder="Selectionnez une raison" />
          </SelectTrigger>
          <SelectContent>
            {DISPUTE_REASONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Description (min. 10 caracteres)</p>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Decrivez le probleme rencontre..."
          maxLength={2000}
          rows={4}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending || !reason || description.length < 10}
        size="sm"
        variant="destructive"
      >
        {isPending ? 'Envoi...' : 'Ouvrir le litige'}
      </Button>
    </div>
  )
}
