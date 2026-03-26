import "server-only"

import { Client, Databases, Query, type Models } from "node-appwrite"

type Doc = Models.Document & Record<string, unknown>
import {
  getAppwriteCollectionIds,
  getAppwritePublicConfig,
  hasAppwriteBuildCredentials,
} from "./env"

export function getServerDatabases(): Databases | null {
  if (!hasAppwriteBuildCredentials()) return null
  const { endpoint, projectId } = getAppwritePublicConfig()
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(process.env.APPWRITE_API_KEY!)
  return new Databases(client)
}

export function mapBlogDoc(doc: Models.Document) {
  const d = doc as Doc
  const tags = d.tags
  return {
    id: doc.$id,
    title: String(d.title ?? ""),
    slug: String(d.slug ?? ""),
    excerpt: String(d.excerpt ?? ""),
    content: String(d.content ?? ""),
    featuredImage: d.featuredImage ? String(d.featuredImage) : null,
    category: String(d.category ?? "General"),
    tags: Array.isArray(tags) ? (tags as string[]) : [],
    readingTime: typeof d.readingTime === "number" ? d.readingTime : Number(d.readingTime) || 1,
    author: d.author ? String(d.author) : null,
    published: Boolean(d.published),
    publishedAt: d.publishedAt ? new Date(String(d.publishedAt)) : null,
    views: typeof d.views === "number" ? d.views : Number(d.views) || 0,
    createdAt: new Date(doc.$createdAt),
    updatedAt: new Date(doc.$updatedAt),
  }
}

export async function serverListPublishedBlogDocs() {
  const db = getServerDatabases()
  if (!db) return []
  const { databaseId } = getAppwritePublicConfig()
  const { blogPosts } = getAppwriteCollectionIds()
  const res = await db.listDocuments(databaseId, blogPosts, [
    Query.equal("published", true),
    Query.isNotNull("publishedAt"),
    Query.orderDesc("publishedAt"),
    Query.limit(5000),
  ])
  return res.documents.map(mapBlogDoc)
}

export async function serverGetPublishedBlogBySlug(slug: string) {
  const db = getServerDatabases()
  if (!db) return null
  const { databaseId } = getAppwritePublicConfig()
  const { blogPosts } = getAppwriteCollectionIds()
  const res = await db.listDocuments(databaseId, blogPosts, [
    Query.equal("slug", slug),
    Query.equal("published", true),
    Query.limit(1),
  ])
  const doc = res.documents[0]
  return doc ? mapBlogDoc(doc) : null
}

export async function serverGetBlogById(id: string) {
  const db = getServerDatabases()
  if (!db) return null
  const { databaseId } = getAppwritePublicConfig()
  const { blogPosts } = getAppwriteCollectionIds()
  try {
    const doc = await db.getDocument(databaseId, blogPosts, id)
    return mapBlogDoc(doc)
  } catch {
    return null
  }
}

export async function serverListAllBlogDocs() {
  const db = getServerDatabases()
  if (!db) return []
  const { databaseId } = getAppwritePublicConfig()
  const { blogPosts } = getAppwriteCollectionIds()
  const res = await db.listDocuments(databaseId, blogPosts, [
    Query.orderDesc("$updatedAt"),
    Query.limit(5000),
  ])
  return res.documents.map(mapBlogDoc)
}

export async function serverGetBlogDocBySlugAny(slug: string) {
  const db = getServerDatabases()
  if (!db) return null
  const { databaseId } = getAppwritePublicConfig()
  const { blogPosts } = getAppwriteCollectionIds()
  const res = await db.listDocuments(databaseId, blogPosts, [
    Query.equal("slug", slug),
    Query.limit(1),
  ])
  const doc = res.documents[0]
  return doc ? mapBlogDoc(doc) : null
}

export async function serverListBlogSlugsPublished(): Promise<string[]> {
  const posts = await serverListPublishedBlogDocs()
  return posts.map((p) => p.slug)
}

export async function serverListBlogForSitemap(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  const posts = await serverListPublishedBlogDocs()
  return posts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }))
}
