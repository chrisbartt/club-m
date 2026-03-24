import { getAdminProfiles } from '@/domains/directory/queries'
import { TIER_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProfileModerationActions } from '@/components/admin/profile-moderation-actions'

interface Props {
  searchParams: Promise<{
    filter?: string
  }>
}

export default async function AdminAnnuairePage({ searchParams }: Props) {
  const params = await searchParams

  const approvedFilter =
    params.filter === 'approved'
      ? true
      : params.filter === 'pending'
        ? false
        : undefined

  const profiles = await getAdminProfiles(
    approvedFilter !== undefined ? { approved: approvedFilter } : undefined,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moderation Annuaire</h1>
        <p className="text-muted-foreground">
          Gestion des profils business
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <a
          href="/admin/annuaire"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            !params.filter
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Tous ({profiles.length})
        </a>
        <a
          href="/admin/annuaire?filter=pending"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            params.filter === 'pending'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          En attente
        </a>
        <a
          href="/admin/annuaire?filter=approved"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            params.filter === 'approved'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Approuves
        </a>
      </div>

      {profiles.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
          <p className="text-muted-foreground">Aucun profil trouve</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Membre</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => {
                const memberName = `${profile.member.firstName} ${profile.member.lastName}`
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.businessName}
                    </TableCell>
                    <TableCell>{memberName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {TIER_LABELS[profile.member.tier]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {profile.profileType === 'STORE' ? 'Boutique' : 'Vitrine'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.isApproved ? 'default' : 'secondary'}>
                        {profile.isApproved ? 'Approuve' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ProfileModerationActions
                        profileId={profile.id}
                        isApproved={profile.isApproved}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
