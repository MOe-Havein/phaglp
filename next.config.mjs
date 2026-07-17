/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
      "clsx",
      "tailwind-merge",
      "@vercel/analytics/next",
    ],
  },

  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "isomorphic-dompurify",
    "@prisma/adapter-libsql",
    "@libsql/client",
    "@libsql/win32-x64-msvc",
    "libsql",
    "@libsql/hrana-client",
    "@libsql/isomorphic-ws",
    "jsdom",
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        path: false,
        os: false,
      };
    }

    config.module.rules.push({
      test: /\.(md|txt|LICENSE)$/,
      type: "asset/resource",
    });

    return config;
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    loader: "custom",
    loaderFile: "./src/utils/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
