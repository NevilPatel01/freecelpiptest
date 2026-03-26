/**
 * One-time (or idempotent) Appwrite provisioning for FreeCELPIPTest.
 *
 * Prerequisites:
 * - Appwrite Cloud project
 * - API key with scopes: databases.read, databases.write, storage.read, storage.write
 * - NEXT_PUBLIC_APPWRITE_* and APPWRITE_API_KEY in .env or .env.local
 *
 * Usage:
 *   npx tsx scripts/setup-appwrite-collections.ts
 *   npx tsx scripts/setup-appwrite-collections.ts --ensure-database   # create DB if missing
 *
 * Default collection IDs: blog_posts, newsletter, feedback
 * Default bucket ID: blog_images
 *
 * Security note: newsletter uses read(any) so anonymous clients can run the duplicate-email
 * query in lib/appwrite/forms.ts. For production, move subscriptions to an Appwrite Function
 * and tighten collection permissions.
 */

import {
  AppwriteException,
  Client,
  Databases,
  Storage,
  Permission,
  Role,
  DatabasesIndexType,
  OrderBy,
  Compression,
} from "node-appwrite"
import { loadEnvFiles } from "./load-env"

const SLEEP_MS = 600
const ATTR_TIMEOUT_MS = 120_000

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

function isReadyStatus(status?: string) {
  return status === "available"
}

async function waitForAttribute(
  db: Databases,
  databaseId: string,
  collectionId: string,
  key: string
) {
  const start = Date.now()
  while (Date.now() - start < ATTR_TIMEOUT_MS) {
    const attr = await db.getAttribute(databaseId, collectionId, key)
    const st = (attr as { status?: string }).status
    if (isReadyStatus(st)) return
    if (st === "failed") {
      throw new Error(`Attribute "${key}" failed to build in Appwrite`)
    }
    await sleep(SLEEP_MS)
  }
  throw new Error(`Timeout waiting for attribute "${key}"`)
}

async function waitForIndex(
  db: Databases,
  databaseId: string,
  collectionId: string,
  key: string
) {
  const start = Date.now()
  while (Date.now() - start < ATTR_TIMEOUT_MS) {
    const idx = await db.getIndex(databaseId, collectionId, key)
    const st = (idx as { status?: string }).status
    if (isReadyStatus(st)) return
    if (st === "failed") {
      throw new Error(`Index "${key}" failed to build`)
    }
    await sleep(SLEEP_MS)
  }
  throw new Error(`Timeout waiting for index "${key}"`)
}

function isWrongRegionError(e: unknown): boolean {
  if (!(e instanceof AppwriteException)) return false
  return (
    e.type === "general_access_forbidden" ||
    /not accessible in this region/i.test(e.message)
  )
}

function printRegionalEndpointHelp(currentEndpoint: string) {
  console.error(`
Appwrite: wrong API region for this project (current endpoint: ${currentEndpoint}).

Fix: In Appwrite Console open your project → Settings and copy the exact "API Endpoint"
(usually https://<region>.cloud.appwrite.io/v1 — not the generic cloud.appwrite.io).

Examples:
  https://tor.cloud.appwrite.io/v1   Toronto
  https://fra.cloud.appwrite.io/v1   Frankfurt
  https://nyc.cloud.appwrite.io/v1   New York
  https://sfo.cloud.appwrite.io/v1   San Francisco
  https://sgp.cloud.appwrite.io/v1   Singapore
  https://syd.cloud.appwrite.io/v1   Sydney

Set NEXT_PUBLIC_APPWRITE_ENDPOINT to that value in .env / .env.local and run again.
Docs: https://appwrite.io/docs/products/network/endpoints
`)
}

async function ensureDatabase(
  db: Databases,
  databaseId: string,
  ensure: boolean,
  endpointForHints: string
) {
  try {
    await db.get({ databaseId })
    console.log(`Database "${databaseId}" exists.`)
  } catch (e) {
    if (isWrongRegionError(e)) {
      printRegionalEndpointHelp(endpointForHints)
      process.exit(1)
    }
    if (e instanceof AppwriteException && e.code === 401 && !isWrongRegionError(e)) {
      console.error(
        "Appwrite returned 401. Check APPWRITE_API_KEY scopes (databases.read/write) and project ID."
      )
      process.exit(1)
    }

    const likelyMissing =
      e instanceof AppwriteException &&
      (e.code === 404 ||
        /not\s+found/i.test(e.message) ||
        e.type?.toLowerCase().includes("not_found"))

    if (!likelyMissing) {
      console.error(e)
      process.exit(1)
    }

    if (!ensure) {
      console.error(
        `Database "${databaseId}" was not found with your current endpoint. Either:\n` +
          `  • Create a database with this ID in Appwrite Console → Databases, or\n` +
          `  • Run: npx tsx scripts/setup-appwrite-collections.ts --ensure-database\n` +
          `If you see a "region" error when using --ensure-database, fix NEXT_PUBLIC_APPWRITE_ENDPOINT first.`
      )
      process.exit(1)
    }

    try {
      await db.create({ databaseId, name: "FreeCELPIPTest" })
      console.log(`Created database "${databaseId}".`)
    } catch (createErr) {
      if (isWrongRegionError(createErr)) {
        printRegionalEndpointHelp(endpointForHints)
        process.exit(1)
      }
      throw createErr
    }
  }
}

