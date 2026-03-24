import { z } from 'zod'

export const submitKycSchema = z.object({
  idDocumentUrl: z.string().url('URL du document invalide'),
  selfieUrl: z.string().url('URL du selfie invalide'),
})

export const reviewKycSchema = z.object({
  kycId: z.string().min(1, 'ID KYC requis'),
  decision: z.enum(['APPROVED', 'REJECTED'], {
    error: 'Decision invalide',
  }),
  rejectionReason: z.string().optional(),
}).refine(
  (data) => data.decision !== 'REJECTED' || (data.rejectionReason && data.rejectionReason.length > 0),
  {
    message: 'Raison du rejet requise',
    path: ['rejectionReason'],
  }
)
