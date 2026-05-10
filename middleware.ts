import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  const isLoginPage = pathname === '/login'
  const isOspitePage = pathname.startsWith('/ospite')

  if (isOspitePage) return NextResponse.next()

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}