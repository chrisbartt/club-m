'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DirectoryFiltersProps {
  categories: string[]
  currentCategory?: string
  currentSearch?: string
}

export function DirectoryFilters({
  categories,
  currentCategory,
  currentSearch,
}: DirectoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/annuaire?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row">
      <Select
        value={currentCategory ?? 'all'}
        onValueChange={(val) => updateParam('category', val === 'all' ? null : val)}
      >
        <SelectTrigger className="sm:w-[220px]">
          <SelectValue placeholder="Toutes les categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="search"
        placeholder="Rechercher..."
        defaultValue={currentSearch ?? ''}
        className="sm:max-w-xs"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value
            updateParam('search', value || null)
          }
        }}
      />
    </div>
  )
}
