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
import { getAccount } from "@/lib/appwrite/browser"
import { getSiteUrl } from "@/lib/constants"

type AuthState = {
  user: Models.User | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AppwriteAuthContext = createContext<AuthState | null>(null)

export function AppwriteAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const account = getAccount()
      const u = await account.get()
      setUser(u)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const signInWithGoogle = useCallback(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : getSiteUrl()
    const account = getAccount()
    account.createOAuth2Session(OAuthProvider.Google, `${origin}/dashboard`, origin)
  }, [])

  const signOut = useCallback(async () => {
    try {
      const account = getAccount()
      await account.deleteSession("current")
    } catch {
      /* session may already be gone */
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signOut,
      refreshUser,
    }),
    [user, loading, signInWithGoogle, signOut, refreshUser]
  )

  return (
    <AppwriteAuthContext.Provider value={value}>{children}</AppwriteAuthContext.Provider>
  )
}

export function useAppwriteAuth() {
  const ctx = useContext(AppwriteAuthContext)
  if (!ctx) {
    throw new Error("useAppwriteAuth must be used within AppwriteAuthProvider")
  }
  return ctx
}