async function ensureCollection(
  db: Databases,
  databaseId: string,
  collectionId: string,
  name: string,
  permissions: string[]
) {
  try {
    await db.getCollection(databaseId, collectionId)
    console.log(
      `Collection "${collectionId}" already exists — skipping create (delete in Appwrite if schema is wrong).`
    )
    return false
  } catch {
    await db.createCollection({
      databaseId,
      collectionId,
      name,
      permissions,
      documentSecurity: false,
      enabled: true,
    })
    console.log(`Created collection "${collectionId}".`)
    return true
  }
}

async function main() {
  loadEnvFiles()
  const ensureDb = process.argv.includes("--ensure-database")

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, "")
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  const apiKey = process.env.APPWRITE_API_KEY

  const blogId = process.env.SETUP_COLLECTION_BLOG_POSTS ?? "blog_posts"
  const newsletterId = process.env.SETUP_COLLECTION_NEWSLETTER ?? "newsletter"
  const feedbackId = process.env.SETUP_COLLECTION_FEEDBACK ?? "feedback"
  const bucketId = process.env.SETUP_BUCKET_BLOG_IMAGES ?? "blog_images"

  if (!endpoint || !projectId || !databaseId || !apiKey) {
    console.error(
      "Missing env: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DATABASE_ID, APPWRITE_API_KEY"
    )
    process.exit(1)
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
  const db = new Databases(client)
  const storage = new Storage(client)

  await ensureDatabase(db, databaseId, ensureDb, endpoint)

  // --- blog_posts (admin CRUD via authenticated client; builds use API key) ---
  const blogPerms = [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]
  const createdBlog = await ensureCollection(db, databaseId, blogId, "Blog posts", blogPerms)

  if (createdBlog) {
    await db.createStringAttribute({ databaseId, collectionId: blogId, key: "title", size: 255, required: true })
    await waitForAttribute(db, databaseId, blogId, "title")
    await db.createStringAttribute({ databaseId, collectionId: blogId, key: "slug", size: 255, required: true })
    await waitForAttribute(db, databaseId, blogId, "slug")
    await db.createStringAttribute({ databaseId, collectionId: blogId, key: "excerpt", size: 500, required: true })
    await waitForAttribute(db, databaseId, blogId, "excerpt")
    await db.createTextAttribute({ databaseId, collectionId: blogId, key: "content", required: true })
    await waitForAttribute(db, databaseId, blogId, "content")
    await db.createStringAttribute({ databaseId, collectionId: blogId, key: "category", size: 128, required: true })
    await waitForAttribute(db, databaseId, blogId, "category")
    await db.createStringAttribute({
      databaseId,
      collectionId: blogId,
      key: "tags",
      size: 64,
      required: false,
      array: true,
    })
    await waitForAttribute(db, databaseId, blogId, "tags")
    await db.createStringAttribute({
      databaseId,
      collectionId: blogId,
      key: "featuredImage",
      size: 2048,
      required: false,
    })
    await waitForAttribute(db, databaseId, blogId, "featuredImage")
    await db.createIntegerAttribute({
      databaseId,
      collectionId: blogId,
      key: "readingTime",
      required: true,
      min: 1,
      max: 9999,
    })
    await waitForAttribute(db, databaseId, blogId, "readingTime")
    await db.createStringAttribute({ databaseId, collectionId: blogId, key: "author", size: 128, required: false })
    await waitForAttribute(db, databaseId, blogId, "author")
    await db.createBooleanAttribute({
      databaseId,
      collectionId: blogId,
      key: "published",
      required: true,
    })
    await waitForAttribute(db, databaseId, blogId, "published")
    await db.createDatetimeAttribute({
      databaseId,
      collectionId: blogId,
      key: "publishedAt",
      required: false,
    })
    await waitForAttribute(db, databaseId, blogId, "publishedAt")
    await db.createIntegerAttribute({
      databaseId,
      collectionId: blogId,
      key: "views",
      required: true,
      min: 0,
    })
    await waitForAttribute(db, databaseId, blogId, "views")

    await db.createIndex({
      databaseId,
      collectionId: blogId,
      key: "slug_unique",
      type: DatabasesIndexType.Unique,
      attributes: ["slug"],
    })
    await waitForIndex(db, databaseId, blogId, "slug_unique")
    await db.createIndex({
      databaseId,
      collectionId: blogId,
      key: "published_publishedAt",
      type: DatabasesIndexType.Key,
      attributes: ["published", "publishedAt"],
      orders: [OrderBy.Desc, OrderBy.Desc],
    })
    await waitForIndex(db, databaseId, blogId, "published_publishedAt")
  }

  // --- newsletter (see file header for security note) ---
  const newsletterPerms = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.users()),
  ]
  console.warn(
    "[newsletter] Using read/create/update(any) so anonymous duplicate checks work. Tighten for production (e.g. Function)."
  )
  const createdNews = await ensureCollection(
    db,
    databaseId,
    newsletterId,
    "Newsletter",
    newsletterPerms
  )
  if (createdNews) {
    await db.createEmailAttribute({
      databaseId,
      collectionId: newsletterId,
      key: "email",
      required: true,
    })
    await waitForAttribute(db, databaseId, newsletterId, "email")
    await db.createBooleanAttribute({
      databaseId,
      collectionId: newsletterId,
      key: "active",
      required: true,
    })
    await waitForAttribute(db, databaseId, newsletterId, "active")
    await db.createIndex({
      databaseId,
      collectionId: newsletterId,
      key: "email_unique",
      type: DatabasesIndexType.Unique,
      attributes: ["email"],
    })
    await waitForIndex(db, databaseId, newsletterId, "email_unique")
  }

  // --- feedback ---
  const feedbackPerms = [
    Permission.create(Role.guests()),
    Permission.create(Role.users()),
    Permission.read(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]
  const createdFb = await ensureCollection(db, databaseId, feedbackId, "Feedback", feedbackPerms)
  if (createdFb) {
    await db.createStringAttribute({
      databaseId,
      collectionId: feedbackId,
      key: "name",
      size: 128,
      required: false,
    })
    await waitForAttribute(db, databaseId, feedbackId, "name")
    await db.createStringAttribute({
      databaseId,
      collectionId: feedbackId,
      key: "email",
      size: 255,
      required: false,
    })
    await waitForAttribute(db, databaseId, feedbackId, "email")
    await db.createStringAttribute({
      databaseId,
      collectionId: feedbackId,
      key: "message",
      size: 8000,
      required: true,
    })
    await waitForAttribute(db, databaseId, feedbackId, "message")
    await db.createIntegerAttribute({
      databaseId,
      collectionId: feedbackId,
      key: "rating",
      required: false,
      min: 1,
      max: 5,
    })
    await waitForAttribute(db, databaseId, feedbackId, "rating")
    await db.createStringAttribute({
      databaseId,
      collectionId: feedbackId,
      key: "category",
      size: 64,
      required: true,
    })
    await waitForAttribute(db, databaseId, feedbackId, "category")
    await db.createStringAttribute({
      databaseId,
      collectionId: feedbackId,
      key: "status",
      size: 32,
      required: true,
    })
    await waitForAttribute(db, databaseId, feedbackId, "status")
  }

  // --- storage bucket ---
  try {
    await storage.getBucket(bucketId)
    console.log(`Bucket "${bucketId}" already exists — skipping create.`)
  } catch {
    await storage.createBucket({
      bucketId,
      name: "Blog images",
      permissions: [
        Permission.create(Role.users()),
        Permission.read(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      fileSecurity: false,
      enabled: true,
      maximumFileSize: 5 * 1024 * 1024,
      allowedFileExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
      compression: Compression.None,
      encryption: false,
      antivirus: false,
    })
    console.log(`Created bucket "${bucketId}".`)
  }

  console.log("\n--- Add to .env / .env.local ---\n")
  console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_POSTS="${blogId}"`)
  console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_NEWSLETTER="${newsletterId}"`)
  console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_FEEDBACK="${feedbackId}"`)
  console.log(`NEXT_PUBLIC_APPWRITE_BUCKET_BLOG_IMAGES="${bucketId}"`)
  console.log("\nDone.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
