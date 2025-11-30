import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, List, ListOrdered,
    Quote, Code, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                // Disable link from StarterKit since we're adding it separately
                link: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] max-h-[500px] overflow-y-auto px-4 py-3',
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;

        const url = window.prompt('Image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="rich-text-editor border border-border rounded-lg overflow-hidden bg-background">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
                {/* Text Formatting */}
                <div className="flex gap-0.5 border-r border-border pr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('underline') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('strike') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </button>
                </div>

                {/* Headings */}
                <div className="flex gap-0.5 border-r border-border pr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </button>
                </div>

                {/* Lists */}
                <div className="flex gap-0.5 border-r border-border pr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex gap-0.5 border-r border-border pr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-muted text-primary' : ''
                            }`}
                        title="Justify"
                    >
                        <AlignJustify className="h-4 w-4" />
                    </button>
                </div>

                {/* Other */}
                <div className="flex gap-0.5 border-r border-border pr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('blockquote') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('codeBlock') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Code Block"
                    >
                        <Code className="h-4 w-4" />
                    </button>
                </div>

                {/* Media */}
                <div className="flex gap-0.5 border-r border-border pr-1">
                    <button
                        type="button"
                        onClick={setLink}
                        className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('link') ? 'bg-muted text-primary' : ''
                            }`}
                        title="Add Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded hover:bg-muted transition-colors"
                        title="Add Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-0.5">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} placeholder={placeholder} />

            <style>{`
                .ProseMirror {
                    color: hsl(var(--foreground));
                }
                
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: hsl(var(--muted-foreground));
                    pointer-events: none;
                    height: 0;
                }
                
                .ProseMirror:focus {
                    outline: none;
                }
                
                .ProseMirror h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }
                
                .ProseMirror h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }
                
                .ProseMirror h3 {
                    font-size: 1.25em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }
                
                .ProseMirror ul,
                .ProseMirror ol {
                    padding-left: 1.5em;
                    margin: 0.5em 0;
                }
                
                .ProseMirror blockquote {
                    border-left: 3px solid hsl(var(--primary));
                    padding-left: 1em;
                    margin: 0.5em 0;
                    font-style: italic;
                }
                
                .ProseMirror code {
                    background: hsl(var(--muted));
                    padding: 0.2em 0.4em;
                    border-radius: 0.25em;
                    font-family: monospace;
                }
                
                .ProseMirror pre {
                    background: hsl(var(--muted));
                    padding: 1em;
                    border-radius: 0.5em;
                    overflow-x: auto;
                }
                
                .ProseMirror pre code {
                    background: none;
                    padding: 0;
                }
                
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5em;
                    margin: 0.5em 0;
                }
                
                .ProseMirror a {
                    color: hsl(var(--primary));
                    text-decoration: underline;
                }
                
                .ProseMirror::-webkit-scrollbar {
                    width: 8px;
                }
                
                .ProseMirror::-webkit-scrollbar-track {
                    background: hsl(var(--muted));
                    border-radius: 4px;
                }
                
                .ProseMirror::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground));
                    border-radius: 4px;
                }
                
                .ProseMirror::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--foreground));
                }
            `}</style>
        </div>
    );
}
