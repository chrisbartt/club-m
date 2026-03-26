'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-guards'
import type { NotificationType } from '@/lib/generated/prisma/client'

// Internal helper — called from other server actions, not from forms
export async function createNotification(input: {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}) {
  try {
    await db.notification.create({ data: input })
  } catch (error) {
    console.error('[createNotification] Failed:', error)
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const user = await requireAuth()
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    })
    if (!notification || notification.userId !== user.id) {
      return { success: false as const, error: 'NOT_FOUND' }
    }
    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
    return { success: true as const, data: { id: notificationId } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}

export async function markAllAsRead() {
  try {
    const user = await requireAuth()
    await db.notification.updateMany({
      where: { userId: user.id, read: false, deletedAt: null },
      data: { read: true },
    })
    return { success: true as const, data: { message: 'Toutes les notifications marquees comme lues.' } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}
