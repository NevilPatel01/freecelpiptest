import { notFound } from "next/navigation"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog"
import { BlogPostView } from "@/components/blog/blog-post-view"
import { getSiteUrl, DEFAULT_AUTHOR, APP_NAME } from "@/lib/constants"
import fs from "fs"
import path from "path"

export const dynamic = "force-static"
export const dynamicParams = false

function slugsFromContentDir(): string[] {
  const dir = path.join(process.cwd(), "content/blog")
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(mdx|md)$/i.test(f) && !f.toLowerCase().includes("readme"))
    .map((f) => f.replace(/\.(mdx|md)$/i, ""))
}

function slugsFromExportFile(): string[] {
  const file = path.join(process.cwd(), "content/.blog-slugs-export.json")
  if (!fs.existsSync(file)) return []
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"))
    return Array.isArray(raw) ? raw.filter((s) => typeof s === "string") : []
  } catch {
    return []
  }
}

export function generateStaticParams() {
  const slugSet = new Set([...slugsFromContentDir(), ...slugsFromExportFile()])
  return [...slugSet].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const keywords = post.keywords || post.tags || []
  const siteUrl = getSiteUrl()
  const coverImage = post.coverImage || post.featuredImage || `${siteUrl}/images/blog/default-cover.jpg`

  return {
    title: `${post.title} | ${APP_NAME} Blog`,
    description: post.excerpt,
    keywords: keywords.join(', '),
    authors: [{ name: post.author || DEFAULT_AUTHOR }], // post.author from DB or constant
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || DEFAULT_AUTHOR],
      tags: keywords,
      images: [
        {
          url: coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: APP_NAME,
      url: `${siteUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3)

  return <BlogPostView post={post} relatedPosts={relatedPosts} />
}

