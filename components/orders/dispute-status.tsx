import { Badge } from '@/components/ui/badge'

interface DisputeStatusProps {
  dispute: {
    reason: string
    description: string
    status: string
    sellerResponse: string | null
    adminNote: string | null
    resolution: string | null
    createdAt: string
  }
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  OPEN: {
    label: 'En attente de la vendeuse',
    className: 'bg-orange-100 text-orange-700',
  },
  SELLER_RESPONDED: {
    label: 'Reponse recue',
    className: 'bg-blue-100 text-blue-700',
  },
  RESOLVED_BUYER: {
    label: 'Resolu en votre faveur',
    className: 'bg-green-100 text-green-700',
  },
  RESOLVED_SELLER: {
    label: 'Resolu en faveur de la vendeuse',
    className: 'bg-orange-100 text-orange-700',
  },
  CLOSED: {
    label: 'Ferme',
    className: 'bg-gray-100 text-gray-700',
  },
}

export function DisputeStatus({ dispute }: DisputeStatusProps) {
  const config = STATUS_CONFIG[dispute.status] ?? STATUS_CONFIG.OPEN
  const date = new Date(dispute.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Badge className={config.className}>{config.label}</Badge>
        <span className="text-sm text-muted-foreground">Ouvert le {date}</span>
      </div>

      {/* Reason + description — shown for OPEN and SELLER_RESPONDED */}
      {(dispute.status === 'OPEN' || dispute.status === 'SELLER_RESPONDED') && (
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Raison :</span> {dispute.reason}
          </p>
          <p>
            <span className="font-medium">Description :</span> {dispute.description}
          </p>
        </div>
      )}

      {/* Seller response */}
      {dispute.status === 'SELLER_RESPONDED' && dispute.sellerResponse && (
        <div className="rounded-md bg-blue-50 p-3 text-sm">
          <p className="font-medium text-blue-800">Reponse de la vendeuse</p>
          <p className="mt-1 text-blue-700">{dispute.sellerResponse}</p>
          <p className="mt-2 text-xs text-blue-600">En attente de resolution par l&apos;admin</p>
        </div>
      )}

      {/* Resolution */}
      {(dispute.status === 'RESOLVED_BUYER' ||
        dispute.status === 'RESOLVED_SELLER' ||
        dispute.status === 'CLOSED') &&
        dispute.resolution && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">Resolution</p>
            <p className="mt-1">{dispute.resolution}</p>
          </div>
        )}

      {/* Admin note */}
      {dispute.adminNote && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Note de l&apos;admin</p>
          <p className="mt-1">{dispute.adminNote}</p>
        </div>
      )}
    </div>
  )
}
