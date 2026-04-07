"use client"

import { Account, Client, Databases } from "appwrite"

let client: Client | null = null

export function isAppwriteConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  )
}

export function getAppwriteClient(): Client {
  if (typeof window === "undefined") {
    throw new Error("Appwrite client is only available in the browser")
  }
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  if (!endpoint || !projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID",
    )
  }
  if (!client) {
    client = new Client().setEndpoint(endpoint).setProject(projectId)
  }
  return client
}

export function getAccount() {
  return new Account(getAppwriteClient())
}

export function getDatabases() {
  return new Databases(getAppwriteClient())
}

export function getAppwriteDatabaseId(): string | undefined {
  return process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
}

export function getNewsletterCollectionId(): string | undefined {
  return process.env.NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID
}

export function getFeedbackCollectionId(): string | undefined {
  return process.env.NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID
}
