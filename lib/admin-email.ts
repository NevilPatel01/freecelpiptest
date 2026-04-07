/**
 * Admin allowlist (comma-separated).
 * For static / client bundles, use NEXT_PUBLIC_ADMIN_EMAIL so checks run in the browser.
 * ADMIN_EMAIL is still merged at build time for server components if needed.
 */
function parseAdminEmails(): string[] {
  const fromPublic =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(",")
      .map((e) => e.trim())
      .filter(Boolean) ?? []
  const fromPrivate =
    process.env.ADMIN_EMAIL?.split(",")
      .map((e) => e.trim())
      .filter(Boolean) ?? []
  return [...new Set([...fromPublic, ...fromPrivate])]
}

const ADMIN_EMAILS = parseAdminEmails()

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email)
}

export function adminEmailsConfigured(): boolean {
  return ADMIN_EMAILS.length > 0
}
