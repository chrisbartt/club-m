'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { reviewKyc } from '@/domains/kyc/actions'

interface KycItem {
  id: string
  idDocumentUrl: string
  selfieUrl: string
  status: string
  provider: string | null
  rejectionReason: string | null
  reviewedBy: string | null
  submittedAt: string
  reviewedAt: string | null
  member: {
    id: string
    firstName: string
    lastName: string
    tier: string
    verificationStatus: string
    phone: string | null
    createdAt: string
    user: {
      email: string
    }
  }
}

interface KycDetailPanelProps {
  item: KycItem
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  MANUAL_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuve',
  REJECTED: 'Rejete',
  MANUAL_REVIEW: 'Revision manuelle',
}

export function KycDetailPanel({ item, onClose, onPrev, onNext }: KycDetailPanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const canReview = item.status === 'PENDING'

  function handleApprove() {
    startTransition(async () => {
      const result = await reviewKyc({
        kycId: item.id,
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

  function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez indiquer un motif de rejet')
      return
    }
    startTransition(async () => {
      const result = await reviewKyc({
        kycId: item.id,
        decision: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      })
      if (result.success) {
        toast.success('KYC rejete')
        setShowRejectInput(false)
        setRejectionReason('')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {item.member.firstName} {item.member.lastName}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Member info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={STATUS_COLORS[item.status]}>
                {STATUS_LABELS[item.status] || item.status}
              </Badge>
              <Badge variant="secondary">{item.member.tier}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{item.member.user.email}</p>
            {item.member.createdAt && (
              <p className="text-xs text-muted-foreground">
                Membre depuis le {new Date(item.member.createdAt).toLocaleDateString('fr-FR')}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Soumis le {new Date(item.submittedAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Document images */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Documents</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Document d&apos;identite</p>
                  <a
                    href={item.idDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Ouvrir <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={item.idDocumentUrl}
                    alt="Document d'identite"
                    className="w-full object-contain max-h-48"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Selfie</p>
                  <a
                    href={item.selfieUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Ouvrir <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={item.selfieUrl}
                    alt="Selfie"
                    className="w-full object-contain max-h-48"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Review history */}
          {item.reviewedAt && (
            <div className="space-y-1 rounded-md border p-3">
              <p className="text-sm font-medium">Historique de revision</p>
              <p className="text-xs text-muted-foreground">
                Revise le {new Date(item.reviewedAt).toLocaleDateString('fr-FR')}
              </p>
              {item.reviewedBy && (
                <p className="text-xs text-muted-foreground">Par : {item.reviewedBy}</p>
              )}
            </div>
          )}

          {/* Rejection reason (if rejected) */}
          {item.status === 'REJECTED' && item.rejectionReason && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">Motif de rejet</p>
              <p className="text-sm text-red-600">{item.rejectionReason}</p>
            </div>
          )}

          {/* Review actions */}
          {canReview && (
            <div className="space-y-3 border-t pt-4">
              {showRejectInput ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Motif du rejet..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    disabled={isPending}
                    rows={3}
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

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={!onPrev}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Precedent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!onNext}
            >
              Suivant
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
