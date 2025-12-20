"use client"

import Link from "next/link"
import { Clock, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlogPost } from "@/lib/blog"

interface BlogCardProps {
  post: BlogPost
  priority?: boolean
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const imageUrl = post.coverImage || post.featuredImage
  
  return (
    <Card className="card-hover h-full flex flex-col card-elevated overflow-hidden group border-border/50">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
            <div className="text-muted-foreground text-sm opacity-50">No image</div>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-block px-3 py-1.5 rounded-md text-xs font-semibold bg-primary/90 backdrop-blur-sm text-white shadow-md">
            {post.category}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3 flex-1 px-5 pt-5">
        <CardTitle className="text-base font-semibold mb-2.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 px-5 pb-5 space-y-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 opacity-70" />
            <span>{post.readingTime} min</span>
          </div>
          <span className="opacity-50">•</span>
          <div className="flex items-center gap-1.5">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-muted/80 text-muted-foreground border border-border/50"
              >
                <Tag className="h-3 w-3 opacity-60" />
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-muted-foreground opacity-70 self-center">+{post.tags.length - 2}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

