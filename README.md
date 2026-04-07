# FreeCELPIPTest Platform

FreeCELPIPTest is a CELPIP preparation site: **Next.js** (static export), **Appwrite Cloud** for auth/database/storage, and optional **DigitalOcean App Platform** to host the static `out/` build.

## Highlights

- Next.js App Router (TypeScript), static HTML export
- Appwrite Cloud: authentication (e.g. Google), databases, storage
- GitHub Actions: lint, typecheck, and optional static artifact builds
- Mobile-first UI

## Architecture (short)

Users load the app from DigitalOcean (or any static host). The browser talks to **Appwrite Cloud** APIs for sign-in, blog data, newsletter, feedback, and admin flows. There is no Node server required for the shipped site.

## Local development

**Prerequisites:** [Bun](https://bun.sh) 1.2+ (see `packageManager` in `package.json`), **Node.js 20+** (required to run `next build`; Bun installs deps and runs other scripts), and an Appwrite Cloud project.

```bash
bun install
cp .env.example .env.local
```

Fill `.env.local` using `.env.example` (Appwrite project + database IDs, `NEXT_PUBLIC_SITE_URL`, `APPWRITE_API_KEY`). Provision collections and the blog images bucket:

```bash
bun run setup:appwrite
```

Copy the printed collection and bucket IDs into `.env.local`, then:

```bash
bun run dev
```

Static production build locally:

```bash
bun run build
bun run preview:static
```

## Deploy (DigitalOcean App Platform)

1. Use the **`dev`** branch for builds and CI/CD (default in `.do/app.yaml`); keep **`main`** for the portfolio-facing default branch on GitHub if you prefer.
2. In DigitalOcean, create a **Static Site** from this repo, or use **`.do/app.yaml`** (edit `github.repo`, `branch`, `NEXT_PUBLIC_SITE_URL`).
3. Set **BUILD_TIME** environment variables to match `.env.example` (all `NEXT_PUBLIC_*` plus encrypted **`APPWRITE_API_KEY`**).
4. In **Appwrite Console** → Auth → Web platform, allow your live site URL; Google OAuth success redirect used by the app is **`{site}/dashboard`**.

Details and collection field hints: **`.env.example`**.

## Project structure

```
├── app/                 # Next.js App Router
├── components/          # UI
├── content/blog/        # Optional MDX (also used for static blog paths)
├── lib/appwrite/        # Appwrite helpers
├── .do/app.yaml         # DigitalOcean App Platform spec (template)
└── public/              # Static assets
```

## Disclaimer

This website is not affiliated with or endorsed by CELPIP. It is an independent study resource built for learners.

## Support

For questions or issues, please use the contact page or open an issue on GitHub.
