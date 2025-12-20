"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin } from "lucide-react"

interface ShareButtonsProps {
  title: string
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = title

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
    <div className="flex items-center gap-2">
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
  )
}

