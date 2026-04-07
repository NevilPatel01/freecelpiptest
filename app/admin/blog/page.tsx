import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function AdminBlogInfoPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Blog content</CardTitle>
        </div>
        <CardDescription>
          Articles are stored as MDX/Markdown in the repository under{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">content/blog</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          To add or edit posts, update the files in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">content/blog</code>, commit, and
          deploy. Use frontmatter for title, excerpt, category, tags, and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">publishedAt</code> as described in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">content/blog/README.md</code>.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/blog">View public blog</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
