import { z } from 'zod'

export const createReviewSchema = z.object({
  orderId: z.string().min(1, 'ID commande requis'),
  rating: z.number().int().min(1, 'Note minimum 1').max(5, 'Note maximum 5'),
  comment: z.string().max(1000, '1000 caracteres maximum').optional(),
})

export const flagReviewSchema = z.object({
  reviewId: z.string().min(1, 'ID avis requis'),
  reason: z
    .string()
    .min(10, '10 caracteres minimum')
    .max(500, '500 caracteres maximum'),
})
