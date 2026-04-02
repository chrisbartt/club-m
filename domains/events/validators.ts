import { z } from 'zod'

const eventPriceSchema = z.object({
  targetRole: z.enum(['PUBLIC', 'FREE', 'PREMIUM', 'BUSINESS'], {
    error: 'Rôle de tarification invalide',
  }),
  price: z.number({ error: 'Le prix doit être un nombre' }).min(0, 'Le prix doit être positif'),
  currency: z.enum(['USD', 'CDF', 'EUR'], {
    error: 'Devise invalide',
  }).default('USD'),
})

export const createEventSchema = z.object({
  title: z.string({ error: 'Le titre est requis' }).min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string({ error: 'La description est requise' }).min(10, 'La description doit contenir au moins 10 caractères'),
  location: z.string({ error: 'Le lieu est requis' }).min(2, 'Le lieu doit contenir au moins 2 caractères'),
  startDate: z.string({ error: 'La date de début est requise' }),
  endDate: z.string({ error: 'La date de fin est requise' }),
  capacity: z.number({ error: 'La capacité doit être un nombre' }).int().min(1, 'La capacité doit être au moins 1'),
  coverImage: z.string().optional(),
  accessLevel: z.enum(['PUBLIC', 'MEMBERS_ONLY', 'PREMIUM_ONLY', 'BUSINESS_ONLY'], {
    error: "Niveau d'accès invalide",
  }),
  waitlistEnabled: z.boolean({ error: 'Valeur booléenne requise' }).default(false),
  prices: z.array(eventPriceSchema).min(1, 'Au moins un tarif est requis'),
})

export const eventIdSchema = z.object({
  eventId: z.string().min(1, 'Identifiant evenement requis'),
})

export const updateEventSchema = z.object({
  id: z.string({ error: "L'identifiant est requis" }),
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').optional(),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères').optional(),
  location: z.string().min(2, 'Le lieu doit contenir au moins 2 caractères').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.number().int().min(1, 'La capacité doit être au moins 1').optional(),
  coverImage: z.string().optional(),
  accessLevel: z.enum(['PUBLIC', 'MEMBERS_ONLY', 'PREMIUM_ONLY', 'BUSINESS_ONLY']).optional(),
  waitlistEnabled: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
  prices: z.array(eventPriceSchema).min(1).optional(),
})
