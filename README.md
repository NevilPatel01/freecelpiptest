# FreeCELPIPTest Platform

A comprehensive Next.js 15 website for free CELPIP test preparation with neomorphic design, Google OAuth authentication, and markdown-based blog system.

## Features

- 🎨 **Neomorphic Design** - Modern, soft UI with embossed shadows and gradients
- 🌙 **Dark Mode** - Full dark mode support with theme persistence
- 📱 **Responsive** - Mobile-first design, fully responsive across all devices
- 🚀 **Next.js 15** - Built with App Router, TypeScript, and latest features
- 🔐 **Google OAuth** - Secure authentication with NextAuth.js
- 📝 **Markdown Blog** - Easy-to-manage blog system with markdown files
- 🎯 **Practice Tests** - Mock interfaces for all 4 CELPIP sections
- ♿ **Accessible** - WCAG 2.1 AA compliant with proper ARIA labels
- 🔍 **SEO Optimized** - Meta tags, Open Graph, structured data, sitemap
- ⚡ **Performance** - Optimized images, lazy loading, code splitting

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neomorphic utilities
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth)
- **Content**: Markdown files with remark

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Supabase/Neon for easy setup)
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FreeCelpipTest
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for local)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
FreeCelpipTest/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Header, Footer, Navigation
│   ├── sections/         # Page sections
│   ├── blog/             # Blog components
│   └── practice/         # Practice test components
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── blog.ts           # Blog utilities
├── content/              # Markdown blog posts
│   └── blog/
├── prisma/               # Prisma schema
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database Setup

For production, use a managed PostgreSQL service:
- **Supabase** (Free tier available)
- **Neon** (Serverless PostgreSQL)
- **Railway** (Easy setup)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Features in Detail

### Pages

- **Home** - Hero section, value propositions, featured blog, testimonials
- **Practice Tests** - Landing page and individual section pages
- **Mock Tests** - Full-length test simulation
- **Blog** - Markdown-based blog with search and filters
- **Getting Started** - Step-by-step guide for new users
- **About CELPIP** - Test format, scoring, test day tips
- **Resources** - Downloadable guides and study materials
- **Testimonials** - Success stories from students
- **Contact** - Contact form and FAQ

### Authentication

- Google OAuth only (no email/password)
- User dashboard with saved articles and preferences
- Session management with NextAuth.js

### Blog System

- Markdown files in `/content/blog/`
- Automatic reading time calculation
- Category and tag filtering
- Search functionality
- Related articles
- Social sharing

## Customization

### Adding Blog Posts

Create a new markdown file in `content/blog/`:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description"
category: "Category Name"
tags: ["tag1", "tag2"]
publishedAt: "2024-01-01"
featuredImage: "/images/blog/image.jpg"
---

Your content here...
```

### Neomorphic Design

Custom utilities are defined in `app/globals.css`:
- `neu-flat` - Flat neomorphic shadow
- `neu-pressed` - Pressed/inset shadow
- `neu-raised` - Raised/embossed shadow
- `neu-glow` - Hover glow effect

## License

This project is open source and available for use.

## Disclaimer

This website is NOT affiliated with or endorsed by CELPIP. We are an independent study resource providing free practice materials.

## Support

For questions or issues, please contact us through the contact page or open an issue on GitHub.

