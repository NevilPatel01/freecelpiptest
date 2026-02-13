import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

// Admin emails are loaded from environment variable for security
// Set ADMIN_EMAIL in .env (local) or Azure Key Vault (production)
// For multiple admins, separate emails with commas: "admin1@gmail.com,admin2@gmail.com"
const ADMIN_EMAILS = process.env.ADMIN_EMAIL
  ? process.env.ADMIN_EMAIL.split(",").map((email) => email.trim())
  : []

async function getAdminCallbackUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
  const proto = headersList.get("x-forwarded-proto") === "https" ? "https" : "http"
  const base = host ? `${proto}://${host}` : ""
  return base ? `${base}/admin` : "/admin"
}

export async function requireAdmin() {
    const session = await auth()

    if (!session) {
        const callbackUrl = await getAdminCallbackUrl()
        redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }

    if (!ADMIN_EMAILS.length) {
        console.error("ADMIN_EMAIL environment variable is not set!")
        redirect("/?error=configuration")
    }

    if (!session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
        redirect("/?error=unauthorized")
    }

    return session
}

export function isAdmin(email: string | null | undefined): boolean {
    return email ? ADMIN_EMAILS.includes(email) : false
}
