import { z } from 'zod'

export const createTontineSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caracteres'),
  code: z.string().max(20).optional(),
  monthlyAmount: z.number().min(1, 'Le montant mensuel doit etre positif'),
  currency: z.enum(['USD', 'CDF', 'EUR']).default('USD'),
  durationMonths: z.number().int().min(1).max(60),
  startDate: z.string().min(1, 'La date de debut est requise'),
  totalSpots: z.number().int().min(2, 'Minimum 2 places').max(100),
  description: z.string().optional(),
  isPremium: z.boolean().default(false),
  notifyMembers: z.boolean().default(true),
  allowPreRegistration: z.boolean().default(false),
})

export const updateTontineSchema = createTontineSchema.partial().extend({
  id: z.string().min(1),
})

export const tontineIdSchema = z.object({
  tontineId: z.string().min(1, 'Identifiant tontine requis'),
})

export const recordPaymentSchema = z.object({
  tontineMemberId: z.string().min(1),
  amount: z.number().min(0),
  dueDate: z.string().min(1),
})

export const sendReminderSchema = z.object({
  tontineId: z.string().min(1),
  memberIds: z.array(z.string().min(1)).min(1, 'Selectionnez au moins un membre'),
  tone: z.enum(['rappel_amical', 'formel', 'ferme']).default('rappel_amical'),
  message: z.string().optional(),
})
