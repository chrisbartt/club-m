import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import type { PaymentStatus } from '@/lib/generated/prisma/client'

export async function getAdminPayments(filters?: { status?: PaymentStatus }) {
  await requireAdmin()
  return db.payment.findMany({
    where: filters?.status ? { status: filters.status } : undefined,
    include: {
      order: { select: { id: true, business: { select: { businessName: true } } } },
      ticket: { select: { id: true, event: { select: { title: true } } } },
      subscription: { select: { id: true, member: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export async function getPaymentsStats() {
  await requireAdmin()
  const [total, success, pending, failed, totalRevenue] = await Promise.all([
    db.payment.count(),
    db.payment.count({ where: { status: 'SUCCESS' } }),
    db.payment.count({ where: { status: 'PENDING' } }),
    db.payment.count({ where: { status: 'FAILED' } }),
    db.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
  ])
  return { total, success, pending, failed, totalRevenue: Number(totalRevenue._sum.amount ?? 0) }
}
