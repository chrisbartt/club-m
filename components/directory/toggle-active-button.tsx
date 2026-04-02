'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toggleProductActive } from '@/domains/business/actions'
import { Button } from '@/components/ui/button'

interface ToggleActiveButtonProps {
  productId: string
  isActive: boolean
}

export function ToggleActiveButton({ productId, isActive }: ToggleActiveButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleProductActive({ productId })
      if (result.success) {
        toast.success(result.data.isActive ? 'Produit active' : 'Produit desactive')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? 'En cours...' : isActive ? 'Desactiver' : 'Activer'}
    </Button>
  )
}
