'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { publishTontine } from '@/domains/tontines/actions'
import type { TontineStatus } from '@/lib/generated/prisma/client'

interface TontineDetailActionsProps {
  tontineId: string
  status: TontineStatus
}

export function TontineDetailActions({ tontineId, status }: TontineDetailActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePublish() {
    setLoading(true)
    try {
      const result = await publishTontine({ tontineId })
      if (result.success) {
        toast.success('Tontine publiee')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {status === 'DRAFT' && (
        <Button onClick={handlePublish} disabled={loading}>
          {loading ? 'Publication...' : 'Publier'}
        </Button>
      )}
    </div>
  )
}
