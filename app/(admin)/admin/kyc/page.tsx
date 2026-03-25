import { requireAdmin } from '@/lib/auth-guards'
import { getKycListWithFilters, getKycCount } from '@/domains/kyc/queries'
import { KycList } from '@/components/admin/kyc-list'

export default async function AdminKycPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  await requireAdmin()
  const params = await searchParams
  const status = params.status || 'PENDING'
  const search = params.search || ''
  const kycList = await getKycListWithFilters(status, search)
  const pendingCount = await getKycCount()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verification KYC</h1>
        <p className="text-muted-foreground">{pendingCount} verification(s) en attente</p>
      </div>
      <KycList items={JSON.parse(JSON.stringify(kycList))} currentStatus={status} currentSearch={search} />
    </div>
  )
}
