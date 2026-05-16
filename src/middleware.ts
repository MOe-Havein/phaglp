import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req

  // 1. Handle legacy /admin redirection
  if (nextUrl.pathname.startsWith("/admin")) {
    const newPathname = nextUrl.pathname.replace(/^\/admin/, "/control")
    const redirectUrl = new URL(newPathname, nextUrl.origin)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // NextAuth auth middleware will handle the 'authorized' callback logic from authConfig
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (route handlers), except for legacy admin ones
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
    "/control/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
