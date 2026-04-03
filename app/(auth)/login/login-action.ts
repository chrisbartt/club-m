'use server'

import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'
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
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    throw error
  }

  // signIn succeeded — redirect manually
  redirect(input.callbackUrl)
}
