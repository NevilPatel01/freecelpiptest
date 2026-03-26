"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { Home, Mail, MessageSquare, LogOut, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppwriteAuth } from "@/components/providers/appwrite-auth-provider"
import { userHasAdminAccess } from "@/lib/appwrite/admin-access"

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, signInWithGoogle, signOut, refreshUser } = useAppwriteAuth()
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      setAllowed(false)
      return
    }
    void userHasAdminAccess(user).then(setAllowed)
  }, [user, loading])

  useEffect(() => {
    if (loading || allowed === null) return
    if (!user) return
    if (!allowed) {
      router.replace("/?error=unauthorized")
    }
  }, [allowed, user, loading, router])

  if (loading || (user && allowed === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-muted-foreground">Sign in to access the admin portal.</p>
        <Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
        <Button variant="ghost" asChild>
          <Link href="/">Back to site</Link>
        </Button>
      </div>
    )
  }

  if (!allowed) {
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
                  void signOut().then(() => refreshUser())
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
              Blog Posts
            </Link>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
