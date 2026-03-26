import { z } from 'zod'

export const openDisputeSchema = z.object({
  orderId: z.string().min(1, 'ID commande requis'),
  reason: z.enum(
    ['Produit non reçu', 'Produit non conforme', 'Produit endommagé', 'Autre'],
    { message: 'Raison invalide' }
  ),
  description: z
    .string()
    .min(10, '10 caracteres minimum')
    .max(2000, '2000 caracteres maximum'),
})

export const respondDisputeSchema = z.object({
  disputeId: z.string().min(1, 'ID litige requis'),
  response: z
    .string()
    .min(10, '10 caracteres minimum')
    .max(2000, '2000 caracteres maximum'),
})

export const resolveDisputeSchema = z.object({
  disputeId: z.string().min(1, 'ID litige requis'),
  decision: z.enum(['RESOLVED_BUYER', 'RESOLVED_SELLER', 'CLOSED'], {
    message: 'Decision invalide',
  }),
  adminNote: z
    .string()
    .max(2000, '2000 caracteres maximum')
    .optional(),
})
