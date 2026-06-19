import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(
  (req: {
    auth: any;
    nextUrl: { pathname: string; origin: string | URL | undefined };
  }) => {
    const isLoggedIn = !!req.auth; // converts session object to boolean
    const inAdminRoute = req.nextUrl.pathname.startsWith("/control");

    // Only run this on admin pages, not every single page load
    if (inAdminRoute) {
      // If admin but not logged in → redirect to login
      if (!isLoggedIn) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Optional: if you want to block non-admins from /control
      // const user = req.auth?.user as any;
      // if (user?.role !== "ADMIN") {
      //   return NextResponse.redirect(new URL("/", req.nextUrl.origin));
      // }
    }

    const response = NextResponse.next();

    // Build CSP
    const csp = [
      // Default fallback
      "default-src 'self'",

      // JavaScript
      // Remove 'unsafe-eval' if your app doesn't require it.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://cdn.foxycart.com " +
        "https://phaglp.foxycart.com " +
        "https://va.vercel-scripts.com " +
        "https://vercel.live " +
        "https://upload-widget.cloudinary.com " +
        "https://res.cloudinary.com " +
        "https://*.cloudinary.com",

      // CSS
      "style-src 'self' 'unsafe-inline' https://cdn.foxycart.com",

      // Images
      "img-src 'self' data: blob: " +
        "https://res.cloudinary.com " +
        "https://*.cloudinary.com " +
        "https://*.unsplash.com " +
        "https://cdn.foxycart.com",

      // Fonts
      "font-src 'self' data:",

      // API calls, fetch(), WebSockets, analytics
      "connect-src 'self' " +
        "https://phaglp.foxycart.com " +
        "https://cdn.foxycart.com " +
        "https://api.cloudinary.com " +
        "https://res.cloudinary.com " +
        "https://va.vercel-scripts.com " +
        "https://vercel.live " +
        "wss://ws-us3.pusher.com",

      // Embeds / iframes
      "frame-src 'self' " +
        "https://phaglp.foxycart.com " +
        "https://cdn.foxycart.com " +
        "https://vercel.live " +
        "https://www.youtube.com " +
        "https://www.youtube-nocookie.com " +
        "https://upload-widget.cloudinary.com " +
        "https://res.cloudinary.com " +
        "https://*.cloudinary.com",

      // Form submissions
      "form-action 'self' https://phaglp.foxycart.com",

      // Prevent plugin content
      "object-src 'none'",

      // Restrict <base> tag
      "base-uri 'self'",

      // Prevent clickjacking
      "frame-ancestors 'none'",

      // Upgrade HTTP → HTTPS
      "upgrade-insecure-requests",
    ]
      .join("; ")
      .trim();

    response.headers.set("Content-Security-Policy", csp);

    // Additional security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set(
      "Permissions-Policy",
      [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "payment=(self)",
        "usb=()",
        "accelerometer=()",
        "gyroscope=()",
        "magnetometer=()",
      ].join(", "),
    );

    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );

    return response;
  },
);

export const config = {
  matcher: [
    /*
     * Skip:
     * - API routes
     * - Next.js internals
     * - Static assets
     * - Images
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)",
  ],
};
