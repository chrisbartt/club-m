import Link from 'next/link'
import { CalendarDays, FileText, Eye, Ticket, Plus } from 'lucide-react'
import { getAdminEventsStats, getAdminEventsList } from '@/domains/events/admin-queries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { EventStatus } from '@/lib/generated/prisma/client'

interface Props {
  searchParams: Promise<{ status?: string }>
}

const STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publie',
  CANCELLED: 'Annule',
  COMPLETED: 'Termine',
}

const STATUS_COLORS: Record<EventStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
  PUBLISHED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
}

const VALID_STATUSES: EventStatus[] = ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']

export default async function AdminEvenementsPage({ searchParams }: Props) {
  const params = await searchParams
  const statusFilter = VALID_STATUSES.includes(params.status as EventStatus)
    ? (params.status as EventStatus)
    : undefined

  const [stats, events] = await Promise.all([
    getAdminEventsStats(),
    getAdminEventsList(statusFilter ? { status: statusFilter } : undefined),
  ])

  const statCards = [
    { label: 'Total', value: stats.total, icon: CalendarDays, color: 'text-blue-600' },
    { label: 'Publies', value: stats.published, icon: Eye, color: 'text-green-600' },
    { label: 'Brouillons', value: stats.draft, icon: FileText, color: 'text-gray-600' },
    { label: 'Tickets vendus', value: stats.totalPaidTickets, icon: Ticket, color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Evenements</h1>
          <p className="text-muted-foreground">Gestion des evenements Club M</p>
        </div>
        <Button asChild>
          <Link href="/admin/evenements/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Creer un evenement
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`rounded-md bg-muted p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        <Link href="/admin/evenements">
          <Badge
            variant="outline"
            className={!statusFilter ? 'bg-primary text-primary-foreground' : 'cursor-pointer'}
          >
            Tous
          </Badge>
        </Link>
        {VALID_STATUSES.map((s) => (
          <Link key={s} href={`/admin/evenements?status=${s}`}>
            <Badge
              variant="outline"
              className={
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : `cursor-pointer ${STATUS_COLORS[s]}`
              }
            >
              {STATUS_LABELS[s]}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Capacite</TableHead>
              <TableHead>Tickets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun evenement trouve.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`/admin/evenements/${event.id}`}
                      className="font-medium hover:underline"
                    >
                      {event.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(event.startDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_COLORS[event.status]}>
                      {STATUS_LABELS[event.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {event.capacity}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {event._count.tickets}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
