'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { joinTontine } from '@/domains/tontines/actions'

export function JoinTontineButton({ tontineId }: { tontineId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    setLoading(true)
    try {
      const result = await joinTontine({ tontineId })
      if (result.success) {
        toast.success('Inscription confirmee !')
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
    <Button onClick={handleJoin} disabled={loading} className="w-full" size="sm">
      {loading ? 'Inscription...' : 'Rejoindre'}
    </Button>
  )
}
