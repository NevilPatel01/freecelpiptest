import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero-section"
import { ValueProposition } from "@/components/sections/value-proposition"
import { FeaturedBlog } from "@/components/sections/featured-blog"
import { AboutContent } from "@/components/sections/about-content"
import { OrganizationSchema } from "@/components/seo/organization-schema"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

// Lazy load FeaturedBlog to reduce initial bundle
const FeaturedBlogLazy = dynamic(() => import("@/components/sections/featured-blog").then(mod => ({ default: mod.FeaturedBlog })), {
  loading: () => <div className="section-padding"><div className="container mx-auto container-padding"><div className="h-64" /></div></div>,
  ssr: true
})

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <div className="flex flex-col">
        <HeroSection />
        <ValueProposition />
        <AboutContent />
        <FeaturedBlogLazy />
      </div>
    </>
  )
}

