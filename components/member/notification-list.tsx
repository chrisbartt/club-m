'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, ShieldCheck, Store, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { markAsRead, markAllAsRead } from '@/domains/notifications/actions'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "a l'instant"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `il y a ${days}j`
  const months = Math.floor(days / 30)
  return `il y a ${months} mois`
}

function getIcon(type: string) {
  if (type.startsWith('ORDER_')) return ShoppingCart
  if (type.startsWith('KYC_')) return ShieldCheck
  if (type.startsWith('PROFILE_')) return Store
  return Bell
}

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isPending, startTransition] = useTransition()

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications

  const hasUnread = notifications.some((n) => !n.read)

  async function handleClick(notification: Notification) {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
    router.refresh()
  }

  async function handleMarkAllAsRead() {
    startTransition(async () => {
      await markAllAsRead()
      router.refresh()
    })
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Bell className="mb-4 h-12 w-12" />
        <p className="text-lg">Aucune notification</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Non lues
          </Button>
        </div>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Bell className="mb-4 h-10 w-10" />
          <p>Aucune notification non lue</p>
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {filtered.map((notification) => {
            const Icon = getIcon(notification.type)
            return (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      notification.read ? 'bg-transparent' : 'bg-blue-500'
                    )}
                  />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !notification.read && 'font-bold')}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(notification.createdAt)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
