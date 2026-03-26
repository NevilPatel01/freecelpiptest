/**
 * Writes content/.blog-slugs-export.json for static export (prebuild).
 * Slugs come from Appwrite when APPWRITE_API_KEY + public Appwrite env are set; otherwise [].
 */
import fs from "fs"
import path from "path"
import { listPublishedBlogSlugsForStaticExport } from "../lib/appwrite/build-blog-slugs"
import { loadEnvFiles } from "./load-env"

loadEnvFiles()

async function main() {
  const slugs = await listPublishedBlogSlugsForStaticExport()
  const outDir = path.join(process.cwd(), "content")
  const outFile = path.join(outDir, ".blog-slugs-export.json")
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  fs.writeFileSync(outFile, JSON.stringify(slugs), "utf8")
  console.log(`Wrote ${slugs.length} blog slug(s) to content/.blog-slugs-export.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
