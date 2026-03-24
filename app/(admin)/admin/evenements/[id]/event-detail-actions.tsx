'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { publishEvent, cancelEvent } from '@/domains/events/actions'
import type { EventStatus } from '@/lib/generated/prisma/client'

interface EventDetailActionsProps {
  eventId: string
  status: EventStatus
}

export function EventDetailActions({ eventId, status }: EventDetailActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePublish() {
    setLoading(true)
    try {
      const result = await publishEvent(eventId)
      if (result.success) {
        toast.success('Evenement publie')
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

  async function handleCancel() {
    setLoading(true)
    try {
      const result = await cancelEvent(eventId)
      if (result.success) {
        toast.success('Evenement annule')
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
      {status !== 'CANCELLED' && (
        <Button variant="destructive" onClick={handleCancel} disabled={loading}>
          {loading ? 'Annulation...' : 'Annuler'}
        </Button>
      )}
    </div>
  )
}
