'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TIER_LABELS } from '@/lib/constants'
import type {
  MemberTier,
  VerificationStatus,
} from '@/lib/generated/prisma/client'

type MemberRow = {
  id: string
  firstName: string
  lastName: string
  tier: MemberTier
  verificationStatus: VerificationStatus
  createdAt: Date
  user: { email: string }
}

interface MembersTableProps {
  members: MemberRow[]
  total: number
  page: number
  pageSize: number
}

const TIER_COLORS: Record<MemberTier, string> = {
  FREE: 'bg-gray-100 text-gray-700 border-gray-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  BUSINESS: 'bg-purple-50 text-purple-700 border-purple-200',
}

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  DECLARED: 'Non verifie',
  PENDING_VERIFICATION: 'En attente',
  VERIFIED: 'Verifie',
  REJECTED: 'Rejete',
}

const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  DECLARED: 'bg-gray-100 text-gray-600 border-gray-200',
  PENDING_VERIFICATION: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  VERIFIED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
}

export function MembersTable({ members, total, page, pageSize }: MembersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      startTransition(() => {
        router.push(`/admin/membres?${params.toString()}`)
      })
    },
    [router, searchParams, startTransition]
  )

  const handleSearch = useCallback(() => {
    updateFilters('search', searchInput)
  }, [searchInput, updateFilters])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onBlur={handleSearch}
            className="pl-9"
          />
        </div>

        <Select
          value={searchParams.get('tier') ?? 'all'}
          onValueChange={(v) => updateFilters('tier', v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les tiers</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('verification') ?? 'all'}
          onValueChange={(v) => updateFilters('verification', v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="DECLARED">Non verifie</SelectItem>
            <SelectItem value="PENDING_VERIFICATION">En attente</SelectItem>
            <SelectItem value="VERIFIED">Verifie</SelectItem>
            <SelectItem value="REJECTED">Rejete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {total} membre{total !== 1 ? 's' : ''} trouve{total !== 1 ? 's' : ''}
        {isPending && ' — chargement...'}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Inscription</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun membre trouve.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/membres/${member.id}`)}
                >
                  <TableCell className="font-medium">
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={TIER_COLORS[member.tier]}>
                      {TIER_LABELS[member.tier]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={VERIFICATION_COLORS[member.verificationStatus]}>
                      {VERIFICATION_LABELS[member.verificationStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(member.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => updateFilters('page', String(page - 1))}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
            >
              Precedent
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => updateFilters('page', String(page + 1))}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
