'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { toggleCategory } from '@/domains/categories/actions'
import { CategoryForm } from '@/components/admin/category-form'

interface CategoryActionsProps {
  category: { id: string; name: string; isActive: boolean }
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleCategory(category.id)
      if (result.success) {
        toast.success(result.data.isActive ? 'Categorie activee' : 'Categorie desactivee')
        router.refresh()
      }
    })
  }

  if (editing) {
    return (
      <CategoryForm
        mode="edit"
        defaultValues={{ id: category.id, name: category.name }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
        Modifier
      </Button>
      <Button
        variant={category.isActive ? 'outline' : 'default'}
        size="sm"
        onClick={handleToggle}
        disabled={isPending}
      >
        {category.isActive ? 'Desactiver' : 'Activer'}
      </Button>
    </div>
  )
}
