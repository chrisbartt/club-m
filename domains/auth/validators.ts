import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export const forgotPasswordSchema = z.object({
  email: z.string().email({ error: 'Email invalide' }),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { error: 'Token requis' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres`,
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, { error: 'Token requis' }),
})

export const resendVerificationSchema = z.object({})

export const changeEmailSchema = z.object({
  newEmail: z.string().email({ error: 'Email invalide' }),
  currentPassword: z.string().min(1, { error: 'Mot de passe requis' }),
})
