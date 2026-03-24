import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { ArrowLeft, Upload, Save, File, Link as LinkIcon, Plus, Trash2, ChevronUp, ChevronDown, BookOpen } from 'lucide-react';

const RESOURCE_TYPES = ['Article', 'PDF', 'File', 'Video', 'Guide'];

interface ChapterDraft {
  id: string;
  title: string;
  slug: string;
  content: string;
  order_index: number;
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CreateResource = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('File');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('0');
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Guide chapters state
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number | null>(null);

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const selectedFile = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }
    setFile(selectedFile);
  }
};

  const uploadFileToStorage = async (fileToUpload: File) => {
    const nameParts = fileToUpload.name.split('.');
    const fileExt = nameParts.length > 1 ? nameParts.pop() : 'bin';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `resources/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filePath, fileToUpload);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('resources').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Chapter management
  const addChapter = () => {
    const newChapter: ChapterDraft = {
      id: uuidv4(),
      title: `Chapter ${chapters.length + 1}`,
      slug: `chapter-${chapters.length + 1}`,
      content: '',
      order_index: chapters.length,
    };
    setChapters([...chapters, newChapter]);
    setActiveChapterIdx(chapters.length);
  };

  const updateChapter = (idx: number, field: keyof ChapterDraft, value: string) => {
    const updated = [...chapters];
    (updated[idx] as any)[field] = value;
    if (field === 'title') {
      updated[idx].slug = slugify(value);
    }
    setChapters(updated);
  };

  const removeChapter = (idx: number) => {
    const updated = chapters.filter((_, i) => i !== idx);
    updated.forEach((c, i) => (c.order_index = i));
    setChapters(updated);
    if (activeChapterIdx === idx) setActiveChapterIdx(null);
    else if (activeChapterIdx && activeChapterIdx > idx) setActiveChapterIdx(activeChapterIdx - 1);
  };

  const moveChapter = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= chapters.length) return;
    const updated = [...chapters];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updated.forEach((c, i) => (c.order_index = i));
    setChapters(updated);
    if (activeChapterIdx === idx) setActiveChapterIdx(newIdx);
    else if (activeChapterIdx === newIdx) setActiveChapterIdx(idx);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a Resource Title');
      return;
    }
    
    if ((type === 'PDF' || type === 'File') && !file && !fileUrl) {
      toast.error('Please upload a file or provide a URL for this resource.');
      return;
    }
    
    if (type === 'Video' && !fileUrl) {
      toast.error('Please provide a video URL.');
      return;
    }

    if (type === 'Guide' && chapters.length === 0) {
      toast.error('Please add at least one chapter to your guide.');
      return;
    }

    setIsPublishing(true);

    try {
      let finalUrl = fileUrl;

      if (file) {
        toast('Uploading file...');
        finalUrl = await uploadFileToStorage(file);
      }

      const { data: insertedResource, error } = await supabase.from('resources').insert([
        {
          title,
          description,
          type,
          content: '',
          file_url: type === 'Guide' ? '' : finalUrl,
          is_paid: isPaid,
          price: isPaid ? (parseFloat(price) || 0) : 0,
        },
      ]).select('id').single();

      if (error) {
        console.error('Error inserting resource:', error);
        toast.error('Failed to publish resource: ' + error.message);
        return;
      }

      // Insert chapters if this is a Guide
      if (type === 'Guide' && insertedResource) {
        const chapterInserts = chapters.map((ch) => ({
          resource_id: insertedResource.id,
          title: ch.title,
          slug: ch.slug || slugify(ch.title),
          content: ch.content,
          order_index: ch.order_index,
        }));

        const { error: chError } = await supabase
          .from('guide_chapters')
          .insert(chapterInserts);

        if (chError) {
          console.error('Error inserting chapters:', chError);
          toast.error('Resource created but chapters failed: ' + chError.message);
          // Clean up the orphaned resource record
          await supabase.from('resources').delete().eq('id', insertedResource.id);
          return;
        }
      }

      toast.success('Resource published successfully!');
      navigate('/admin/resources');
    } catch (err: any) {
      toast.error('An error occurred: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/resources')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Resource</h1>
          <p className="text-gray-500 mt-1">Upload files, PDFs, link videos, or create guides.</p>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-8">
        <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm flex flex-col items-start gap-4 md:flex-row md:items-end">
          <div className="space-y-2 w-full">
            <Label htmlFor="title">Resource Title</Label>
            <Input
              id="title"
              placeholder="e.g. Complete React Cheatsheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 w-full md:max-w-[250px]">
            <Label>Resource Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === 'Guide' ? '📖 Guide (Chapters)' : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* File Upload (non-Guide types) */}
        {type !== 'Guide' && (
          <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2 font-medium text-sm text-gray-700">
              {type === 'Video' ? <LinkIcon className="h-4 w-4" /> : <File className="h-4 w-4" />}
              {type === 'Video' ? 'Video Details' : 'File Upload'}
            </div>
            
            {(type === 'PDF' || type === 'File') && (
              <div className="space-y-4 p-4 border rounded-md bg-gray-50/50 outline-dashed outline-2 outline-gray-200 outline-offset-[-2px]">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <Label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline font-medium">
                    Click to upload
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept={type === 'PDF' ? '.pdf' : '*/*'}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {file ? file.name : `SVG, PNG, JPG, PDF or GIF (max. 10MB)`}
                  </p>
                </div>
              </div>
            )}

            {(type === 'Video' || type === 'Article') && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="url">External Link URL (Optional for files)</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required={type === 'Video'}
                />
              </div>
            )}
          </div>
        )}

        {/* Guide Chapter Editor */}
        {type === 'Guide' && (
          <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-medium text-sm text-gray-700">
                <BookOpen className="h-4 w-4" />
                Guide Chapters ({chapters.length})
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addChapter} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Chapter
              </Button>
            </div>

            {chapters.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No chapters yet. Click "Add Chapter" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className="border rounded-lg overflow-hidden">
                    {/* Chapter Header - always visible */}
                    <div
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        activeChapterIdx === idx ? 'bg-blue-50 border-b' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveChapterIdx(activeChapterIdx === idx ? null : idx)}
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateChapter(idx, 'title', e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-transparent border-none focus:outline-none font-medium text-sm text-gray-800"
                        placeholder="Chapter title..."
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); moveChapter(idx, 'up'); }}
                          disabled={idx === 0}
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); moveChapter(idx, 'down'); }}
                          disabled={idx === chapters.length - 1}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => { e.stopPropagation(); removeChapter(idx); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Chapter Content Editor */}
                    {activeChapterIdx === idx && (
                      <div className="p-4 bg-white">
                        <Label className="text-xs text-gray-500 mb-2 block">Chapter Content</Label>
                        <RichTextEditor
                          content={chapter.content}
                          onChange={(html) => updateChapter(idx, 'content', html)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 bg-white p-6 rounded-lg border shadow-sm">
          <Label>Description <span className="text-gray-400 font-normal">(Optional)</span></Label>
          <RichTextEditor content={description} onChange={setDescription} />
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg border shadow-sm flex flex-col items-start">
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="space-y-0.5">
              <Label htmlFor="paid-toggle" className="text-base">Paid Resource</Label>
              <p className="text-sm text-gray-500">Require payment to download or view.</p>
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
                placeholder="19.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={isPaid}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/resources')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPublishing} className="gap-2">
            {isPublishing ? (
              <>Publishing...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publish Resource
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateResource;
