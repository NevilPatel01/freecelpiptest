import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  env: {
    APPLICATIONINSIGHTS_CONNECTION_STRING:
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || '',
  },
}

export default nextConfig
