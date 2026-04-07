/**
 * Load .env.local then .env into process.env for CLI scripts (bun/node).
 * Next.js loads these automatically at dev/build time.
 * .env.local wins over .env for each key (same order as typical tooling).
 */
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

export function loadEnvFiles(cwd: string = process.cwd()): void {
  for (const name of [".env.local", ".env"]) {
    const p = resolve(cwd, name)
    if (!existsSync(p)) continue
    const text = readFileSync(p, "utf8")
    for (const line of text.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq <= 0) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = val
    }
  }
}
