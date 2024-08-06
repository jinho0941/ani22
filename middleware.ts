import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiUploadThingPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth(async (req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(`/${apiAuthPrefix}`)
  const isApiUploadthingRoute = nextUrl.pathname.startsWith(
    `/${apiUploadThingPrefix}`,
  )
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  const isFirst = req.cookies.has('isFirstLogin')
  if (nextUrl.pathname !== '/topic') {
    if (isLoggedIn && isFirst) {
      return NextResponse.redirect(new URL('/topic', nextUrl))
    }
  }

  if (isApiAuthRoute) {
    return
  }
  if (isApiUploadthingRoute) {
    return
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
