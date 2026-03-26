'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { respondToDispute } from '@/domains/disputes/actions'

export function DisputeResponseForm({ disputeId }: { disputeId: string }) {
  const router = useRouter()
  const [response, setResponse] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (response.length < 10) {
      toast.error('La reponse doit faire au moins 10 caracteres')
      return
    }
    startTransition(async () => {
      const result = await respondToDispute({ disputeId, response })
      if (result.success) {
        toast.success('Reponse envoyee')
        router.refresh()
      } else {
        toast.error('Erreur')
      }
    })
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Votre reponse au litige (min 10 caracteres)..."
        rows={3}
      />
      <Button onClick={handleSubmit} disabled={isPending || response.length < 10} size="sm">
        {isPending ? 'Envoi...' : 'Envoyer ma reponse'}
      </Button>
    </div>
  )
}
