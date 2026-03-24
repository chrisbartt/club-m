import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'Prenom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio trop longue').optional(),
})

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(
      PASSWORD_MIN_LENGTH,
      `Minimum ${PASSWORD_MIN_LENGTH} caracteres`
    ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().url('URL invalide'),
})
