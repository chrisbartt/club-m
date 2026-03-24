import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { TicketWithEvent } from '@/domains/tickets/types'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PAID: { label: 'Confirme', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  USED: { label: 'Utilise', className: 'bg-gray-500/10 text-gray-500 border-gray-200' },
  CANCELLED: { label: 'Annule', className: 'bg-red-500/10 text-red-600 border-red-200' },
  PENDING: { label: 'En attente', className: 'bg-amber-500/10 text-amber-600 border-amber-200' },
}

function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(new Date(date))
    .replace(':', 'h')
}

type TicketCardProps = {
  ticket: TicketWithEvent
}

export function TicketCard({ ticket }: TicketCardProps) {
  const statusConfig = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.PENDING

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <h3 className="font-semibold truncate">{ticket.event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateFr(ticket.event.startDate)}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {ticket.event.location}
            </p>
          </div>
          <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* QR Code display */}
        <div className="rounded-md bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Code QR</p>
          <p className="font-mono text-sm tracking-wider break-all">
            {ticket.qrCode}
          </p>
        </div>

        {/* Payment info */}
        {ticket.payment && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Montant paye</span>
            <span className="font-medium">
              {Number(ticket.payment.amount)}
              {CURRENCY_SYMBOLS[ticket.payment.currency]}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
