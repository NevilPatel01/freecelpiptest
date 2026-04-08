"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLayoutEffect, type ReactNode } from "react"
import { Home, Mail, MessageSquare, LogOut, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppwriteAuth } from "@/components/providers/appwrite-auth-provider"
import { adminEmailsConfigured } from "@/lib/admin-email"

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, status, isAdmin, signInGoogle, signOut } = useAppwriteAuth()
  const router = useRouter()
  const loading = status === "loading"

  /** Run before paint to avoid flashing admin chrome for non-admins. Real enforcement is Appwrite collection permissions. */
  useLayoutEffect(() => {
    if (loading || !user) return
    if (!adminEmailsConfigured()) {
      router.replace("/?error=configuration")
      return
    }
    if (!isAdmin) {
      router.replace("/?error=unauthorized")
    }
  }, [user, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!adminEmailsConfigured()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-muted-foreground max-w-md">
          Admin email allowlist is not configured. Set{" "}
          <code className="rounded bg-muted px-1 text-xs">NEXT_PUBLIC_ADMIN_EMAIL</code> (or{" "}
          <code className="rounded bg-muted px-1 text-xs">ADMIN_EMAIL</code>) in the environment.
        </p>
        <Button variant="ghost" asChild>
          <Link href="/">Back to site</Link>
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-muted-foreground">Sign in to access the admin portal.</p>
        <Button type="button" onClick={() => signInGoogle("/admin")}>
          Sign in with Google
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Back to site</Link>
        </Button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Portal</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Site
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  void signOut()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <aside className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-lg px-4 py-3 hover:bg-accent"
            >
              <Mail className="h-4 w-4" />
              Newsletter Subscribers
            </Link>
            <Link
              href="/admin/feedback"
              className="flex items-center gap-2 rounded-lg px-4 py-3 hover:bg-accent"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-2 rounded-lg px-4 py-3 hover:bg-accent"
            >
              <FileText className="h-4 w-4" />
              Blog content
            </Link>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
