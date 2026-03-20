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
import { ArrowLeft, Upload, Save, File, Link as LinkIcon } from 'lucide-react';

const RESOURCE_TYPES = ['Article', 'PDF', 'File', 'Video'];

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFileToStorage = async (fileToUpload: File) => {
    const fileExt = fileToUpload.name.split('.').pop();
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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a Resource Title');
      return;
    }
    
    // Validation based on type
    if ((type === 'PDF' || type === 'File') && !file && !fileUrl) {
      toast.error('Please upload a file or provide a URL for this resource.');
      return;
    }
    
    if (type === 'Video' && !fileUrl) {
      toast.error('Please provide a video URL.');
      return;
    }

    setIsPublishing(true);

    try {
      let finalUrl = fileUrl;

      // Only upload if user actually chose a file
      if (file) {
        toast('Uploading file...');
        finalUrl = await uploadFileToStorage(file);
      }

      const { error } = await supabase.from('resources').insert([
        {
          title,
          description, // Rich text
          type,
          content: '', // Used if type requires inline content
          file_url: finalUrl,
          is_paid: isPaid,
          price: isPaid ? parseFloat(price) : 0,
        },
      ]);

      if (error) {
        console.error('Error inserting resource:', error);
        toast.error('Failed to publish resource: ' + error.message);
      } else {
        toast.success('Resource published successfully!');
        navigate('/admin/resources');
      }
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
          <p className="text-gray-500 mt-1">Upload files, PDFs, or link videos.</p>
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
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
