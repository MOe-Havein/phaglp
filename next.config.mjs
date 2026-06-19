/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // ✅ Next.js 14+: Moved to the root configuration level
  optimizePackageImports: [
    "lucide-react",
    "@radix-ui/react-icons",
    "date-fns",
    "lodash",
    "clsx",
    "tailwind-merge",
    "@vercel/analytics/next",
  ],

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
    loaderFile: './src/utils/cloudinary-loader.ts', // ✅ This will now run perfectly!
    
    // ❌ REMOVED: unoptimized: true (Removing this lets your loader actually optimize images)
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: "/**",
      },
    ],
  },

  webpack(config, { isServer }) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/jose/ },
      { message: /CompressionStream/ },
      { message: /DecompressionStream/ },
    ];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    return config;
  },
};

export default nextConfig;
