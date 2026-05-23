import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // Prevents Next.js from bundling native Prisma binaries into client-side chunks
  serverExternalPackages: ["@prisma/client", "prisma"],

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  webpack: (config) => {
    // Streamlined suppression of dynamic Jose compression warnings in build logs
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/jose/ },
      { message: /CompressionStream/ },
      { message: /DecompressionStream/ },
    ]
    return config
  },

  experimental: {
    // Next.js 15 auto-optimizes Radix, Lucide, and Framer Motion. 
    // We only keep large data visualization libraries that benefit from explicit tuning.
    optimizePackageImports: ["recharts", "@tiptap/core"],
  },
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig)
