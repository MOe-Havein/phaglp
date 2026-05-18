import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  // 1. Handle legacy /admin redirection
  if (pathname.startsWith("/admin")) {
    const newPathname = pathname.replace(/^\/admin/, "/control")
    const redirectUrl = new URL(newPathname, nextUrl.origin)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // 2. Define protected patterns
  // Admin-only path pattern
  const isAdminPath = pathname.startsWith("/control")

  if (isAdminPath) {
    const session = req.auth
    const isLoggedIn = !!session?.user
    const userRole = session?.user?.role

    // Unauthorized or not an ADMIN role
    if (!isLoggedIn || userRole !== "ADMIN") {
      const loginUrl = new URL("/login", nextUrl.origin)
      // Save original URL to redirect back after login
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (route handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
    "/control/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
