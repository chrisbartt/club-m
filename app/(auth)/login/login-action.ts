'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function loginAction(input: {
  email: string
  password: string
  callbackUrl: string
}): Promise<{ success: false; error: string }> {
  try {
    await signIn('credentials', {
      email: input.email,
      password: input.password,
      redirectTo: input.callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    // NEXT_REDIRECT is thrown by signIn on success — rethrow it
    throw error
  }

  return { success: false, error: 'Une erreur est survenue.' }
}
