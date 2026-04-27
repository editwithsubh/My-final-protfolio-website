import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  BookOpen,
  Eye,
  File,
  Globe,
  GripVertical,
  Link as LinkIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CoverImageUploader from '@/components/admin/CoverImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const RESOURCE_TYPES = ['Article', 'PDF', 'File', 'Video', 'Guide'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const CURRENCIES = ['INR', 'USD'] as const;
const BADGE_OPTIONS = ['', 'New', 'Best Seller', 'Featured', 'Popular'] as const;
const panelClass = 'space-y-3 rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm';
const RESOURCE_DRAFT_KEY = 'resource_draft';

interface ChapterDraft {
  id: string;
  title: string;
  slug: string;
  content: string;
  order_index: number;
  slugLocked?: boolean;
}

interface ChapterItemProps {
  chapter: ChapterDraft;
  idx: number;
  active: boolean;
  readTime: number;
  onToggle: () => void;
  onUpdate: (idx: number, field: keyof ChapterDraft, value: string) => void;
  onRemove: (idx: number) => void;
  children?: React.ReactNode;
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ');

const SortableChapterItem = ({ chapter, idx, active, readTime, onToggle, onUpdate, onRemove, children }: ChapterItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="overflow-hidden rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm">
      <div className={`cursor-pointer px-4 py-3 transition-colors ${active ? 'border-b border-slate-200 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={onToggle}>
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-1 text-gray-400 hover:text-gray-700"
            onClick={(event) => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">{idx + 1}</span>
          <div className="min-w-0 flex-1 space-y-1">
            <input
              type="text"
              value={chapter.title}
              onChange={(event) => onUpdate(idx, 'title', event.target.value)}
              onClick={(event) => event.stopPropagation()}
              className="w-full border-none bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
              placeholder="Chapter title..."
            />
            <input
              type="text"
              value={chapter.slug}
              onChange={(event) => onUpdate(idx, 'slug', slugify(event.target.value))}
              onClick={(event) => event.stopPropagation()}
              className="w-full border-none bg-transparent font-mono text-xs text-gray-400 focus:outline-none"
              placeholder="chapter-slug"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            <span>{readTime} min read</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(idx);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {active && <div className="space-y-2 bg-white p-4 text-slate-900">{children}</div>}
    </div>
  );
};

const CreateResource = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [title, setTitle] = useState('');
  const [type, setType] = useState('File');
  const [description, setDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [badge, setBadge] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [durationMinutes, setDurationMinutes] = useState('0');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredHome, setFeaturedHome] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);
  const [originalChapterIds, setOriginalChapterIds] = useState<string[]>([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editDraftOfferedRef = useRef(false);

  // Problem 10: Load draft for new resources
  useEffect(() => {
    if (isEditing) return;
    const savedDraft = localStorage.getItem(RESOURCE_DRAFT_KEY);
    if (!savedDraft) return;
    try {
      const parsed = JSON.parse(savedDraft);
      const savedAt = parsed._savedAt ? new Date(parsed._savedAt) : null;
      if (savedAt) {
        toast('Restore unsaved draft?', {
          description: `Draft from ${savedAt.toLocaleString()}`,
          duration: 10000,
          action: { label: 'Restore', onClick: () => {
            setTitle(parsed.title ?? '');
            setType(parsed.type ?? 'File');
            setDescription(parsed.description ?? '');
            setExcerpt(parsed.excerpt ?? '');
            setCoverImage(parsed.coverImage ?? '');
            setBadge(parsed.badge ?? '');
            setTags(parsed.tags ?? []);
            setDifficulty(parsed.difficulty ?? 'Beginner');
            setDurationMinutes(parsed.durationMinutes ?? '0');
            setIsPaid(parsed.isPaid ?? false);
            setPrice(parsed.price ?? '0');
            setCurrency((parsed.currency ?? 'INR') as 'INR' | 'USD');
            setFileUrl(parsed.fileUrl ?? '');
            setChapters(parsed.chapters ?? []);
            setActiveChapterIdx(parsed.chapters?.length > 0 ? 0 : null);
            toast.success('Draft restored');
          }},
          cancel: { label: 'Discard', onClick: () => {
            localStorage.removeItem(RESOURCE_DRAFT_KEY);
            toast.info('Draft discarded');
          }},
        });
      }
    } catch { localStorage.removeItem(RESOURCE_DRAFT_KEY); }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    const loadResource = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('resources').select('*').eq('id', id).single();
      if (error || !data) {
        toast.error('Failed to load resource');
        navigate('/admin/resources');
        return;
      }

      setTitle(data.title ?? '');
      setType(data.type ?? 'File');
      setDescription(data.description ?? '');
      setExcerpt(data.excerpt ?? '');
      setCoverImage(data.cover_image ?? '');
      setBadge(data.badge ?? '');
      setTags(data.tags ?? []);
      setDifficulty(data.difficulty ?? 'Beginner');
      setDurationMinutes(String(data.duration_minutes ?? 0));
      setStatus(data.status ?? 'published');
      setFeaturedHome(Boolean(data.featured_home));
      setIsPaid(Boolean(data.is_paid));
      setPrice(String(data.price ?? 0));
      setCurrency((data.currency ?? 'INR') as 'INR' | 'USD');
      setFileUrl(data.file_url ?? '');

      if ((data.type ?? 'File') === 'Guide') {
        const { data: chapterRows } = await supabase
          .from('guide_chapters')
          .select('*')
          .eq('resource_id', id)
          .order('order_index', { ascending: true });
        setChapters(chapterRows || []);
        setOriginalChapterIds((chapterRows || []).map((chapter: ChapterDraft) => chapter.id));
        setActiveChapterIdx((chapterRows || []).length > 0 ? 0 : null);
      }

      setLoading(false);

      // Problem 10: Check for edit draft
      if (!editDraftOfferedRef.current) {
        editDraftOfferedRef.current = true;
        const editDraftKey = `resource_draft_edit_${id}`;
        const saved = localStorage.getItem(editDraftKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const savedAt = parsed._savedAt ? new Date(parsed._savedAt) : null;
            if (savedAt) {
              toast('Restore unsaved changes?', {
                description: `Draft from ${savedAt.toLocaleString()}`,
                duration: 10000,
                action: { label: 'Restore', onClick: () => {
                  setTitle(parsed.title ?? data.title ?? '');
                  setDescription(parsed.description ?? data.description ?? '');
                  setExcerpt(parsed.excerpt ?? data.excerpt ?? '');
                  setTags(parsed.tags ?? data.tags ?? []);
                  setChapters(parsed.chapters ?? []);
                  toast.success('Draft restored');
                }},
                cancel: { label: 'Discard', onClick: () => {
                  localStorage.removeItem(editDraftKey);
                  toast.info('Draft discarded');
                }},
              });
            }
          } catch { localStorage.removeItem(editDraftKey); }
        }
      }
    };

    void loadResource();
  }, [id, isEditing, navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const uploadFileToStorage = async (fileToUpload: File) => {
    const nameParts = fileToUpload.name.split('.');
    const fileExt = nameParts.length > 1 ? nameParts.pop() : 'bin';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `resources/${fileName}`;
    const { error } = await supabase.storage.from('resources').upload(filePath, fileToUpload);
    if (error) {
      if ((error.message || '').toLowerCase().includes('bucket not found')) {
        throw new Error('Create a public Supabase Storage bucket named "resources" first.');
      }
      throw error;
    }
    return supabase.storage.from('resources').getPublicUrl(filePath).data.publicUrl;
  };

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== ',') return;
    event.preventDefault();
    const nextTag = tagInput.trim().toLowerCase();
    if (nextTag && !tags.includes(nextTag)) setTags((current) => [...current, nextTag]);
    setTagInput('');
  };

  const addChapter = () => {
    const newChapter: ChapterDraft = {
      id: uuidv4(),
      title: `Chapter ${chapters.length + 1}`,
      slug: `chapter-${uuidv4().slice(0, 8)}`,
      content: '',
      order_index: chapters.length,
    };
    setChapters((current) => [...current, newChapter]);
    setActiveChapterIdx(chapters.length);
  };

  // Problem 12: Only auto-generate slug if not manually edited
  const updateChapter = (idx: number, field: keyof ChapterDraft, value: string) => {
    setChapters((current) =>
      current.map((chapter, chapterIdx) => {
        if (chapterIdx !== idx) return chapter;
        if (field === 'title') {
          if (chapter.slugLocked) return { ...chapter, title: value };
          return { ...chapter, title: value, slug: slugify(value) || chapter.slug };
        }
        if (field === 'slug') return { ...chapter, slug: value, slugLocked: true };
        return { ...chapter, [field]: value };
      })
    );
  };

  const removeChapter = (idx: number) => {
    const next = chapters.filter((_, chapterIdx) => chapterIdx !== idx).map((chapter, orderIndex) => ({ ...chapter, order_index: orderIndex }));
    setChapters(next);
    if (activeChapterIdx === idx) setActiveChapterIdx(next.length ? 0 : null);
    else if (activeChapterIdx !== null && activeChapterIdx > idx) setActiveChapterIdx(activeChapterIdx - 1);
  };

  const chapterMetrics = useMemo(
    () => chapters.map((chapter) => Math.max(1, Math.ceil(stripHtml(chapter.content).split(/\s+/).filter(Boolean).length / 200))),
    [chapters]
  );

  const totalGuideMinutes = useMemo(() => chapterMetrics.reduce((sum, value) => sum + value, 0), [chapterMetrics]);

  // Problem 10: Auto-save with 3s debounce
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      const draftData = {
        title, type, description, excerpt, coverImage, badge, tags,
        difficulty, durationMinutes, isPaid, price, currency, fileUrl,
        chapters: chapters.map(c => ({ ...c })),
        _savedAt: new Date().toISOString(),
      };
      if (isEditing) {
        localStorage.setItem(`resource_draft_edit_${id}`, JSON.stringify(draftData));
      } else {
        localStorage.setItem(RESOURCE_DRAFT_KEY, JSON.stringify(draftData));
      }
      setLastSaved(new Date());
    }, 3000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [title, type, description, excerpt, coverImage, badge, tags, difficulty, durationMinutes, isPaid, price, currency, fileUrl, chapters, isEditing, id]);

  // Problem 10: beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((title || description) && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, description, isSubmitting]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setChapters((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = arrayMove(current, oldIndex, newIndex).map((chapter, orderIndex) => ({ ...chapter, order_index: orderIndex }));
      if (activeChapterIdx === oldIndex) setActiveChapterIdx(newIndex);
      else if (activeChapterIdx === newIndex) setActiveChapterIdx(oldIndex);
      return next;
    });
  };

  const handleSubmit = async (publishStatus: 'draft' | 'published') => {
    if (!title) return toast.error('Please enter a resource title');
    if ((type === 'PDF' || type === 'File') && !file && !fileUrl && !isEditing) return toast.error('Please upload a file or provide a URL.');
    if (type === 'Video' && !fileUrl) return toast.error('Please provide a video URL.');
    if (type === 'Guide' && chapters.length === 0) return toast.error('Please add at least one chapter.');

    setIsSubmitting(true);
    try {
      let finalUrl = fileUrl;
      if (file) {
        toast('Uploading file...');
        finalUrl = await uploadFileToStorage(file);
      }

      const payload = {
        title,
        description,
        excerpt,
        type,
        content: type === 'Guide' ? '' : description,
        file_url: type === 'Guide' ? '' : finalUrl,
        cover_image: coverImage,
        badge: badge || null,
        tags,
        status: publishStatus,
        featured_home: featuredHome,
        difficulty: type === 'Guide' ? difficulty : null,
        duration_minutes: Number(durationMinutes) || 0,
        is_paid: isPaid,
        price: isPaid ? parseFloat(price) || 0 : 0,
        currency: isPaid ? currency : 'INR',
      };

      const { data: savedResource, error } = await (isEditing
        ? supabase.from('resources').update(payload).eq('id', id).select('id').single()
        : supabase.from('resources').insert([payload]).select('id').single());

      if (error || !savedResource) throw error ?? new Error('Failed to save resource');

      if (type === 'Guide' && chapters.length > 0) {
        const chapterInserts = chapters.map((chapter, orderIndex) => ({
          id: chapter.id,
          resource_id: savedResource.id,
          title: chapter.title,
          slug: chapter.slug || slugify(chapter.title),
          content: chapter.content,
          order_index: orderIndex,
        }));

        if (isEditing) {
          const currentChapterIds = chapterInserts.map((chapter) => chapter.id);
          const removedChapterIds = originalChapterIds.filter((chapterId) => !currentChapterIds.includes(chapterId));

          if (removedChapterIds.length > 0) {
            const { error: deleteError } = await supabase
              .from('guide_chapters')
              .delete()
              .in('id', removedChapterIds);
            if (deleteError) throw deleteError;
          }

          const { error: chapterError } = await supabase
            .from('guide_chapters')
            .upsert(chapterInserts, { onConflict: 'id' });
          if (chapterError) throw chapterError;
          setOriginalChapterIds(currentChapterIds);
        } else {
          const { error: chapterError } = await supabase
            .from('guide_chapters')
            .insert(chapterInserts);
          if (chapterError) throw chapterError;
          setOriginalChapterIds(chapterInserts.map((chapter) => chapter.id));
        }
      }

      localStorage.removeItem(RESOURCE_DRAFT_KEY);
      if (isEditing && id) localStorage.removeItem(`resource_draft_edit_${id}`);
      toast.success(publishStatus === 'published' ? 'Resource published!' : 'Resource draft saved!');
      navigate('/admin/resources');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500">Loading resource editor...</div>;

  return (
    <>
      <div className="mx-auto max-w-7xl animate-in fade-in duration-500 pb-20 text-slate-900">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900" onClick={() => navigate('/admin/resources')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isEditing ? 'Edit Resource' : 'Create Resource'}</h1>
            <p className="text-sm text-slate-500">Upload files, link videos, or build guides with chapters.</p>
          </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-100 hover:text-slate-900" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-100 hover:text-slate-900" disabled={isSubmitting} onClick={() => handleSubmit('draft')}>
              <Save className="h-4 w-4" /> Save Draft
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
                <div className="rounded-lg border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="w-full space-y-2">
                      <Label htmlFor="title">Resource Title</Label>
                      <Input id="title" placeholder="e.g. Complete React Cheatsheet" value={title} onChange={(event) => setTitle(event.target.value)} required />
                    </div>
                    <div className="w-full space-y-2 md:max-w-[250px]">
                      <Label>Resource Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESOURCE_TYPES.map((resourceType) => (
                            <SelectItem key={resourceType} value={resourceType}>{resourceType}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <CoverImageUploader value={coverImage} onChange={setCoverImage} />

                {type !== 'Guide' && (
                  <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      {type === 'Video' ? <LinkIcon className="h-4 w-4" /> : <File className="h-4 w-4" />}
                      {type === 'Video' ? 'Video Details' : 'File Upload'}
                    </div>

                    {(type === 'PDF' || type === 'File') && (
                      <div className="rounded-md border bg-gray-50/50 p-4 outline-dashed outline-2 outline-gray-200 outline-offset-[-2px]">
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <Upload className="mb-2 h-8 w-8 text-gray-400" />
                          <Label htmlFor="file-upload" className="cursor-pointer font-medium text-blue-600 hover:underline">Click to upload</Label>
                          <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                          <p className="mt-2 text-sm text-gray-500">{file ? file.name : fileUrl ? 'Using existing file URL' : 'Choose a file to upload'}</p>
                        </div>
                      </div>
                    )}

                    {(type === 'Video' || type === 'Article' || type === 'PDF' || type === 'File') && (
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="url">External Link URL {type === 'Video' ? '' : '(optional)'}</Label>
                        <Input id="url" type="url" placeholder="https://..." value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} required={type === 'Video'} />
                      </div>
                    )}
                  </div>
                )}

                {type === 'Guide' && (
                  <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <BookOpen className="h-4 w-4" /> Guide Chapters ({chapters.length})
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addChapter} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Add Chapter
                      </Button>
                    </div>

                    {chapters.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed py-12 text-center text-gray-400">
                        <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
                        <p className="text-sm">No chapters yet. Click "Add Chapter" to get started.</p>
                      </div>
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={chapters.map((chapter) => chapter.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-3">
                            {chapters.map((chapter, idx) => (
                              <SortableChapterItem
                                key={chapter.id}
                                chapter={chapter}
                                idx={idx}
                                active={activeChapterIdx === idx}
                                readTime={chapterMetrics[idx]}
                                onToggle={() => setActiveChapterIdx(activeChapterIdx === idx ? null : idx)}
                                onUpdate={updateChapter}
                                onRemove={removeChapter}
                              >
                                {/* Problem 11: Only render editor for active chapter */}
                                <Label className="block text-xs text-gray-500">Chapter Content</Label>
                                {activeChapterIdx === idx ? (
                                  <RichTextEditor key={chapter.id} content={chapter.content} onChange={(html) => updateChapter(idx, 'content', html)} />
                                ) : (
                                  <p className="text-sm text-gray-400 italic truncate">{stripHtml(chapter.content).slice(0, 100) || 'No content yet'}</p>
                                )}
                              </SortableChapterItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                )}

                <div className="space-y-2 rounded-lg border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
                  <Label>Description</Label>
                  <RichTextEditor content={description} onChange={setDescription} placeholder="Describe the resource or write the main article body." />
                </div>
              </div>

              <div className="space-y-4">
                <Accordion type="multiple" defaultValue={["publishing", "badge", "tags"]} className="w-full space-y-4">
                  <AccordionItem value="publishing" className="rounded-lg border border-slate-300 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">Publishing</AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Status</span>
                        <Badge variant={status === 'published' ? 'default' : 'secondary'}>{status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Visibility</span>
                        <span className="font-medium">{isPaid ? 'Paid' : 'Public'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Show on homepage</span>
                        <Switch checked={featuredHome} onCheckedChange={setFeaturedHome} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="badge" className="rounded-lg border border-slate-300 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">Badge Label</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      <p className="text-xs text-slate-500">Shown on the resource card like Best Seller or New.</p>
                      <div className="flex flex-wrap gap-2">
                        {BADGE_OPTIONS.map((item) => (
                          <button
                            key={item || 'none'}
                            type="button"
                            onClick={() => setBadge(item)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${badge === item ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            {item || 'None'}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tags" className="rounded-lg border border-slate-300 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">Tags</AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <div className="flex min-h-[32px] flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            {tag}
                            <button type="button" onClick={() => setTags((current) => current.filter((item) => item !== tag))}><X className="h-3 w-3" /></button>
                          </span>
                        ))}
                      </div>
                      <Input placeholder="Add tag, press Enter..." value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={addTag} className="h-8 text-xs" />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 space-y-6 max-w-3xl">
            <div className="space-y-2 rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm">
              <Label className="text-sm font-medium">Excerpt</Label>
              <Textarea placeholder="Short summary for cards and previews..." value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} maxLength={300} className="resize-none" />
              <p className="text-right text-xs text-gray-400">{excerpt.length}/300</p>
            </div>

            <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
              <h3 className="text-sm font-medium text-slate-900 border-b pb-2 mb-4">Metadata</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-700">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty} disabled={type !== 'Guide'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Duration (minutes)</Label>
                  <Input type="number" min="0" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} />
                  {type === 'Guide' && <p className="text-xs text-slate-500 mt-1">Estimated total from chapters: {totalGuideMinutes} min</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">Paid Resource</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Require payment to download or view</p>
                </div>
                <Switch checked={isPaid} onCheckedChange={setIsPaid} />
              </div>
              {isPaid && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2 max-w-xs">
                    <Label>Currency</Label>
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
                    <Label>Price ({currency})</Label>
                    <Input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder={currency === 'INR' ? '499' : '9.99'} className="h-9" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Resource Preview</SheetTitle>
            <SheetDescription>Quick preview of how this resource will read before publishing.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {coverImage ? (
                <img src={coverImage} alt={title || 'Resource cover'} className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-56 items-center justify-center bg-gray-100 text-sm text-gray-400">No cover image</div>
              )}
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{type}</Badge>
                  {badge && <Badge className="bg-orange text-white hover:bg-orange">{badge}</Badge>}
                  {type === 'Guide' && <Badge variant="secondary">{difficulty}</Badge>}
                  <Badge variant={status === 'published' ? 'default' : 'secondary'}>{status}</Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{title || 'Untitled resource'}</h3>
                  <p className="mt-2 text-sm text-gray-500">{excerpt || 'Your excerpt will appear here in the public listing.'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description || '<p>No description yet.</p>' }} />
                {type === 'Guide' && (
                  <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900">Guide Outline</p>
                    {chapters.map((chapter, idx) => (
                      <div key={chapter.id} className="flex items-center justify-between text-sm text-gray-600">
                        <span>{idx + 1}. {chapter.title}</span>
                        <span>{chapterMetrics[idx]} min</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateResource;
