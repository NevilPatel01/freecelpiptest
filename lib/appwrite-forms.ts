"use client"

import { ID, Query } from "appwrite"
import { AppwriteException } from "appwrite"
import {
  getAppwriteDatabaseId,
  getDatabases,
  getFeedbackCollectionId,
  getNewsletterCollectionId,
  isAppwriteConfigured,
} from "@/lib/appwrite-client"

export function formsCollectionsReady(): boolean {
  return Boolean(
    isAppwriteConfigured() &&
      getAppwriteDatabaseId() &&
      getNewsletterCollectionId() &&
      getFeedbackCollectionId(),
  )
}

export async function subscribeNewsletterEmail(
  email: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const databaseId = getAppwriteDatabaseId()
  const collectionId = getNewsletterCollectionId()
  if (!databaseId || !collectionId) {
    return {
      ok: false,
      message: "Newsletter is not configured. Set Appwrite collection IDs in the environment.",
    }
  }
  try {
    const databases = getDatabases()
    await databases.createDocument(databaseId, collectionId, ID.unique(), {
      email: email.trim().toLowerCase(),
    })
    return { ok: true }
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 409) {
      return { ok: false, message: "You are already on the list." }
    }
    console.error("Newsletter Appwrite error:", e)
    return { ok: false, message: "Something went wrong. Please try again." }
  }
}

export async function submitFeedback(data: {
  name: string
  email: string
  message: string
  rating: number
  category: string
}): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const databaseId = getAppwriteDatabaseId()
  const collectionId = getFeedbackCollectionId()
  if (!databaseId || !collectionId) {
    return {
      ok: false,
      message: "Feedback is not configured. Set Appwrite collection IDs in the environment.",
    }
  }
  try {
    const databases = getDatabases()
    await databases.createDocument(databaseId, collectionId, ID.unique(), {
      name: data.name || null,
      email: data.email || null,
      message: data.message,
      rating: data.rating > 0 ? data.rating : null,
      category: data.category,
      status: "new",
    })
    return {
      ok: true,
      message: "Thank you for your feedback! We appreciate your input.",
    }
  } catch (e) {
    console.error("Feedback Appwrite error:", e)
    return { ok: false, message: "Something went wrong. Please try again." }
  }
}

export type NewsletterRow = {
  id: string
  email: string
  subscribedAt: string
}

export async function listNewsletterSubscribers(): Promise<NewsletterRow[]> {
  const databaseId = getAppwriteDatabaseId()
  const collectionId = getNewsletterCollectionId()
  if (!databaseId || !collectionId) return []
  const databases = getDatabases()
  const res = await databases.listDocuments(databaseId, collectionId, [
    Query.orderDesc("$createdAt"),
    Query.limit(500),
  ])
  return res.documents.map((d) => ({
    id: d.$id,
    email: String(d.email ?? ""),
    subscribedAt: String(d.$createdAt),
  }))
}

export type FeedbackRow = {
  id: string
  name: string | null
  email: string | null
  message: string
  rating: number | null
  category: string
  createdAt: string
  status: string
}

export async function listFeedback(): Promise<FeedbackRow[]> {
  const databaseId = getAppwriteDatabaseId()
  const collectionId = getFeedbackCollectionId()
  if (!databaseId || !collectionId) return []
  const databases = getDatabases()
  const res = await databases.listDocuments(databaseId, collectionId, [
    Query.orderDesc("$createdAt"),
    Query.limit(500),
  ])
  return res.documents.map((d) => ({
    id: d.$id,
    name: d.name != null ? String(d.name) : null,
    email: d.email != null ? String(d.email) : null,
    message: String(d.message ?? ""),
    rating: typeof d.rating === "number" ? d.rating : null,
    category: String(d.category ?? "general"),
    createdAt: d.$createdAt,
    status: String(d.status ?? "new"),
  }))
}

export async function updateFeedbackStatus(
  id: string,
  status: string,
): Promise<void> {
  const databaseId = getAppwriteDatabaseId()
  const collectionId = getFeedbackCollectionId()
  if (!databaseId || !collectionId) throw new Error("Missing collection config")
  const databases = getDatabases()
  await databases.updateDocument(databaseId, collectionId, id, { status })
}
