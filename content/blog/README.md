# Blog Content Guide

This directory contains blog posts in either `.md` (Markdown) or `.mdx` (MDX) format.

## File Format

Each blog post should be named using kebab-case (e.g., `my-awesome-post.mdx`).

## Frontmatter

All blog posts must include frontmatter at the top of the file with the following fields:

```yaml
---
title: "Your Blog Post Title"
excerpt: "A brief description of your blog post (150-160 characters for SEO)"
category: "Listening Tips" | "Reading Tips" | "Writing Tips" | "Speaking Tips" | "Test Strategy" | "Success Stories"
tags: ["tag1", "tag2", "tag3"]
publishedAt: "2024-01-15"
coverImage: "/images/blog/your-image.jpg"  # Optional but recommended
keywords: ["keyword1", "keyword2"]  # Optional - will use tags if not provided
author: "Author Name"  # Optional - defaults to "FreeCELPIPTest"
updatedAt: "2024-01-20"  # Optional - for updated posts
---
```

## Required Fields

- `title`: The blog post title
- `excerpt`: Brief description (used for SEO meta description)
- `category`: One of the predefined categories
- `tags`: Array of relevant tags
- `publishedAt`: Publication date in ISO format (YYYY-MM-DD)

## Optional Fields

- `coverImage`: Path to cover image (recommended for SEO and social sharing)
- `keywords`: SEO keywords (if not provided, tags will be used)
- `author`: Author name (defaults to "FreeCELPIPTest")
- `updatedAt`: Last update date (for updated posts)

## Content

After the frontmatter, write your content using Markdown or MDX syntax.

### MDX Features

MDX files support:
- Standard Markdown syntax
- React components
- JSX syntax

### Example

```mdx
---
title: "Top 10 CELPIP Listening Tips"
excerpt: "Master the listening section with these proven strategies."
category: "Listening Tips"
tags: ["listening", "tips", "strategy"]
publishedAt: "2024-01-15"
coverImage: "/images/blog/listening-tips.jpg"
keywords: ["CELPIP listening", "listening tips", "CELPIP preparation"]
author: "FreeCELPIPTest"
---

# Top 10 CELPIP Listening Tips

The CELPIP Listening test can be challenging, but with the right strategies...

## 1. Familiarize Yourself with Canadian Accents

The CELPIP test uses Canadian English accents...
```

## Image Guidelines

- Store images in `/public/images/blog/`
- Recommended cover image size: 1200x630px (for social sharing)
- Use descriptive filenames (e.g., `celpip-listening-tips.jpg`)
- Optimize images before uploading

## SEO Best Practices

1. **Title**: Keep it under 60 characters
2. **Excerpt**: 150-160 characters for optimal meta description
3. **Keywords**: Include 5-10 relevant keywords
4. **Cover Image**: Always include a cover image for social sharing
5. **Content**: Use proper heading hierarchy (H1, H2, H3)
6. **Internal Links**: Link to other blog posts and pages
7. **Tags**: Use 3-5 relevant tags

## Categories

Available categories:
- Listening Tips
- Reading Tips
- Writing Tips
- Speaking Tips
- Test Strategy
- Success Stories

## File Naming

- Use kebab-case: `my-awesome-post.mdx`
- Be descriptive: `top-10-celpip-listening-tips.mdx`
- Match the slug to the filename

