"use client"

import { ID, Query } from "appwrite"
import type { BlogPostFormData } from "@/components/admin/blog-post-form"
import { getAppwriteCollectionIds, getAppwritePublicConfig, getAppwriteStorageIds } from "./env"

function clientReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

import { getBrowserDatabases } from "./browser"

function mapDocToPost(doc: Record<string, unknown>) {
  const tags = doc.tags
  return {
    id: doc.$id as string,
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    category: String(doc.category ?? ""),
    tags: Array.isArray(tags) ? (tags as string[]) : [],
    published: Boolean(doc.published),
    publishedAt: doc.publishedAt ? String(doc.publishedAt) : null,
    updatedAt: String(doc.$updatedAt ?? doc.updatedAt ?? ""),
    content: String(doc.content ?? ""),
    featuredImage: doc.featuredImage ? String(doc.featuredImage) : "",
    author: String(doc.author ?? ""),
  }
}

export async function cmsListAllPosts() {
  const { databases, databaseId } = getBrowserDatabases()
  const { blogPosts } = getAppwriteCollectionIds()
  const res = await databases.listDocuments(databaseId, blogPosts, [
    Query.orderDesc("$updatedAt"),
    Query.limit(5000),
  ])
  return res.documents.map((d) => mapDocToPost(d as unknown as Record<string, unknown>))
}

export async function cmsGetPostById(id: string) {
  const { databases, databaseId } = getBrowserDatabases()
  const { blogPosts } = getAppwriteCollectionIds()
  const doc = await databases.getDocument(databaseId, blogPosts, id)
  return mapDocToPost(doc as unknown as Record<string, unknown>)
}

export async function cmsDeletePost(id: string) {
  const { databases, databaseId } = getBrowserDatabases()
  const { blogPosts } = getAppwriteCollectionIds()
  await databases.deleteDocument(databaseId, blogPosts, id)
}

export async function cmsCreatePost(
  form: BlogPostFormData,
  authorFallback: string
) {
  const { databases, databaseId } = getBrowserDatabases()
  const { blogPosts } = getAppwriteCollectionIds()
  const slug = (form.slug || form.title)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const published = Boolean(form.published)
  const readingTime = clientReadingTime(form.content)
  const data = {
    title: form.title.trim(),
    slug,
    excerpt: (form.excerpt || form.title).trim(),
    content: form.content.trim(),
    category: (form.category || "General").trim(),
    tags: form.tags,
    featuredImage: form.featuredImage?.trim() || "",
    readingTime,
    author: (form.author || authorFallback).trim(),
    published,
    publishedAt: published ? new Date().toISOString() : null,
    views: 0,
  }
  return databases.createDocument(databaseId, blogPosts, ID.unique(), data)
}

export async function cmsUpdatePost(
  postId: string,
  form: BlogPostFormData,
  authorFallback: string
) {
  const { databases, databaseId } = getBrowserDatabases()
  const { blogPosts } = getAppwriteCollectionIds()
  const slug = (form.slug || form.title)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const published = Boolean(form.published)
  const readingTime = clientReadingTime(form.content)
  const existing = await databases.getDocument(databaseId, blogPosts, postId)
  const prev = existing as unknown as Record<string, unknown>
  const wasPublished = Boolean(prev.published)
  const data = {
    title: form.title.trim(),
    slug,
    excerpt: (form.excerpt || form.title).trim(),
    content: form.content.trim(),
    category: (form.category || "General").trim(),
    tags: form.tags,
    featuredImage: form.featuredImage?.trim() || "",
    readingTime,
    author: (form.author || authorFallback).trim(),
    published,
    publishedAt: published
      ? wasPublished && prev.publishedAt
        ? String(prev.publishedAt)
        : new Date().toISOString()
      : null,
  }
  return databases.updateDocument(databaseId, blogPosts, postId, data)
}

export function publicStorageFileViewUrl(fileId: string): string {
  const { endpoint, projectId } = getAppwritePublicConfig()
  const { blogImages } = getAppwriteStorageIds()
  const e = endpoint.replace(/\/$/, "")
  return `${e}/storage/buckets/${blogImages}/files/${fileId}/view?project=${projectId}`
}
