import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, CalendarDays, Users } from 'lucide-react'
import { getAdminEventDetail } from '@/domains/events/admin-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { EventStatus, TicketStatus, PricingRole } from '@/lib/generated/prisma/client'
import { EventDetailActions } from './event-detail-actions'

interface Props {
  params: Promise<{ id: string }>
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

const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  PENDING: 'En attente',
  PAID: 'Paye',
  CANCELLED: 'Annule',
  USED: 'Utilise',
}

const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  USED: 'bg-blue-50 text-blue-700 border-blue-200',
}

const ROLE_LABELS: Record<PricingRole, string> = {
  PUBLIC: 'Public',
  FREE: 'Free',
  PREMIUM: 'Premium',
  BUSINESS: 'Business',
}

export default async function AdminEventDetailPage({ params }: Props) {
  const { id } = await params
  const event = await getAdminEventDetail(id)

  if (!event) {
    redirect('/admin/evenements')
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/evenements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux evenements
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={STATUS_COLORS[event.status]}>
              {STATUS_LABELS[event.status]}
            </Badge>
            <Badge variant="outline">{event.accessLevel}</Badge>
            {event.waitlistEnabled && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Liste d&apos;attente
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(event.startDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' — '}
              {new Date(event.endDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {event._count.tickets} / {event.capacity} places
            </span>
          </div>
        </div>

        <EventDetailActions eventId={event.id} status={event.status} />
      </div>

      {/* Description */}
      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Tarification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Devise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.prices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Aucun tarif defini.
                    </TableCell>
                  </TableRow>
                ) : (
                  event.prices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell className="font-medium">
                        {ROLE_LABELS[price.targetRole]}
                      </TableCell>
                      <TableCell>
                        {Number(price.price) === 0
                          ? 'Gratuit'
                          : `${CURRENCY_SYMBOLS[price.currency]} ${price.price}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {price.currency}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({event.tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      Aucun ticket vendu.
                    </TableCell>
                  </TableRow>
                ) : (
                  event.tickets.map((ticket) => {
                    const name = ticket.member
                      ? `${ticket.member.firstName} ${ticket.member.lastName}`
                      : ticket.customer
                        ? `${ticket.customer.firstName} ${ticket.customer.lastName}`
                        : 'Inconnu'

                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={TICKET_STATUS_COLORS[ticket.status]}>
                            {TICKET_STATUS_LABELS[ticket.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
