'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Ban, UserCheck, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  suspendMember,
  reactivateMember,
  changeMemberTier,
} from '@/domains/members/admin-actions'
import { TIER_LABELS } from '@/lib/constants'
import type { MemberTier } from '@/lib/generated/prisma/client'

interface MemberActionsProps {
  memberId: string
  memberStatus: string
  memberTier: string
}

const TIERS: MemberTier[] = ['FREE', 'PREMIUM', 'BUSINESS']

export function MemberActions({ memberId, memberStatus, memberTier }: MemberActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSuspend() {
    startTransition(async () => {
      const result = await suspendMember(memberId)
      if (result.success) {
        toast.success('Membre suspendu')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleReactivate() {
    startTransition(async () => {
      const result = await reactivateMember(memberId)
      if (result.success) {
        toast.success('Membre reactive')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleChangeTier(newTier: string) {
    if (newTier === memberTier) return
    startTransition(async () => {
      const result = await changeMemberTier(memberId, newTier as MemberTier)
      if (result.success) {
        toast.success(`Tier change vers ${TIER_LABELS[newTier as MemberTier]}`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Suspend / Reactivate */}
      {memberStatus === 'ACTIVE' ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuspend}
          disabled={isPending}
          className="text-red-600 hover:text-red-700"
        >
          <Ban className="mr-1.5 h-4 w-4" />
          Suspendre
        </Button>
      ) : memberStatus === 'SUSPENDED' ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReactivate}
          disabled={isPending}
          className="text-green-600 hover:text-green-700"
        >
          <UserCheck className="mr-1.5 h-4 w-4" />
          Reactiver
        </Button>
      ) : null}

      {/* Change Tier */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select
          value={memberTier}
          onValueChange={handleChangeTier}
          disabled={isPending}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIERS.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {TIER_LABELS[tier]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
