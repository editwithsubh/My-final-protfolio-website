import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Unlink,
  List,
  ListOrdered,
  Minus,
  Paintbrush,
  Quote,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Table as TableIcon,
  Type,
  Underline as UnderlineIcon,
  Undo,
  X,
  Youtube as YoutubeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

const ToolbarButton = ({ onClick, active, disabled, icon: Icon, title }: ToolbarButtonProps) => (
  <Toggle
    size="sm"
    pressed={active}
    onPressedChange={() => onClick()}
    disabled={disabled}
    title={title}
    aria-label={title}
    className="h-8 w-8 p-0"
  >
    <Icon className="h-3.5 w-3.5" />
  </Toggle>
);

const RichTextEditor = ({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'visual' | 'html' | 'preview'>('visual');

  // --- Problem 2: Popover state for Link & YouTube ---
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [youtubePopoverOpen, setYoutubePopoverOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        protocols: ['http', 'https', 'mailto'],
        validate: (href) => /^https?:\/\/|^mailto:/i.test(href),
      }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule,
      Youtube.configure({ controls: false, nocookie: true }),
      CharacterCount,
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[500px] p-5 focus:outline-none prose prose-sm max-w-none prose-headings:font-heading prose-p:text-gray-800 prose-li:text-gray-800 prose-blockquote:border-l-4 prose-blockquote:border-orange prose-blockquote:pl-4 prose-img:rounded-lg prose-img:shadow-sm',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', { emitUpdate: false });
    }
  }, [content, editor]);

  // --- Problem 1: Force editor sync when switching back to visual mode ---
  const handleModeChange = useCallback(
    (newMode: 'visual' | 'html' | 'preview') => {
      if (mode === 'html' && newMode === 'visual' && editor) {
        // Force the Tiptap editor to reflect the latest HTML from the textarea
        editor.commands.setContent(content || '', { emitUpdate: false });
      }
      setMode(newMode);
    },
    [mode, content, editor]
  );

  const uploadImage = useCallback(async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `blog-images/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('resources').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('resources').getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        toast.success('Image uploaded');
      } catch (error) {
        console.error('Image upload failed', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        if (message.toLowerCase().includes('bucket not found')) {
          toast.error('Image upload failed: create a public Supabase Storage bucket named "resources" first.');
        } else {
          toast.error(`Image upload failed: ${message}`);
        }
      } finally {
        event.target.value = '';
      }
    },
    [editor, uploadImage]
  );

  // --- Problem 2: Replace window.prompt with popover handlers ---
  const handleLinkPopoverOpen = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href ?? '';
    setLinkUrl(previousUrl);
    setLinkPopoverOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else if (!/^https?:\/\/|^mailto:/i.test(linkUrl)) {
      toast.error('Only http, https, and mailto URLs are allowed.');
      return;
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkPopoverOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkPopoverOpen(false);
    setLinkUrl('');
  }, [editor]);

  const applyYoutube = useCallback(() => {
    if (!youtubeUrl || !editor) return;
    editor.commands.setYoutubeVideo({ src: youtubeUrl });
    setYoutubePopoverOpen(false);
    setYoutubeUrl('');
  }, [editor, youtubeUrl]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  // --- Problem 3: Color picker handler ---
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editor?.chain().focus().setColor(e.target.value).run();
    },
    [editor]
  );

  const clearColor = useCallback(() => {
    editor?.chain().focus().unsetColor().run();
  }, [editor]);

  // --- Improvement A: Clear formatting ---
  const clearFormatting = useCallback(() => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  if (!editor) return null;

  const wordCount = editor.storage.characterCount?.words() ?? 0;
  const charCount = editor.storage.characterCount?.characters() ?? 0;
  const activeColor = editor.getAttributes('textStyle').color || '';

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm">
      {/* Mode switcher bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {(['visual', 'html', 'preview'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleModeChange(item)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${mode === item ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">Paste raw HTML in HTML mode to edit imported post markup.</p>
      </div>

      {/* --- Problem 4 & 5: Sticky toolbar with consistent separators --- */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-gray-50/80 p-2">
        {/* Group 1: Undo/Redo */}
        <ToolbarButton
          icon={Undo}
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        />
        <ToolbarButton
          icon={Redo}
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        />

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Group 2: Headings */}
        <ToolbarButton icon={Heading1} active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1" />
        <ToolbarButton icon={Heading2} active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2" />
        <ToolbarButton icon={Heading3} active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3" />

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Group 3: Text formatting (Bold/Italic/Underline/Strike/Highlight/Code/Color/ClearFormatting) */}
        <ToolbarButton icon={Bold} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold" />
        <ToolbarButton icon={Italic} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic" />
        <ToolbarButton icon={UnderlineIcon} active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline" />
        <ToolbarButton icon={Strikethrough} active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough" />
        <ToolbarButton icon={Highlighter} active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight" />
        <ToolbarButton icon={Code} active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code" />

        {/* Problem 3: Color picker button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="h-8 w-8 p-0"
            title="Text color"
            onClick={() => colorInputRef.current?.click()}
          >
            <Paintbrush className="h-3.5 w-3.5" />
            {activeColor && (
              <span
                className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: activeColor }}
              />
            )}
          </Button>
          <input
            ref={colorInputRef}
            type="color"
            value={activeColor || '#000000'}
            onChange={handleColorChange}
            className="invisible absolute left-0 top-0 h-0 w-0"
            tabIndex={-1}
          />
        </div>
        {activeColor && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
            title="Clear text color"
            onClick={clearColor}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Improvement A: Clear formatting */}
        <ToolbarButton icon={RemoveFormatting} active={false} onClick={clearFormatting} title="Clear formatting" />

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Group 4: Alignment */}
        <ToolbarButton icon={AlignLeft} active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left" />
        <ToolbarButton icon={AlignCenter} active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center" />
        <ToolbarButton icon={AlignRight} active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right" />

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Group 5: Lists/Blockquote/CodeBlock/HRule */}
        <ToolbarButton icon={List} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list" />
        <ToolbarButton icon={ListOrdered} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list" />
        <ToolbarButton icon={Quote} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote" />
        <ToolbarButton icon={Type} active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block" />
        <Button variant="ghost" size="sm" type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="h-8 w-8 p-0" title="Horizontal rule">
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Group 6: Link/Image/YouTube/Table */}
        {/* Problem 2: Link popover */}
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleLinkPopoverOpen}
              className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
              title="Insert link"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-3 p-3" align="start">
            <p className="text-xs font-medium text-slate-700">Insert Link</p>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
              }}
              className="h-8 text-sm"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button size="sm" type="button" onClick={applyLink} className="h-7 gap-1 text-xs">
                <LinkIcon className="h-3 w-3" /> Apply
              </Button>
              {editor.isActive('link') && (
                <Button size="sm" type="button" variant="outline" onClick={removeLink} className="h-7 gap-1 text-xs text-red-600 hover:text-red-700">
                  <Unlink className="h-3 w-3" /> Remove link
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" type="button" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 p-0" title="Upload image">
          <ImageIcon className="h-3.5 w-3.5" />
        </Button>

        {/* Problem 2: YouTube popover */}
        <Popover open={youtubePopoverOpen} onOpenChange={setYoutubePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" type="button" className="h-8 w-8 p-0" title="Embed YouTube">
              <YoutubeIcon className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-3 p-3" align="start">
            <p className="text-xs font-medium text-slate-700">Embed YouTube Video</p>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyYoutube(); }
              }}
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" type="button" onClick={applyYoutube} className="h-7 gap-1 text-xs" disabled={!youtubeUrl}>
              <YoutubeIcon className="h-3 w-3" /> Embed
            </Button>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" type="button" onClick={insertTable} className="h-8 w-8 p-0" title="Insert table">
          <TableIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* --- Problem 5: Expanded editor area --- */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'visual' && (
          <EditorContent
            editor={editor}
            className="[&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:outline-none [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_img]:max-h-[420px] [&_.ProseMirror_img]:w-full [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:p-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:bg-gray-100 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_iframe]:aspect-video [&_.ProseMirror_iframe]:w-full [&_.ProseMirror_iframe]:rounded-lg"
          />
        )}

        {mode === 'html' && (
          <div className="space-y-3 p-4">
            <textarea
              value={content}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-[500px] w-full rounded-md border-2 border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none focus:border-slate-900"
              placeholder="Paste HTML here to import a post, then edit tags, text, and structure directly."
            />
          </div>
        )}

        {mode === 'preview' && (
          <div className="min-h-[500px] bg-slate-50 p-5">
            <div
              className="prose prose-sm max-w-none prose-headings:font-heading prose-p:text-slate-800 prose-li:text-slate-800 prose-img:rounded-lg prose-img:shadow-sm"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-400">Nothing to preview yet.</p>' }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 border-t border-slate-200 bg-gray-50/80 px-5 py-2 text-xs text-slate-500">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
};

export default RichTextEditor;
