import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const res = NextResponse.next();

  // Add CSP headers for admin routes to prevent layout leakage and XSS
  if (req.nextUrl.pathname.startsWith("/control")) {
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.foxycart.com https://vercel.live https://phaglp.foxycart.com https://widget.cloudinary.com; style-src 'self' 'unsafe-inline' https://cdn.foxycart.com https://fonts.googleapis.com; img-src 'self' data: blob: https://cdn.foxycart.com https://res.cloudinary.com; font-src 'self' data: https://cdn.foxycart.com https://fonts.gstatic.com; frame-src 'self' https://vercel.live https://phaglp.foxycart.com https://cdn.foxycart.com https://widget.cloudinary.com; connect-src 'self' https://cdn.foxycart.com https://vercel.live https://phaglp.foxycart.com https://api.cloudinary.com;",
    );
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return res;
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
