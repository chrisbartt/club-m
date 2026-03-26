import { requireAdmin } from '@/lib/auth-guards'
import { getOpenDisputes } from '@/domains/disputes/queries'
import { DisputeResolutionActions } from '@/components/admin/dispute-resolution-actions'

export default async function AdminLitigesPage() {
  await requireAdmin()
  const disputes = await getOpenDisputes()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Litiges</h1>

      {disputes.length === 0 ? (
        <p className="text-muted-foreground">Aucun litige en cours.</p>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">
                    {dispute.member.firstName} {dispute.member.lastName}
                  </span>
                  <span className="text-sm text-muted-foreground"> vs </span>
                  <span className="text-sm font-medium">
                    {dispute.order.business?.businessName}
                  </span>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {dispute.status === 'OPEN' ? 'Ouvert' : 'Reponse vendeuse'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{dispute.reason}</p>
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
              </div>
              {dispute.sellerResponse && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground">Reponse vendeuse :</p>
                  <p className="text-sm">{dispute.sellerResponse}</p>
                </div>
              )}
              <DisputeResolutionActions disputeId={dispute.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
