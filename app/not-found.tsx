import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="whitespace-nowrap">
        <Link href="/" className="flex items-center">
          <Home className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>Go Home</span>
        </Link>
      </Button>
    </div>
  )
}

