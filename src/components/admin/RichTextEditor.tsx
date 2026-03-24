import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading2, Link as LinkIcon, Code } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        protocols: ['http', 'https', 'mailto'],
        validate: (href) => /^https?:\/\/|^mailto:/i.test(href),
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty — unset link
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Validate URL to prevent XSS via javascript: protocol
    if (!/^https?:\/\/|^mailto:/i.test(url)) {
      window.alert('Only http, https, and mailto URLs are allowed.');
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border rounded-md shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t-md">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-4 bg-gray-300 mx-1" />
        
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-4 bg-gray-300 mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive('codeBlock')}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code block"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Button
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
          type="button"
          aria-label="Insert link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[250px] prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
