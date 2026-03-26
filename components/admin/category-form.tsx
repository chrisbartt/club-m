'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCategory, updateCategory } from '@/domains/categories/actions'

interface CategoryFormProps {
  mode: 'create' | 'edit'
  defaultValues?: { id: string; name: string }
  onCancel?: () => void
}

export function CategoryForm({ mode, defaultValues, onCancel }: CategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      const result = mode === 'create'
        ? await createCategory({ name: name.trim() })
        : await updateCategory({ id: defaultValues!.id, name: name.trim() })

      if (result.success) {
        toast.success(mode === 'create' ? 'Categorie creee' : 'Categorie mise a jour')
        setName('')
        router.refresh()
        onCancel?.()
      } else {
        toast.error(result.error === 'ALREADY_EXISTS' ? 'Cette categorie existe deja' : 'Erreur')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la categorie"
        required
        className="max-w-xs"
      />
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? 'En cours...' : mode === 'create' ? 'Ajouter' : 'Modifier'}
      </Button>
      {onCancel && (
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Annuler
        </Button>
      )}
    </form>
  )
}
