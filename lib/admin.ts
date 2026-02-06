import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

// Admin emails are loaded from environment variable for security
// Set ADMIN_EMAIL in .env (local) or Azure Key Vault (production)
// For multiple admins, separate emails with commas: "admin1@gmail.com,admin2@gmail.com"
const ADMIN_EMAILS = process.env.ADMIN_EMAIL
  ? process.env.ADMIN_EMAIL.split(",").map((email) => email.trim())
  : []

export async function requireAdmin() {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
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
