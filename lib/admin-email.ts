const ADMIN_EMAILS = process.env.ADMIN_EMAIL
  ? process.env.ADMIN_EMAIL.split(",").map((email) => email.trim()).filter(Boolean)
  : []

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email)
}

export function adminEmailsConfigured(): boolean {
  return ADMIN_EMAILS.length > 0
}
