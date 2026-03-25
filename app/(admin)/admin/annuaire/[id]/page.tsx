import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/auth-guards'
import { getProfileWithStats } from '@/domains/directory/queries'
import { TIER_LABELS, CURRENCY_SYMBOLS } from '@/lib/constants'
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
import { BoutiqueAdminActions } from '@/components/admin/boutique-admin-actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminBoutiqueDetailPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params
  const profile = await getProfileWithStats(id)

  if (!profile) notFound()

  const memberName = `${profile.member.firstName} ${profile.member.lastName}`
  const defaultCurrency = profile.products[0]?.currency ?? 'USD'
  const currency = CURRENCY_SYMBOLS[defaultCurrency] ?? defaultCurrency

  function formatAmount(amount: number) {
    return `${currency} ${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/annuaire"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour a l&apos;annuaire
      </Link>

      {/* Header */}
      <div className="overflow-hidden rounded-lg border">
        {profile.coverImage ? (
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.coverImage})` }}
          />
        ) : (
          <div className="h-48 bg-gray-200" />
        )}
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{profile.businessName}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{profile.category}</Badge>
                <Badge variant="secondary">
                  {profile.profileType === 'STORE' ? 'Boutique' : 'Vitrine'}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={profile.isPublished ? 'default' : 'secondary'}>
                {profile.isPublished ? 'Publie' : 'Non publie'}
              </Badge>
              <Badge
                variant={profile.isApproved ? 'default' : 'destructive'}
              >
                {profile.isApproved ? 'Approuve' : 'Non approuve'}
              </Badge>
            </div>
          </div>

          {/* Owner info */}
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{memberName}</span>
            {' — '}
            {profile.member.user.email}
            <span className="ml-2">
              <Badge variant="secondary" className="text-xs">
                {TIER_LABELS[profile.member.tier]}
              </Badge>
            </span>
            <span className="ml-2">
              <Badge
                variant={profile.member.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {profile.member.verificationStatus === 'VERIFIED'
                  ? 'Verifie'
                  : profile.member.verificationStatus === 'PENDING_VERIFICATION'
                    ? 'En attente'
                    : 'Non verifie'}
              </Badge>
            </span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile.description || 'Aucune description'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profile.phone && (
              <div>
                <span className="font-medium">Telephone :</span>{' '}
                <a href={`tel:${profile.phone}`} className="text-primary hover:underline">
                  {profile.phone}
                </a>
              </div>
            )}
            {profile.email && (
              <div>
                <span className="font-medium">Email :</span>{' '}
                <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                  {profile.email}
                </a>
              </div>
            )}
            {profile.website && (
              <div>
                <span className="font-medium">Site web :</span>{' '}
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {profile.website}
                </a>
              </div>
            )}
            {profile.whatsapp && (
              <div>
                <span className="font-medium">WhatsApp :</span>{' '}
                <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {profile.whatsapp}
                </a>
              </div>
            )}
            {!profile.phone && !profile.email && !profile.website && !profile.whatsapp && (
              <p className="text-muted-foreground">Aucun contact renseigne</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adresse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile.address || 'Non renseignee'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Cree le :</span>{' '}
              {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produits actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {profile.stats.activeProducts}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                / {profile.stats.totalProducts}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{profile.stats.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d&apos;affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatAmount(profile.stats.totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Panier moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatAmount(profile.stats.avgOrderValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits ({profile.products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.products.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Aucun produit
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        {CURRENCY_SYMBOLS[product.currency] ?? product.currency}{' '}
                        {Number(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.type === 'SERVICE' ? 'Service' : 'Produit'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.type === 'SERVICE' ? '—' : (product.stock ?? '—')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Oui' : 'Non'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <BoutiqueAdminActions
            profileId={profile.id}
            slug={profile.slug}
            isApproved={profile.isApproved}
          />
        </CardContent>
      </Card>
    </div>
  )
}
