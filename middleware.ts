import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'
import {
  isProtectedMemberRoute,
  isProtectedAdminRoute,
  isAuthRoute,
} from '@/lib/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Auth routes: always accessible (no redirect when logged in — prevents loops with stale sessions)
  if (isAuthRoute(pathname)) {
    return NextResponse.next()
  }

  if (isProtectedMemberRoute(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      )
    }
    // Admin accessing /dashboard → redirect to /admin/dashboard
    if (pathname === '/dashboard' && req.auth?.user?.isAdmin && !req.auth?.user?.isMember) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    // Pass pathname to server components via header
    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return response
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
