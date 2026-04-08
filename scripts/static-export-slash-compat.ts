/**
 * After `next build` with `output: "export"` and `trailingSlash: false`, each route is
 * `out/foo.html`. Many static hosts (including DigitalOcean) also resolve `/foo/` only if
 * `out/foo/index.html` exists. Duplicate each page as `.../name/index.html` so both
 * `/foo` and `/foo/` work without a CDN redirect.
 */
import fs from "node:fs"
import path from "node:path"

const outDir = path.join(process.cwd(), "out")

function walkHtmlFiles(dir: string, callback: (abs: string) => void) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "_next") continue
      walkHtmlFiles(full, callback)
    } else if (ent.name.endsWith(".html")) {
      callback(full)
    }
  }
}

function main() {
  if (!fs.existsSync(outDir)) {
    console.warn("[slash-compat] out/ missing; skip")
    return
  }

  let n = 0
  walkHtmlFiles(outDir, (abs) => {
    const base = path.basename(abs, ".html")
    if (base === "index" || base === "404") return

    const parent = path.dirname(abs)
    const destDir = path.join(parent, base)
    const dest = path.join(destDir, "index.html")

    fs.mkdirSync(destDir, { recursive: true })
    fs.copyFileSync(abs, dest)
    n++
  })

  console.log(`[slash-compat] mirrored ${n} route(s) as .../<name>/index.html`)
}

main()
