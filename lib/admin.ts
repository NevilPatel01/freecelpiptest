import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { adminEmailsConfigured, isAdminEmail } from "@/lib/admin-email"

export function isAdmin(email: string | null | undefined): boolean {
  return isAdminEmail(email)
}

export async function requireAdmin() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin")
  }

  if (!adminEmailsConfigured()) {
    console.error("ADMIN_EMAIL environment variable is not set!")
    redirect("/?error=configuration")
  }

  if (!session.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/?error=unauthorized")
  }

  return session
}
