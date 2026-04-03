'use server'

import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(input: {
  email: string
  password: string
  callbackUrl: string
}): Promise<{ success: false; error: string }> {
  try {
    await signIn('credentials', {
      email: input.email,
      password: input.password,
      redirect: false,
    })
  } catch (error) {
    // AuthError from next-auth means invalid credentials
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is actually a redirect, not an error — rethrow
      throw error
    }
    return { success: false, error: 'Email ou mot de passe incorrect.' }
  }

  redirect(input.callbackUrl)
}
