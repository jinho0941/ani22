import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiUploadThingPrefix,
  authRoutes,
} from '@/routes'
import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(`/${apiAuthPrefix}`)
  const isApiUploadthingRoute = nextUrl.pathname.startsWith(
    `/${apiUploadThingPrefix}`,
  )
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute || isApiUploadthingRoute) {
    return NextResponse.next()
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
