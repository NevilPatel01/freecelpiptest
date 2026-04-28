"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Tag, X } from "lucide-react"
import { BlogCard } from "./blog-card"
import type { BlogPost } from "@/lib/blog"

interface BlogListingProps {
  posts: BlogPost[]
}

const categories = [
  "All",
  "Listening Tips",
  "Reading Tips",
  "Writing Tips",
  "Speaking Tips",
  "Test Strategy",
  "Success Stories",
]

export function BlogListing({ posts }: BlogListingProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Deep links for search engines / JSON-LD SearchAction: /blog?q=...
  useEffect(() => {
    const raw = searchParams.get("q") ?? searchParams.get("search") ?? ""
    const trimmed = raw.trim()
    if (!trimmed) return
    try {
      setSearchQuery(decodeURIComponent(trimmed))
    } catch {
      setSearchQuery(trimmed)
    }
  }, [searchParams])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesTags
    })
  }, [posts, searchQuery, selectedCategory, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <div className="mb-10">
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Study Tips & Blog</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Expert strategies and proven techniques to help you succeed on your CELPIP test.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tag Filter */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Filtered by:</span>
            {selectedTags.map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                onClick={() => toggleTag(tag)}
                className="gap-2"
              >
                {tag}
                <X className="h-3 w-3" />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Available Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium self-center">Tags:</span>
          {allTags.slice(0, 10).map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} articles
        </p>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

