import { z } from 'zod'

export const createProfileSchema = z.object({
  businessName: z.string().min(1, { error: 'Nom requis' }).max(200),
  description: z.string().min(10, { error: 'La description doit contenir au moins 10 caracteres' }),
  category: z.string().min(1, { error: 'Categorie requise' }),
  coverImage: z.string().url({ error: 'URL invalide' }).optional(),
  images: z.array(z.string().url({ error: 'URL invalide' })).default([]),
  phone: z.string().optional(),
  email: z.union([z.string().email({ error: 'Email invalide' }), z.literal('')]).optional(),
  website: z.string().url({ error: 'URL invalide' }).optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
})

export const updateProfileSchema = createProfileSchema.partial().extend({
  id: z.string().min(1),
})
