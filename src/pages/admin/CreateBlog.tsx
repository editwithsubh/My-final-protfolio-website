import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Globe, Save, Tag, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '@/components/admin/RichTextEditor';
import CoverImageUploader from '@/components/admin/CoverImageUploader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from 'sonner';

const CATEGORIES = ['General', 'Tutorial', 'Case Study', 'Opinion', 'News', 'Design', 'Development', 'AI & ML'];
const CURRENCIES = ['INR', 'USD'] as const;
const BLOG_DRAFT_STORAGE_KEY = 'blog_draft';

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ');
const panelClass = 'space-y-3 rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slugEditedRef = useRef(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('General');
  const [coverImage, setCoverImage] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [status, setStatus] = useState<'draft' | 'published' | 'unlisted'>('draft');
  const [featuredHome, setFeaturedHome] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // --- Problem 8: Sheet-based preview ---
  const [previewOpen, setPreviewOpen] = useState(false);

  // --- Problem 7: Track whether edit draft has been offered ---
  const editDraftOfferedRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);
      if (!savedDraft) return;

      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title ?? '');
        setSlug(parsed.slug ?? '');
        setContent(parsed.content ?? '');
        setExcerpt(parsed.excerpt ?? '');
        setTags(parsed.tags ?? []);
        setCategory(parsed.category ?? 'General');
        setCoverImage(parsed.coverImage ?? '');
        setIsPaid(parsed.isPaid ?? false);
        setPrice(parsed.price ?? '0');
        setCurrency(parsed.currency ?? 'INR');
        setMetaTitle(parsed.metaTitle ?? '');
        setMetaDescription(parsed.metaDescription ?? '');
        setStatus(parsed.status ?? 'draft');
        setFeaturedHome(parsed.featuredHome ?? false);
        setPublishedAt(parsed.publishedAt ?? '');
      } catch (error) {
        console.error('Failed to parse stored blog draft', error);
      }
      return;
    }

    const loadBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();

      if (error || !data) {
        toast.error('Failed to load blog post');
        navigate('/admin/blogs');
        return;
      }

      setTitle(data.title ?? '');
      setSlug(data.slug ?? '');
      setContent(data.content ?? '');
      setExcerpt(data.excerpt ?? '');
      setTags(data.tags ?? []);
      setCategory(data.category ?? 'General');
      setCoverImage(data.cover_image ?? '');
      setIsPaid(Boolean(data.is_paid));
      setPrice(String(data.price ?? 0));
      setCurrency((data.currency ?? 'INR') as 'INR' | 'USD');
      setStatus(data.status ?? 'published');
      setFeaturedHome(Boolean(data.featured_home));
      setMetaTitle(data.meta_title ?? '');
      setMetaDescription(data.meta_description ?? '');
      setPublishedAt(data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '');
      slugEditedRef.current = true;
      setLoading(false);

      // --- Problem 7: Check for a more recent edit draft in localStorage ---
      if (!editDraftOfferedRef.current) {
        editDraftOfferedRef.current = true;
        const editDraftKey = `blog_draft_edit_${id}`;
        const savedEditDraft = localStorage.getItem(editDraftKey);
        if (savedEditDraft) {
          try {
            const parsed = JSON.parse(savedEditDraft);
            const savedAt = parsed._savedAt ? new Date(parsed._savedAt) : null;
            if (savedAt) {
              toast('Restore unsaved changes?', {
                description: `Draft from ${savedAt.toLocaleString()}`,
                duration: 10000,
                action: {
                  label: 'Restore',
                  onClick: () => {
                    setTitle(parsed.title ?? data.title ?? '');
                    setSlug(parsed.slug ?? data.slug ?? '');
                    setContent(parsed.content ?? data.content ?? '');
                    setExcerpt(parsed.excerpt ?? data.excerpt ?? '');
                    setTags(parsed.tags ?? data.tags ?? []);
                    setCategory(parsed.category ?? data.category ?? 'General');
                    setCoverImage(parsed.coverImage ?? data.cover_image ?? '');
                    setIsPaid(parsed.isPaid ?? Boolean(data.is_paid));
                    setPrice(parsed.price ?? String(data.price ?? 0));
                    setCurrency((parsed.currency ?? data.currency ?? 'INR') as 'INR' | 'USD');
                    setMetaTitle(parsed.metaTitle ?? data.meta_title ?? '');
                    setMetaDescription(parsed.metaDescription ?? data.meta_description ?? '');
                    setStatus(parsed.status ?? data.status ?? 'draft');
                    setFeaturedHome(parsed.featuredHome ?? Boolean(data.featured_home));
                    setPublishedAt(parsed.publishedAt ?? (data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ''));
                    toast.success('Draft restored');
                  },
                },
                cancel: {
                  label: 'Discard',
                  onClick: () => {
                    localStorage.removeItem(editDraftKey);
                    toast.info('Draft discarded');
                  },
                },
              });
            }
          } catch {
            localStorage.removeItem(editDraftKey);
          }
        }
      }
    };

    void loadBlog();
  }, [id, isEditing, navigate]);

  useEffect(() => {
    if (!slugEditedRef.current) {
      setSlug(title ? slugify(title) : '');
    }
  }, [title]);

  // --- Problem 6 & 7: Auto-save with 3s debounce, works for both new and editing ---
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(() => {
      const draftData = {
        title,
        slug,
        content,
        excerpt,
        tags,
        category,
        coverImage,
        isPaid,
        price,
        currency,
        metaTitle,
        metaDescription,
        status,
        featuredHome,
        publishedAt,
        _savedAt: new Date().toISOString(),
      };

      if (isEditing) {
        // Problem 7: Save to edit-specific key instead of skipping
        localStorage.setItem(`blog_draft_edit_${id}`, JSON.stringify(draftData));
      } else {
        localStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      }
      setLastSaved(new Date());
    }, 3000); // Problem 6: Changed from 30000 to 3000

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [category, content, coverImage, currency, excerpt, featuredHome, id, isEditing, isPaid, metaDescription, metaTitle, price, publishedAt, slug, status, tags, title]);

  // --- Problem 6: beforeunload warning ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((title || content) && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content, isSubmitting]);

  const readingTime = useMemo(() => {
    const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== ',') return;
    event.preventDefault();
    const nextTag = tagInput.trim().toLowerCase();
    if (nextTag && !tags.includes(nextTag)) {
      setTags((current) => [...current, nextTag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (publishStatus: 'draft' | 'published' | 'unlisted') => {
    if (!title || !slug || !content) {
      toast.error('Title, slug, and content are required');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      slug,
      content,
      excerpt,
      cover_image: coverImage,
      tags,
      category,
      reading_time: readingTime,
      status: publishStatus,
      featured_home: featuredHome,
      is_paid: isPaid,
      price: isPaid ? parseFloat(price) || 0 : 0,
      currency: isPaid ? currency : 'INR',
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt,
      published_at: publishStatus === 'published' || publishStatus === 'unlisted'
        ? publishedAt || new Date().toISOString()
        : null,
    };

    try {
      const query = isEditing
        ? supabase.from('blogs').update(payload).eq('id', id)
        : supabase.from('blogs').insert([payload]);

      const { error } = await query;
      if (error) throw error;

      setStatus(publishStatus);
      localStorage.removeItem(BLOG_DRAFT_STORAGE_KEY);
      if (isEditing && id) localStorage.removeItem(`blog_draft_edit_${id}`);
      toast.success(publishStatus === 'published' ? 'Post published!' : publishStatus === 'unlisted' ? 'Post saved as unlisted!' : 'Draft saved!');
      navigate('/admin/blogs');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Improvement B: Dynamic character count color helpers ---
  const excerptCountColor = excerpt.length >= 290 ? 'text-red-500' : excerpt.length > 250 ? 'text-amber-500' : 'text-slate-500';
  const metaTitleCountColor = metaTitle.length >= 70 ? 'text-red-500' : metaTitle.length > 60 ? 'text-amber-500' : 'text-slate-500';
  const metaDescCountColor = metaDescription.length >= 160 ? 'text-red-500' : metaDescription.length > 140 ? 'text-amber-500' : 'text-slate-500';

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading post editor...</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-7xl animate-in fade-in duration-500 pb-20 text-slate-900">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900" onClick={() => navigate('/admin/blogs')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isEditing ? 'Edit Blog Post' : 'New Blog Post'}</h1>
              {lastSaved && <p className="text-xs text-slate-500">Auto-saved at {lastSaved.toLocaleTimeString()}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* --- Problem 8: Preview opens Sheet instead of new tab --- */}
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-100 hover:text-slate-900" onClick={() => setPreviewOpen(true)} disabled={!title && !content}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-100 hover:text-slate-900" disabled={isSubmitting} onClick={() => handleSubmit('draft')}>
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 border-amber-400 bg-amber-50 text-amber-800 shadow-none hover:bg-amber-100 hover:text-amber-900" disabled={isSubmitting} onClick={() => handleSubmit('unlisted')}>
              <Eye className="h-4 w-4" /> Unlisted
            </Button>
            <Button size="sm" className="gap-1.5 border-orange bg-orange text-white shadow-none hover:bg-orange-dark hover:text-white" disabled={isSubmitting} onClick={() => handleSubmit('published')}>
              <Globe className="h-4 w-4" /> Publish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="editor" className="text-sm">Editor</TabsTrigger>
              <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full resize-none border-none bg-transparent text-4xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>URL: /blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(event) => {
                        slugEditedRef.current = true;
                        setSlug(slugify(event.target.value));
                      }}
                      className="border-b border-dashed border-sky-300 bg-transparent text-sky-600 outline-none"
                    />
                    <span className="ml-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {readingTime} min read
                    </span>
                  </div>
                </div>

                <CoverImageUploader value={coverImage} onChange={setCoverImage} />

                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your post here. Use the toolbar to format content, images, videos, and tables."
                />

                {/* --- Problem 9: Excerpt moved to Editor tab --- */}
                <div className="space-y-2 rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm">
                  <Label className="text-sm font-medium text-slate-900">Excerpt <span className="font-normal text-slate-500">(shown in listings)</span></Label>
                  <Textarea
                    placeholder="A short summary of this post..."
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={3}
                    maxLength={300}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">This appears in blog listing cards and search results.</p>
                    <p className={`text-right text-xs ${excerptCountColor}`}>{excerpt.length}/300</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Accordion type="multiple" defaultValue={["publishing", "category", "tags"]} className="w-full space-y-4">
                  <AccordionItem value="publishing" className="rounded-lg border border-slate-300 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">Publishing</AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Status</span>
                        <Badge variant={status === 'published' ? 'default' : status === 'unlisted' ? 'outline' : 'secondary'}>
                          {status === 'published' ? 'Published' : status === 'unlisted' ? 'Unlisted' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Visibility</span>
                        <span className="font-medium">{isPaid ? 'Paid' : 'Public'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Show on homepage</span>
                        <Switch checked={featuredHome} onCheckedChange={setFeaturedHome} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-600">Publish date</Label>
                        <Input type="datetime-local" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} className="h-9" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="category" className="rounded-lg border border-slate-300 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">Category</AccordionTrigger>
                    <AccordionContent className="flex flex-wrap gap-2 pt-2">
                      {CATEGORIES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCategory(item)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            category === item ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tags" className="rounded-lg border border-slate-300 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="flex items-center gap-1.5 text-sm font-medium hover:no-underline">
                      <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <div className="flex min-h-[32px] flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <Input
                        placeholder="Add tag, press Enter..."
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        onKeyDown={addTag}
                        className="h-8 text-xs"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 space-y-6 max-w-3xl">
            <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <Globe className="h-4 w-4" /> SEO Settings
              </h3>
              <div className="space-y-2">
                <Label className="text-xs text-slate-600">Meta Title <span className="text-slate-400">(defaults to post title)</span></Label>
                <Input placeholder={title || 'Meta title...'} value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} maxLength={70} />
                <p className={`text-right text-xs ${metaTitleCountColor}`}>{metaTitle.length}/70</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-600">Meta Description <span className="text-slate-400">(max 160 chars)</span></Label>
                <Textarea
                  placeholder={excerpt || 'Meta description...'}
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  rows={2}
                  maxLength={160}
                  className="resize-none"
                />
                <p className={`text-right text-xs ${metaDescCountColor}`}>{metaDescription.length}/160</p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">Paid Content</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Require payment to read</p>
                </div>
                <Switch checked={isPaid} onCheckedChange={setIsPaid} />
              </div>
              {isPaid && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2 max-w-xs">
                    <Label className="text-xs">Currency</Label>
                    <div className="flex gap-2">
                      {CURRENCIES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCurrency(item)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${currency === item ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <Label className="text-xs">Price ({currency})</Label>
                    <Input type="number" min="0" step="0.01" placeholder={currency === 'INR' ? '499' : '9.99'} value={price} onChange={(event) => setPrice(event.target.value)} className="h-9" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Problem 8: Full-screen Sheet preview showing current editor state --- */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Article Preview</SheetTitle>
            <SheetDescription>Preview of how this post will look — always shows the current editor state.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {coverImage ? (
                <img src={coverImage} alt={title || 'Post cover'} className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-56 items-center justify-center bg-gray-100 text-sm text-gray-400">No cover image</div>
              )}
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{category}</Badge>
                  <Badge variant={status === 'published' ? 'default' : status === 'unlisted' ? 'outline' : 'secondary'}>
                    {status === 'published' ? 'Published' : status === 'unlisted' ? 'Unlisted' : 'Draft'}
                  </Badge>
                  <span className="text-xs text-slate-500">{readingTime} min read</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{title || 'Untitled post'}</h3>
                {excerpt && <p className="text-sm text-gray-500">{excerpt}</p>}
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <div
                  className="prose prose-sm max-w-none prose-headings:font-heading prose-p:text-slate-800 prose-li:text-slate-800 prose-img:rounded-lg prose-img:shadow-sm"
                  dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-400">No content yet.</p>' }}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateBlog;
