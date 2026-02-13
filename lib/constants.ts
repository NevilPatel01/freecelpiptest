/**
 * Application constants. Do not put secrets or environment-specific
 * secrets here — use .env and document in APP_PLATFORM_ENV.md.
 */

/** App display name (branding, SEO, emails) */
export const APP_NAME = "FreeCELPIPTest"

/** Default author name for blog posts when not set per-post */
export const DEFAULT_AUTHOR = "FreeCELPIPTest"

/**
 * Fallback site URL when NEXT_PUBLIC_SITE_URL is not set (e.g. local dev).
 * Production must set NEXT_PUBLIC_SITE_URL in the environment.
 */
export const DEFAULT_SITE_URL = "https://freecelpiptest.com"

/** Admin area path (for redirects; build full URL from request when needed) */
export const ADMIN_PATH = "/admin"

/**
 * Canonical site URL. Prefer NEXT_PUBLIC_SITE_URL in production.
 * Safe to use in server and client components.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
}

/**
 * Contact email shown on contact page. Set NEXT_PUBLIC_CONTACT_EMAIL in .env
 * or it is derived from the site URL host (e.g. contact@yourdomain.com).
 */
export function getContactEmail(): string {
  if (process.env.NEXT_PUBLIC_CONTACT_EMAIL) {
    return process.env.NEXT_PUBLIC_CONTACT_EMAIL
  }
  try {
    const host = new URL(getSiteUrl()).hostname
    return host ? `contact@${host}` : "contact@example.com"
  } catch {
    return "contact@example.com"
  }
}
