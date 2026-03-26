/**
 * Appwrite configuration from environment.
 * Server key is only for CI/build (blog static generation, sitemap); never expose to the browser.
 */

export function getAppwritePublicConfig() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? ""
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? ""
  return { endpoint, projectId, databaseId }
}

export function getAppwriteCollectionIds() {
  return {
    blogPosts: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_POSTS ?? "",
    newsletter: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NEWSLETTER ?? "",
    feedback: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_FEEDBACK ?? "",
  }
}

export function getAppwriteStorageIds() {
  return {
    blogImages: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_BLOG_IMAGES ?? "",
  }
}

export function hasAppwriteBuildCredentials(): boolean {
  return Boolean(
    process.env.APPWRITE_API_KEY &&
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID &&
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_POSTS
  )
}

export function getAdminTeamId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID?.trim()
  return id || undefined
}

/** Client-side admin gate (static export); use NEXT_PUBLIC_ADMIN_EMAIL comma-separated. */
export function getAdminEmailAllowlist(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ""
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}
