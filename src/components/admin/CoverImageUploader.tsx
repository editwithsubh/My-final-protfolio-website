import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

const CoverImageUploader = ({ value, onChange }: CoverImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `covers/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('resources').upload(path, file);
      if (error) throw error;

      const { data } = supabase.storage.from('resources').getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success('Cover image uploaded');
    } catch (error: any) {
      if ((error.message || '').toLowerCase().includes('bucket not found')) {
        toast.error('Upload failed: create a public Supabase Storage bucket named "resources" first.');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-gray-50 text-slate-900" style={{ aspectRatio: '21 / 9' }}>
        <img src={value} alt="Cover" className="h-full w-full object-cover" />
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute right-3 top-3 h-7 w-7 opacity-80 hover:opacity-100"
          onClick={() => onChange('')}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border-2 border-dashed border-slate-300 bg-gray-50/70 p-6 text-center text-slate-900">
      <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-700">
        Cover Image <span className="font-normal text-slate-500">(optional - shown in cards)</span>
      </p>

      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-100 hover:text-slate-900"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-3.5 w-3.5" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setMode(mode === 'url' ? 'upload' : 'url')}
        >
          Or paste URL
        </Button>
      </div>

      {mode === 'url' && (
        <div className="mx-auto flex max-w-md gap-2">
          <Input
            placeholder="https://..."
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            className="h-8 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 border border-orange bg-orange text-xs text-white shadow-none hover:bg-orange-dark"
            onClick={() => {
              if (!urlInput) return;
              onChange(urlInput);
              setUrlInput('');
            }}
          >
            Set
          </Button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

export default CoverImageUploader;
