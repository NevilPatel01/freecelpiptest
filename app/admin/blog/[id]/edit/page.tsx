import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { BlogPostForm } from '@/components/admin/blog-post-form';
import { getPostByIdDb } from '@/lib/blog-db';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdDb(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/blog" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to posts
        </Link>
      </Button>
      <BlogPostForm
        mode="edit"
        postId={post.id}
        initialData={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          featuredImage: post.featuredImage ?? '',
          published: post.published,
          author: post.author ?? 'FreeCELPIPTest',
        }}
      />
    </div>
  );
}
