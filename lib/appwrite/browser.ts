"use client"

import { Client, Account, Databases, Storage, Teams } from "appwrite"
import { getAppwritePublicConfig, getAppwriteStorageIds } from "./env"

let clientSingleton: Client | null = null

export function getBrowserClient(): Client {
  if (typeof window === "undefined") {
    throw new Error("getBrowserClient is client-only")
  }
  if (!clientSingleton) {
    const { endpoint, projectId } = getAppwritePublicConfig()
    if (!endpoint || !projectId) {
      throw new Error("Missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID")
    }
    clientSingleton = new Client().setEndpoint(endpoint).setProject(projectId)
  }
  return clientSingleton
}

export function getAccount() {
  return new Account(getBrowserClient())
}

export function getBrowserDatabases() {
  const { databaseId } = getAppwritePublicConfig()
  if (!databaseId) throw new Error("Missing NEXT_PUBLIC_APPWRITE_DATABASE_ID")
  return { databases: new Databases(getBrowserClient()), databaseId }
}

export function getBrowserStorage() {
  const { blogImages } = getAppwriteStorageIds()
  if (!blogImages) throw new Error("Missing NEXT_PUBLIC_APPWRITE_BUCKET_BLOG_IMAGES")
  return { storage: new Storage(getBrowserClient()), bucketId: blogImages }
}

export function getTeams() {
  return new Teams(getBrowserClient())
}
