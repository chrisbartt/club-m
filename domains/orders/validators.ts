import { z } from 'zod'

export const paymentInfoSchema = z.object({
  provider: z.enum(['MPESA', 'AIRTEL', 'ORANGE']),
  walletId: z.string().min(10, 'Numero de telephone invalide'),
})

export const createOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  variantId: z.string().min(1).optional(),
  payment: paymentInfoSchema,
})

export const createCartOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
        variantId: z.string().min(1).optional(),
        variantLabel: z.string().min(1).optional(),
      }),
    )
    .min(1, 'Le panier est vide'),
  businessId: z.string().min(1),
  deliveryAddress: z
    .object({
      phone: z.string().min(1),
      commune: z.string().min(1),
      quartier: z.string().optional(),
      avenue: z.string().optional(),
      repere: z.string().optional(),
    })
    .optional(),
  couponCode: z.string().optional(),
  payment: paymentInfoSchema,
})

export const confirmDeliverySchema = z.object({
  orderId: z.string().min(1),
  confirmationCode: z.string().min(1, 'Code requis'),
})

export const markAsShippedSchema = z.object({
  orderId: z.string().min(1, 'Identifiant commande requis'),
})
