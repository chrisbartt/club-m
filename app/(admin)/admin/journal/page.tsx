import Link from 'next/link'
import { ScrollText } from 'lucide-react'
import { getAuditLogs, getAuditLogEntities } from '@/domains/audit/queries'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Props {
  searchParams: Promise<{ entity?: string }>
}

const ACTION_LABELS: Record<string, string> = {
  'kyc.submit': 'Soumission KYC',
  'kyc.approved': 'Approbation KYC',
  'kyc.rejected': 'Rejet KYC',
  'member.suspend': 'Suspension membre',
  'member.reactivate': 'Reactivation membre',
  'member.change_tier': 'Changement de tier',
  'member.change_password': 'Changement mot de passe',
  'event.create': 'Creation evenement',
  'event.update': 'Modification evenement',
  'event.publish': 'Publication evenement',
  'event.cancel': 'Annulation evenement',
  'directory.create_profile': 'Creation profil business',
  'directory.approve': 'Approbation profil',
  'directory.reject': 'Rejet profil',
  'order.confirm_delivery': 'Confirmation livraison',
  'upgrade.request': 'Demande upgrade',
  'upgrade.cancel': 'Annulation upgrade',
}

function formatAction(action: string): string {
  return ACTION_LABELS[action] ?? action
}

export default async function AdminJournalPage({ searchParams }: Props) {
  const params = await searchParams
  const entityFilter = params.entity || undefined

  const [entities, logs] = await Promise.all([
    getAuditLogEntities(),
    getAuditLogs(entityFilter ? { entity: entityFilter } : undefined),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journal d&apos;audit</h1>
          <p className="text-muted-foreground">
            {logs.length} entree{logs.length !== 1 ? 's' : ''} affichee{logs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="rounded-md bg-muted p-2 text-muted-foreground">
          <ScrollText className="h-6 w-6" />
        </div>
      </div>

      {/* Entity filter */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/admin/journal">
          <Badge
            variant="outline"
            className={!entityFilter ? 'bg-primary text-primary-foreground' : 'cursor-pointer'}
          >
            Tous
          </Badge>
        </Link>
        {entities.map((entity) => (
          <Link key={entity} href={`/admin/journal?entity=${entity}`}>
            <Badge
              variant="outline"
              className={
                entityFilter === entity
                  ? 'bg-primary text-primary-foreground'
                  : 'cursor-pointer'
              }
            >
              {entity}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entite</TableHead>
              <TableHead>ID entite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucune entree trouvee.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {new Date(log.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    <span className="text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </TableCell>
                  <TableCell>{log.userEmail}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatAction(log.action)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.entity}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.entityId.slice(0, 8)}
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
