import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero-section"
import { ValueProposition } from "@/components/sections/value-proposition"
import { AboutContent } from "@/components/sections/about-content"
import { OrganizationSchema } from "@/components/seo/organization-schema"
import { FeaturedBlog } from "@/components/sections/featured-blog"
import { getAllBlogPosts } from "@/lib/blog"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

// Avoid DB at build time (build workers often cannot reach the database)
export const dynamic = "force-dynamic"

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getAllBlogPosts>> = []
  try {
    posts = await getAllBlogPosts()
  } catch {
    // DB unreachable at build; homepage still renders, FeaturedBlog gets empty list
  }
  return (
    <>
      <OrganizationSchema />
      <div className="flex flex-col">
        <HeroSection />
        <ValueProposition />
        <AboutContent />
        <FeaturedBlog posts={posts} />
      </div>
    </>
  )
}

