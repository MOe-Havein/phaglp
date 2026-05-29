import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // Prevents Next.js from bundling native Prisma binaries into client-side chunks
  serverExternalPackages: ["@prisma/client", "prisma", "isomorphic-dompurify", "jsdom"],

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

  experimental: {
    optimizePackageImports: ["@tiptap/core", "framer-motion", "lucide-react"],
  },
}

if (!process.env.TURBOPACK) {
  nextConfig.webpack = (config) => {
    // Suppress dynamic Jose compression warnings for standard Webpack builds
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/jose/ },
      { message: /CompressionStream/ },
      { message: /DecompressionStream/ },
    ]
    return config
  }
}

const configWithAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig)

export default configWithAnalyzer
