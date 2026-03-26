import { db } from '@/lib/db'

export async function getNotificationsForUser(userId: string, limit = 50) {
  return db.notification.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({
    where: { userId, read: false, deletedAt: null },
  })
}
