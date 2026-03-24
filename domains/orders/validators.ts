import { z } from 'zod'

export const createOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
})

export const confirmDeliverySchema = z.object({
  orderId: z.string().min(1),
  confirmationCode: z.string().min(1, 'Code requis'),
})
