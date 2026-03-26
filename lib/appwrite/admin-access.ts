"use client"

import type { Models } from "appwrite"
import { getAdminEmailAllowlist, getAdminTeamId } from "./env"
import { getTeams } from "./browser"

export async function userHasAdminAccess(user: Models.User | null): Promise<boolean> {
  if (!user?.email) return false

  const emails = getAdminEmailAllowlist()
  if (emails.length && emails.includes(user.email.toLowerCase())) {
    return true
  }

  const teamId = getAdminTeamId()
  if (teamId) {
    try {
      const teams = getTeams()
      const list = await teams.list({})
      const ok = list.teams.some((t) => t.$id === teamId)
      if (ok) return true
    } catch {
      /* not in team or error */
    }
  }

  return false
}
