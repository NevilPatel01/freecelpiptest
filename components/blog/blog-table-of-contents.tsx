"use client"

import { useEffect, useState } from "react"
import { Hash } from "lucide-react"

interface TableOfContentsProps {
  content: string
}

export function BlogTableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from HTML content and add IDs
    const contentDiv = document.querySelector('.prose')
    if (!contentDiv) return

    const headingElements = contentDiv.querySelectorAll('h1, h2, h3')
    
    const extractedHeadings: { id: string; text: string; level: number }[] = []
    headingElements.forEach((heading, index) => {
      const text = heading.textContent || ''
      const id = heading.id || `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`
      
      if (!heading.id) {
        heading.id = id
      }
      
      extractedHeadings.push({
        id,
        text,
        level: parseInt(heading.tagName.charAt(1))
      })
    })
    
    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        if (element && element.offsetTop <= window.scrollY + 100) {
          setActiveId(element.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block w-64 border-r border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Hash className="h-3.5 w-3.5" />
          Table of Contents
        </h3>
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${
                  heading.level === 1 ? 'pl-2 font-medium' : heading.level === 2 ? 'pl-4' : 'pl-6 text-xs'
                } ${
                  activeId === heading.id
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

