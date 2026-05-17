import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  // 💡 الحل القاطع: تمرير المتغير السري هنا لضمان حقنه في كل مسارات التطبيق والـ Middleware
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnControl = nextUrl.pathname.startsWith("/control")
      const userRole = auth?.user?.role

      if (isOnControl) {
        if (isLoggedIn && userRole === "ADMIN") return true
        return false // Redirect to login
      }
      return true
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
