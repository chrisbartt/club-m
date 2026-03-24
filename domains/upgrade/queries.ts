import { db } from '@/lib/db'
import { TERMINAL_STATUSES } from './types'

export async function getActiveUpgradeRequest(memberId: string) {
  return db.upgradeRequest.findFirst({
    where: {
      memberId,
      status: { notIn: TERMINAL_STATUSES },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUpgradeHistory(memberId: string) {
  return db.upgradeRequest.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
  })
}
