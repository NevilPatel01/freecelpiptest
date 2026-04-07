/**
 * Writes content/.blog-slugs-export.json for tooling / legacy consumers.
 * Slugs are derived from files in content/blog.
 */
import fs from "fs"
import path from "path"
import { getBlogPostSlugs } from "../lib/blog"
import { loadEnvFiles } from "./load-env"

loadEnvFiles()

function main() {
  const slugs = getBlogPostSlugs()
  const outDir = path.join(process.cwd(), "content")
  const outFile = path.join(outDir, ".blog-slugs-export.json")
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  fs.writeFileSync(outFile, JSON.stringify(slugs), "utf8")
  console.log(`Wrote ${slugs.length} blog slug(s) to content/.blog-slugs-export.json`)
}

main()
