"use client"

import { ID, Query } from "appwrite"
import { getBrowserDatabases } from "./browser"
import { getAppwriteCollectionIds } from "./env"

export async function submitNewsletterEmail(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return { ok: false, message: "Email is required" }

  const { databases, databaseId } = getBrowserDatabases()
  const { newsletter } = getAppwriteCollectionIds()
  if (!newsletter) return { ok: false, message: "Newsletter is not configured" }

  try {
    const existing = await databases.listDocuments(databaseId, newsletter, [
      Query.equal("email", normalized),
      Query.limit(1),
    ])
    if (existing.documents.length > 0) {
      const doc = existing.documents[0] as unknown as Record<string, unknown>
      if (doc.active === false) {
        await databases.updateDocument(databaseId, newsletter, existing.documents[0].$id, {
          active: true,
        })
        return { ok: true }
      }
      return { ok: false, message: "Email already subscribed" }
    }

    await databases.createDocument(databaseId, newsletter, ID.unique(), {
      email: normalized,
      active: true,
    })
    return { ok: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Something went wrong"
    return { ok: false, message: msg }
  }
}

export async function submitFeedback(payload: {
  name?: string
  email?: string
  message: string
  rating?: number | null
  category?: string
}): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const message = payload.message?.trim()
  if (!message) return { ok: false, message: "Message is required" }

  const { databases, databaseId } = getBrowserDatabases()
  const { feedback } = getAppwriteCollectionIds()
  if (!feedback) return { ok: false, message: "Feedback is not configured" }

  try {
    await databases.createDocument(databaseId, feedback, ID.unique(), {
      name: payload.name?.trim() || "",
      email: payload.email?.trim() || "",
      message,
      rating: payload.rating ?? null,
      category: payload.category || "general",
      status: "new",
    })
    return { ok: true, message: "Thank you for your feedback! We appreciate your input." }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to submit feedback"
    return { ok: false, message: msg }
  }
}

export async function adminListNewsletter() {
  const { databases, databaseId } = getBrowserDatabases()
  const { newsletter } = getAppwriteCollectionIds()
  const res = await databases.listDocuments(databaseId, newsletter, [
    Query.orderDesc("$createdAt"),
    Query.limit(5000),
  ])
  return res.documents.map((d) => ({
    id: d.$id,
    email: String((d as unknown as Record<string, unknown>).email ?? ""),
    subscribedAt: String(d.$createdAt),
  }))
}

export async function adminListFeedback() {
  const { databases, databaseId } = getBrowserDatabases()
  const { feedback } = getAppwriteCollectionIds()
  const res = await databases.listDocuments(databaseId, feedback, [
    Query.orderDesc("$createdAt"),
    Query.limit(5000),
  ])
  return res.documents.map((d) => {
    const x = d as unknown as Record<string, unknown>
    return {
      id: d.$id,
      name: x.name ? String(x.name) : null,
      email: x.email ? String(x.email) : null,
      message: String(x.message ?? ""),
      rating: typeof x.rating === "number" ? x.rating : x.rating ? Number(x.rating) : null,
      category: String(x.category ?? "general"),
      createdAt: String(x.createdAt ?? d.$createdAt),
      status: String(x.status ?? "new"),
    }
  })
}

export async function adminUpdateFeedbackStatus(id: string, status: string) {
  const { databases, databaseId } = getBrowserDatabases()
  const { feedback } = getAppwriteCollectionIds()
  await databases.updateDocument(databaseId, feedback, id, { status })
}
