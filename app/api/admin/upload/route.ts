import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const UPLOAD_DIR = "public/uploads/blog"
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 80)
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing or invalid file" },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, GIF, or WebP." },
        { status: 400 }
      )
    }

    const ext = path.extname(file.name) || ".jpg"
    const base = sanitizeFilename(path.basename(file.name, ext))
    const filename = `${base}-${Date.now()}${ext}`
    const dir = path.join(process.cwd(), UPLOAD_DIR)

    await mkdir(dir, { recursive: true })
    const filePath = path.join(dir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/blog/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
