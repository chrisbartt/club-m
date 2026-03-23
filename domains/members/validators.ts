import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export const registerMemberSchema = z.object({
  email: z.string().email({ error: 'Email invalide' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres`,
  }),
  firstName: z.string().min(1, { error: 'Prenom requis' }).max(100),
  lastName: z.string().min(1, { error: 'Nom requis' }).max(100),
  certifyWoman: z.literal(true, {
    error: 'Vous devez certifier etre une femme',
  }),
  acceptTerms: z.literal(true, {
    error: 'Vous devez accepter les conditions',
  }),
})

export const registerCustomerSchema = z.object({
  email: z.string().email({ error: 'Email invalide' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres`,
  }),
  firstName: z.string().min(1, { error: 'Prenom requis' }).max(100),
  lastName: z.string().min(1, { error: 'Nom requis' }).max(100),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email({ error: 'Email invalide' }),
  password: z.string().min(1, { error: 'Mot de passe requis' }),
})
