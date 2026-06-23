/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },

  // ✅ Move this back inside experimental to clear the Next.js 15 warning
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
      "lodash",
      "clsx",
      "tailwind-merge",
      "@vercel/analytics/next",
    ],
  },

  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "isomorphic-dompurify",
    "jsdom",
  ],

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    loader: 'custom',
    loaderFile: './src/utils/cloudinary-loader.ts',
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'https://cloudinary.com',
        pathname: "/**",
      },
    ],
  },
  // ... keep your webpack config below
};

export default nextConfig;
