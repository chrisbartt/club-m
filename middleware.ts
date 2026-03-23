import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import {
  isProtectedMemberRoute,
  isProtectedAdminRoute,
  isAuthRoute,
} from '@/lib/routes'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      const redirectTo = req.auth?.user?.isAdmin
        ? '/admin/dashboard'
        : '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }
    return NextResponse.next()
  }

  if (isProtectedMemberRoute(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      )
    }
    return NextResponse.next()
  }

  if (isProtectedAdminRoute(pathname)) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL('/login', req.url))
    if (!req.auth?.user?.isAdmin)
      return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico|logos/).*)'],
}
