"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Share2, ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogPostStructuredData } from "./structured-data"
import { BlogCard } from "./blog-card"
import { BlogTableOfContents } from "./blog-table-of-contents"
import { BlogSidebar } from "./blog-sidebar"
import type { BlogPost } from "@/lib/blog"

interface BlogPostViewProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogPostView({ post, relatedPosts }: BlogPostViewProps) {

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = post.title

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  return (
    <>
      <BlogPostStructuredData post={post} />
      <div className="flex min-h-screen bg-background">
        {/* Left Sidebar - Table of Contents */}
        <BlogTableOfContents content={post.content} />
        
        {/* Main Content */}
        <article className="flex-1 container mx-auto container-padding py-10 md:py-14 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 whitespace-nowrap" size="sm">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
              <span>Back to Blog</span>
            </Link>
          </Button>

          {/* Cover Image */}
          {(post.coverImage || post.featuredImage) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-64 md:h-96 mb-10 rounded-2xl overflow-hidden bg-muted"
            >
              <img
                src={post.coverImage || post.featuredImage}
                alt={`${post.title} - Cover image`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none'
                }}
              />
            </motion.div>
          )}

          <header
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold gradient-primary text-white mb-5 shadow-sm">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-gradient-primary">{post.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
            
            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-border/50">
              {/* Author Section */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                  {post.author ? post.author.charAt(0).toUpperCase() : 'F'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground leading-tight">{post.author || 'FreeCELPIPTest'}</div>
                  <div className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-border/60 hidden sm:block" />

              {/* Reading Time */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{post.readingTime} min read</span>
              </div>

              {/* Share Section */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Share</span>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("twitter")}
                    aria-label="Share on Twitter"
                    className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    aria-label="Share on Facebook"
                    className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare("linkedin")}
                    aria-label="Share on LinkedIn"
                    className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12
              prose-headings:font-bold prose-headings:text-foreground 
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:scroll-mt-20 prose-h1:leading-tight
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:scroll-mt-20 prose-h2:leading-tight
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:scroll-mt-20 prose-h3:leading-tight
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
              prose-li:mb-2 prose-li:text-foreground/90 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:my-6
              prose-code:text-primary prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
              prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:border prose-img:border-border
              prose-hr:border-border prose-hr:my-8
              prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-table:shadow-sm prose-table:rounded-lg prose-table:overflow-hidden prose-table:border prose-table:border-border
              prose-th:border prose-th:border-border prose-th:bg-muted/80 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:text-sm prose-th:first:rounded-tl-lg prose-th:last:rounded-tr-lg
              prose-td:border prose-td:border-border prose-td:p-4 prose-td:text-foreground/90 prose-td:text-sm prose-td:align-top
              prose-tr:border-b prose-tr:border-border prose-tr:last:border-b-0 prose-tr:hover:bg-muted/30 prose-tr:transition-colors
              prose-thead:bg-muted/50 prose-tbody:bg-background"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-12 pt-8 border-t border-border/50">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Tagged:</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Button key={tag} variant="outline" size="sm" className="h-8 text-xs px-3 rounded-full" asChild>
                      <Link href={`/blog?tag=${tag}`} className="hover:text-primary">{tag}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t">
              <h2 className="heading-3 mb-8 text-gradient-primary">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((relatedPost) => (
                  <motion.div
                    key={relatedPost.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <BlogCard post={relatedPost} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Right Sidebar - Tools */}
        <BlogSidebar />
      </div>
    </>
  )
}

