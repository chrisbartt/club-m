import { db } from '@/lib/db'

export async function getMemberProfile(userId: string) {
  return db.member.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true, emailVerified: true } },
      businessProfile: {
        select: { businessName: true, profileType: true, isApproved: true },
      },
      kycVerifications: { orderBy: { submittedAt: 'desc' }, take: 1 },
      subscriptions: { where: { status: 'ACTIVE' }, take: 1 },
    },
  })
}

export async function getMemberStats(memberId: string) {
  const [orderCount, ticketCount] = await Promise.all([
    db.order.count({ where: { memberId } }),
    db.ticket.count({ where: { memberId, status: 'PAID' } }),
  ])
  return { orderCount, ticketCount }
}
