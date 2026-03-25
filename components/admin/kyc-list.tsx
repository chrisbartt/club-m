'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { KycDetailPanel } from '@/components/admin/kyc-detail-panel'

interface KycItem {
  id: string
  idDocumentUrl: string
  selfieUrl: string
  status: string
  provider: string | null
  rejectionReason: string | null
  reviewedBy: string | null
  submittedAt: string
  reviewedAt: string | null
  member: {
    id: string
    firstName: string
    lastName: string
    tier: string
    verificationStatus: string
    phone: string | null
    createdAt: string
    user: {
      email: string
    }
  }
}

const STATUS_TABS = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'APPROVED', label: 'Approuves' },
  { value: 'REJECTED', label: 'Rejetes' },
  { value: 'all', label: 'Tous' },
]

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'En attente', variant: 'outline' },
  APPROVED: { label: 'Approuve', variant: 'default' },
  REJECTED: { label: 'Rejete', variant: 'destructive' },
  MANUAL_REVIEW: { label: 'Revision', variant: 'secondary' },
}

interface KycListProps {
  items: KycItem[]
  currentStatus: string
  currentSearch: string
}

export function KycList({ items, currentStatus, currentSearch }: KycListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState(currentSearch)

  const updateUrl = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString())
      for (const [key, val] of Object.entries(params)) {
        if (val) {
          sp.set(key, val)
        } else {
          sp.delete(key)
        }
      }
      router.push(`/admin/kyc?${sp.toString()}`)
    },
    [router, searchParams]
  )

  function handleTabChange(status: string) {
    updateUrl({ status, search: searchValue })
  }

  function handleSearch() {
    updateUrl({ status: currentStatus, search: searchValue })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={currentStatus === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un membre..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 w-64"
            />
          </div>
          <Button size="sm" variant="outline" onClick={handleSearch}>
            Rechercher
          </Button>
        </div>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Aucune verification KYC trouvee
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Date soumission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const badge = STATUS_BADGE[item.status] || { label: item.status, variant: 'outline' as const }
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedIndex(index)}
                  >
                    <TableCell className="font-medium">
                      {item.member.firstName} {item.member.lastName}
                    </TableCell>
                    <TableCell>{item.member.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.member.tier}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.submittedAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedIndex(index)
                        }}
                      >
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail panel */}
      {selectedItem && selectedIndex !== null && (
        <KycDetailPanel
          item={selectedItem}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : undefined}
          onNext={selectedIndex < items.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : undefined}
        />
      )}
    </>
  )
}
