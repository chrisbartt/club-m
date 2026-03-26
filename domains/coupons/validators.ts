import { z } from 'zod'

export const createCouponSchema = z.object({
  code: z.string().min(1, 'Code requis').max(20, '20 caracteres maximum'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().min(0.01, 'Valeur minimum 0.01'),
  currency: z.enum(['USD', 'CDF', 'EUR']).optional(),
  minOrderAmount: z.number().min(0, 'Montant minimum 0').optional(),
  maxUses: z.number().int().min(1, 'Minimum 1 utilisation').optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
})

export const updateCouponSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  code: z.string().min(1, 'Code requis').max(20, '20 caracteres maximum'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().min(0.01, 'Valeur minimum 0.01'),
  currency: z.enum(['USD', 'CDF', 'EUR']).optional(),
  minOrderAmount: z.number().min(0, 'Montant minimum 0').optional(),
  maxUses: z.number().int().min(1, 'Minimum 1 utilisation').optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
})

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Code requis'),
  businessId: z.string().min(1, 'ID boutique requis'),
})
