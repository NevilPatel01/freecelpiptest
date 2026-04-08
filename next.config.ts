import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  // DigitalOcean (and many static hosts) serve /path as path/index.html, not path.html
  trailingSlash: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  env: {
    APPLICATIONINSIGHTS_CONNECTION_STRING:
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "",
  },
}

export default nextConfig
