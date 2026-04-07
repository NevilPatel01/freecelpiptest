"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Models } from "appwrite"
import { OAuthProvider } from "appwrite"
import { getAccount, isAppwriteConfigured } from "@/lib/appwrite-client"
import { getSiteUrl } from "@/lib/constants"
import { isAdminEmail } from "@/lib/admin-email"

export type AppwriteUser = Pick<
  Models.User<Models.Preferences>,
  "$id" | "name" | "email" | "prefs"
>

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AppwriteAuthContextValue = {
  user: AppwriteUser | null
  status: AuthStatus
  isAdmin: boolean
  signInGoogle: (callbackPath?: string) => void
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AppwriteAuthContext = createContext<AppwriteAuthContextValue | null>(null)

export function AppwriteAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  const refresh = useCallback(async () => {
    if (!isAppwriteConfigured()) {
      setUser(null)
      setStatus("unauthenticated")
      return
    }
    try {
      const account = getAccount()
      const u = await account.get()
      setUser({
        $id: u.$id,
        name: u.name,
        email: u.email,
        prefs: u.prefs,
      })
      setStatus("authenticated")
    } catch {
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signInGoogle = useCallback((callbackPath = "/dashboard") => {
    if (!isAppwriteConfigured()) {
      console.warn("Appwrite is not configured; cannot sign in.")
      return
    }
    const base = getSiteUrl().replace(/\/$/, "")
    const successUrl = `${base}${callbackPath.startsWith("/") ? callbackPath : `/${callbackPath}`}`
    const failUrl = `${base}/`
    const account = getAccount()
    account.createOAuth2Session(OAuthProvider.Google, successUrl, failUrl)
  }, [])

  const signOut = useCallback(async () => {
    if (!isAppwriteConfigured()) return
    try {
      const account = getAccount()
      await account.deleteSession("current")
    } catch {
      /* session may already be gone */
    }
    setUser(null)
    setStatus("unauthenticated")
  }, [])

  const isAdmin = Boolean(user?.email && isAdminEmail(user.email))

  const value = useMemo(
    () => ({
      user,
      status,
      isAdmin,
      signInGoogle,
      signOut,
      refresh,
    }),
    [user, status, isAdmin, signInGoogle, signOut, refresh],
  )

  return (
    <AppwriteAuthContext.Provider value={value}>
      {children}
    </AppwriteAuthContext.Provider>
  )
}

export function useAppwriteAuth(): AppwriteAuthContextValue {
  const ctx = useContext(AppwriteAuthContext)
  if (!ctx) {
    throw new Error("useAppwriteAuth must be used within AppwriteAuthProvider")
  }
  return ctx
}
