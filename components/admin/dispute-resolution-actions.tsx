'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { resolveDispute } from '@/domains/disputes/actions'

interface DisputeResolutionActionsProps {
  disputeId: string
}

export function DisputeResolutionActions({ disputeId }: DisputeResolutionActionsProps) {
  const router = useRouter()
  const [adminNote, setAdminNote] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleResolve(decision: 'RESOLVED_BUYER' | 'RESOLVED_SELLER' | 'CLOSED') {
    startTransition(async () => {
      const result = await resolveDispute({
        disputeId,
        decision,
        adminNote: adminNote || undefined,
      })
      if (result.success) {
        const labels = {
          RESOLVED_BUYER: 'Resolu en faveur de l\'acheteur',
          RESOLVED_SELLER: 'Resolu en faveur de la vendeuse',
          CLOSED: 'Litige ferme',
        }
        toast.success(labels[decision])
        router.refresh()
      } else {
        toast.error('Erreur')
      }
    })
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={adminNote}
        onChange={(e) => setAdminNote(e.target.value)}
        placeholder="Note admin (optionnel)..."
        rows={2}
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => handleResolve('RESOLVED_BUYER')} disabled={isPending}>
          Faveur acheteur
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleResolve('RESOLVED_SELLER')} disabled={isPending}>
          Faveur vendeuse
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleResolve('CLOSED')} disabled={isPending}>
          Fermer
        </Button>
      </div>
    </div>
  )
}
