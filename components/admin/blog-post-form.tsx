'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_AUTHOR } from '@/lib/constants';

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  published: boolean;
  author: string;
}

const defaultForm: BlogPostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'General',
  tags: [],
  featuredImage: '',
  published: false,
  author: DEFAULT_AUTHOR,
};

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

interface BlogPostFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<BlogPostFormData> & { id?: string };
  postId?: string;
}

export function BlogPostForm({ mode, initialData, postId }: BlogPostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<BlogPostFormData>({
    ...defaultForm,
    ...initialData,
    tags: initialData?.tags ?? defaultForm.tags,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof BlogPostFormData, value: string | string[] | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const generateSlug = () => {
    const slug = slugify(form.title);
    if (slug) handleChange('slug', slug);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      handleChange('featuredImage', data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTagsInput = (value: string) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    handleChange('tags', tags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
      };
      const url = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${postId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'New Post' : 'Edit Post'}</CardTitle>
          <CardDescription>
            Use Markdown in the content. Upload an image for the featured/cover image.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm px-4 py-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium mb-2 block">Title *</label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Post title"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="slug" className="text-sm font-medium mb-2 block">Slug *</label>
              <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                Generate from title
              </Button>
            </div>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-medium mb-2 block">Excerpt</label>
            <Input
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Short summary for cards and SEO"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium mb-2 block">Content (Markdown) *</label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write in Markdown. Headings, lists, **bold**, *italic*, [links](url), images: ![alt](url)."
              required
              rows={16}
              className={cn(
                'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'placeholder:text-muted-foreground min-h-[240px] resize-y'
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium mb-2 block">Category</label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g. Writing Tips"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
              <Input
                id="tags"
                value={form.tags.join(', ')}
                onChange={(e) => handleTagsInput(e.target.value)}
                placeholder="writing, task-2, CLB 9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Featured / cover image</label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? 'Uploading…' : 'Upload image'}
              </Button>
              {form.featuredImage && (
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {form.featuredImage}
                  </span>
                </div>
              )}
            </div>
            {form.featuredImage && (
              <div className="mt-2 rounded-lg border overflow-hidden max-w-xs">
                <img
                  src={form.featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium mb-2 block">Author (display name)</label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder={DEFAULT_AUTHOR}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => handleChange('published', e.target.checked)}
              className="rounded border-input"
            />
            <label htmlFor="published" className="text-sm font-medium">Publish this post (visible on blog)</label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {mode === 'create' ? 'Create post' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
