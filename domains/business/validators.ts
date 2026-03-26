import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, { error: 'Nom requis' }).max(200),
  description: z.string().min(1, { error: 'Description requise' }),
  price: z.number().min(0, { error: 'Le prix doit etre positif ou zero' }),
  currency: z.enum(['USD', 'CDF', 'EUR'], { error: 'Devise invalide' }),
  images: z.array(z.string().url({ error: 'URL invalide' })).default([]),
  type: z.enum(['PHYSICAL', 'SERVICE', 'DIGITAL'], { error: 'Type invalide' }),
  categoryId: z.string().optional(),
  stock: z.number().int({ error: 'Le stock doit etre un entier' }).min(0, { error: 'Le stock doit etre positif ou zero' }).optional(),
  variants: z.array(z.object({
    label: z.string().min(1).max(50),
    sku: z.string().max(50).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0),
    position: z.number().int().min(0).optional(),
  })).optional(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1),
})
