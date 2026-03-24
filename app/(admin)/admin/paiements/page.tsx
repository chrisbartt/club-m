import Link from 'next/link'
import { CreditCard } from 'lucide-react'
import { getAdminPayments, getPaymentsStats } from '@/domains/payments/queries'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PaymentStatus } from '@/lib/generated/prisma/client'

interface Props {
  searchParams: Promise<{ status?: string }>
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'En attente',
  SUCCESS: 'Reussi',
  FAILED: 'Echoue',
  REFUNDED: 'Rembourse',
}

const STATUS_COLORS: Record<PaymentStatus, string> = {
  SUCCESS: 'bg-green-50 text-green-700 border-green-200',
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-blue-50 text-blue-700 border-blue-200',
}

const VALID_STATUSES: PaymentStatus[] = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']

const FILTER_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'SUCCESS', label: 'Reussis' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'FAILED', label: 'Echoues' },
]

export default async function AdminPaiementsPage({ searchParams }: Props) {
  const params = await searchParams
  const statusFilter = VALID_STATUSES.includes(params.status as PaymentStatus)
    ? (params.status as PaymentStatus)
    : undefined

  const [stats, payments] = await Promise.all([
    getPaymentsStats(),
    getAdminPayments(statusFilter ? { status: statusFilter } : undefined),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Supervision Paiements</h1>
          <p className="text-muted-foreground">
            {payments.length} paiement{payments.length !== 1 ? 's' : ''} affiche{payments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="rounded-md bg-muted p-2 text-muted-foreground">
          <CreditCard className="h-6 w-6" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reussis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Echoues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenu total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('fr-FR')} $</p>
          </CardContent>
        </Card>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/admin/paiements">
          <Badge
            variant="outline"
            className={!statusFilter ? 'bg-primary text-primary-foreground' : 'cursor-pointer'}
          >
            Tous
          </Badge>
        </Link>
        {FILTER_STATUSES.map((s) => (
          <Link key={s.value} href={`/admin/paiements?status=${s.value}`}>
            <Badge
              variant="outline"
              className={
                statusFilter === s.value
                  ? 'bg-primary text-primary-foreground'
                  : `cursor-pointer ${STATUS_COLORS[s.value]}`
              }
            >
              {s.label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Payments Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun paiement trouve.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const symbol = CURRENCY_SYMBOLS[payment.currency] ?? payment.currency

                let typeLabel = 'Inconnu'
                if (payment.orderId && payment.order) {
                  typeLabel = `Commande — ${payment.order.business.businessName}`
                } else if (payment.ticketId && payment.ticket) {
                  typeLabel = `Ticket — ${payment.ticket.event.title}`
                } else if (payment.subscriptionId && payment.subscription) {
                  typeLabel = `Abonnement — ${payment.subscription.member.firstName} ${payment.subscription.member.lastName}`
                }

                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{typeLabel}</TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(payment.amount).toLocaleString('fr-FR')} {symbol}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_COLORS[payment.status]}>
                        {STATUS_LABELS[payment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {payment.provider}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
