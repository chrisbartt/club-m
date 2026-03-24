'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { reviewKyc } from '@/domains/kyc/actions'
import type { KycStatus } from '@/lib/generated/prisma/client'

interface KycData {
  id: string
  idDocumentUrl: string
  selfieUrl: string
  status: KycStatus
  submittedAt: Date
  rejectionReason: string | null
  reviewedAt: Date | null
}

interface KycReviewProps {
  kyc: KycData
  disabled?: boolean
}

const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuve',
  REJECTED: 'Rejete',
  MANUAL_REVIEW: 'Revision manuelle',
}

const KYC_STATUS_COLORS: Record<KycStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  MANUAL_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200',
}

export function KycReview({ kyc, disabled = false }: KycReviewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const canReview = kyc.status === 'PENDING' && !disabled

  async function handleApprove() {
    startTransition(async () => {
      const result = await reviewKyc({
        kycId: kyc.id,
        decision: 'APPROVED',
      })
      if (result.success) {
        toast.success('KYC approuve avec succes')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez indiquer un motif de rejet')
      return
    }
    startTransition(async () => {
      const result = await reviewKyc({
        kycId: kyc.id,
        decision: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      })
      if (result.success) {
        toast.success('KYC rejete')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          KYC — {new Date(kyc.submittedAt).toLocaleDateString('fr-FR')}
        </CardTitle>
        <Badge variant="outline" className={KYC_STATUS_COLORS[kyc.status]}>
          {KYC_STATUS_LABELS[kyc.status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document images */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Document d&apos;identite</p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              <Image
                src={kyc.idDocumentUrl}
                alt="Document d'identite"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Selfie</p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              <Image
                src={kyc.selfieUrl}
                alt="Selfie"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Rejection reason (if rejected) */}
        {kyc.status === 'REJECTED' && kyc.rejectionReason && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">Motif de rejet</p>
            <p className="text-sm text-red-600">{kyc.rejectionReason}</p>
          </div>
        )}

        {/* Review actions */}
        {canReview && (
          <div className="space-y-3 border-t pt-4">
            {showRejectInput ? (
              <div className="space-y-2">
                <Input
                  placeholder="Motif du rejet..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isPending}
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleReject}
                    disabled={isPending || !rejectionReason.trim()}
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Confirmer le rejet
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowRejectInput(false)
                      setRejectionReason('')
                    }}
                    disabled={isPending}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Approuver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectInput(true)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Rejeter
                </Button>
              </div>
            )}
          </div>
        )}

        {kyc.reviewedAt && (
          <p className="text-xs text-muted-foreground">
            Revise le {new Date(kyc.reviewedAt).toLocaleDateString('fr-FR')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
