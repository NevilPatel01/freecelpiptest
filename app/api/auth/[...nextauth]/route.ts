import { handlers } from "@/lib/auth"

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const { GET, POST } = handlers

