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

  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "isomorphic-dompurify",
    "jsdom",
  ],

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

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    loader: 'custom',
    loaderFile: './src/utils/cloudinary-loader.ts', // Points to a file returning the Cloudinary fetch string
    unoptimized: true,
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
