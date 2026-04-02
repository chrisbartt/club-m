import { db } from '@/lib/db'
import { requireAdmin, requireMember } from '@/lib/auth-guards'
import type { TontineStatus } from '@/lib/generated/prisma/client'

export async function getAdminTontines(filters?: { status?: TontineStatus }) {
  await requireAdmin()
  return db.tontine.findMany({
    where: filters?.status ? { status: filters.status } : undefined,
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTontineById(tontineId: string) {
  return db.tontine.findUnique({
    where: { id: tontineId },
    include: {
      members: {
        include: {
          member: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true } },
          payments: { orderBy: { dueDate: 'desc' } },
        },
        orderBy: { joinedAt: 'asc' },
      },
      _count: { select: { members: true } },
    },
  })
}

export async function getMemberTontines(memberId: string) {
  return db.tontineMember.findMany({
    where: { memberId, status: 'ACTIVE' },
    include: {
      tontine: {
        include: { _count: { select: { members: true } } },
      },
      payments: {
        where: { status: 'PENDING' },
        orderBy: { dueDate: 'asc' },
        take: 1,
      },
    },
    orderBy: { joinedAt: 'desc' },
  })
}

export async function getOpenTontines() {
  return db.tontine.findMany({
    where: { status: 'OPEN' },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { startDate: 'asc' },
  })
}

export async function getTontineStats() {
  await requireAdmin()
  const [total, open, active, totalMembers, pendingPayments] = await Promise.all([
    db.tontine.count(),
    db.tontine.count({ where: { status: 'OPEN' } }),
    db.tontine.count({ where: { status: 'ACTIVE' } }),
    db.tontineMember.count({ where: { status: 'ACTIVE' } }),
    db.tontinePayment.count({ where: { status: 'PENDING' } }),
  ])
  return { total, open, active, totalMembers, pendingPayments }
}

export async function getLateMembers(tontineId: string) {
  return db.tontineMember.findMany({
    where: {
      tontineId,
      status: 'ACTIVE',
      payments: {
        some: {
          status: 'PENDING',
          dueDate: { lt: new Date() },
        },
      },
    },
    include: {
      member: { select: { id: true, firstName: true, lastName: true, phone: true } },
      payments: {
        where: { status: 'PENDING', dueDate: { lt: new Date() } },
        orderBy: { dueDate: 'asc' },
      },
    },
  })
}
