import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  // `false` emits `out/blog.html` so `/blog` works on DigitalOcean App Platform static sites.
  // `true` emits `out/blog/index.html` (only reliably served at `/blog/`), which often 404s when users hit `/blog` without the trailing slash.
  trailingSlash: false,

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
