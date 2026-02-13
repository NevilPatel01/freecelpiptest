import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { BlogPostForm } from '@/components/admin/blog-post-form';

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/blog" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to posts
        </Link>
      </Button>
      <BlogPostForm mode="create" />
    </div>
  );
}
