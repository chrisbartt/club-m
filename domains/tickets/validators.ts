import { z } from 'zod'

export const bookEventSchema = z.object({
  eventSlug: z.string().min(1, 'Slug evenement requis'),
  payment: z.object({
    provider: z.enum(['MPESA', 'AIRTEL', 'ORANGE']),
    walletId: z.string().min(10, 'Numero de telephone invalide'),
  }),
})

export const scanTicketSchema = z.object({
  qrCode: z.string().min(1, 'QR code requis'),
})
