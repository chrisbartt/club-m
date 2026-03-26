import { requireAuth } from '@/lib/auth-guards'
import { getNotificationsForUser } from '@/domains/notifications/queries'
import { NotificationList } from '@/components/member/notification-list'

export default async function NotificationsPage() {
  const user = await requireAuth()
  const notifications = await getNotificationsForUser(user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      <NotificationList notifications={JSON.parse(JSON.stringify(notifications))} />
    </div>
  )
}
