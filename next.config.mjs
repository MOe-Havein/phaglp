/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  poweredByHeader: false,

  // Prevent native/server-only packages from leaking into client bundles
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "isomorphic-dompurify",
    "jsdom",
  ],

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
    formats: ["image/avif", "image/webp"],
  },

  webpack: (config, { isServer }) => {
    // Suppress jose/browser compression warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/jose/ },
      { message: /CompressionStream/ },
      { message: /DecompressionStream/ },
    ];

    // Reduce Prisma bundle size on client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

export default nextConfig;
