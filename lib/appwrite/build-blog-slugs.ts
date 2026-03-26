/**
 * Build-time slug list for static export. Intentionally does NOT use `server-only`
 * so Next.js can analyze generateStaticParams() with output: "export".
 */
import { Client, Databases, Query } from "node-appwrite"
import { getAppwriteCollectionIds, getAppwritePublicConfig } from "./env"

export async function listPublishedBlogSlugsForStaticExport(): Promise<string[]> {
  const apiKey = process.env.APPWRITE_API_KEY
  const { endpoint, projectId, databaseId } = getAppwritePublicConfig()
  const { blogPosts } = getAppwriteCollectionIds()
  if (!apiKey || !endpoint || !projectId || !databaseId || !blogPosts) {
    return []
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)
  const db = new Databases(client)

  try {
    const res = await db.listDocuments(databaseId, blogPosts, [
      Query.equal("published", true),
      Query.isNotNull("publishedAt"),
      Query.limit(5000),
    ])
    return res.documents
      .map((d) => String((d as { slug?: string }).slug ?? ""))
      .filter(Boolean)
  } catch {
    return []
  }
}
