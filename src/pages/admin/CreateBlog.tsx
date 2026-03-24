import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { ArrowLeft, Save } from 'lucide-react';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('0');
  const [isPublishing, setIsPublishing] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    } else {
      setSlug('');
    }
  }, [title]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsPublishing(true);

    try {
      const { error } = await supabase.from('blogs').insert([
        {
          title,
          slug,
          content, // Storing HTML or JSON string
          is_paid: isPaid,
          price: isPaid ? (parseFloat(price) || 0) : 0,
        },
      ]);

      if (error) {
        console.error('Error inserting blog:', error);
        toast.error('Failed to publish blog: ' + error.message);
      } else {
        toast.success('Blog published successfully!');
        navigate('/admin/blogs');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blogs')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
          <p className="text-gray-500 mt-1">Write a new article for your website.</p>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-8">
        <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="e.g. My Awesome New Blog Post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              placeholder="my-awesome-new-blog-post"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              The URL will be: /blog/{slug}
            </p>
          </div>
        </div>

        <div className="space-y-2 bg-white p-6 rounded-lg border shadow-sm">
          <Label>Content</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg border shadow-sm flex flex-col items-start">
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="space-y-0.5">
              <Label htmlFor="paid-toggle" className="text-base">Paid Content</Label>
              <p className="text-sm text-gray-500">Require payment to view full post.</p>
            </div>
            <Switch
              id="paid-toggle"
              checked={isPaid}
              onCheckedChange={setIsPaid}
            />
          </div>

          {isPaid && (
            <div className="space-y-2 w-full max-w-sm pt-2 animate-in slide-in-from-top-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="9.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={isPaid}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/blogs')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPublishing} className="gap-2">
            {isPublishing ? (
              <>Publishing...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publish Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
