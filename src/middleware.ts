import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-at-least-32-chars-long",
)
const COOKIE_NAME = "app-session"

interface DecodedToken {
  userId: string
  email: string
  role: string
}

async function getSessionFromRequest(req: NextRequest): Promise<DecodedToken | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as DecodedToken
  } catch (error) {
    return null
  }
}

export async function middleware(req: NextRequest) {
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
    const session = await getSessionFromRequest(req)

    // Unauthorized or not an ADMIN role
    if (!session || session.role !== "ADMIN") {
      const loginUrl = new URL("/login", nextUrl.origin)
      // Save original URL to redirect back after login
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

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
