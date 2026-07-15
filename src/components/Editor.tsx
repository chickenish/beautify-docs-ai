'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Paste your messy text or start writing here...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: content,
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

  return (
    <div className="w-full h-full min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-foreground p-4 shadow-sm relative">
      <div className="flex flex-wrap gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 text-xs text-muted-foreground">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 px-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 ${editor.isActive('bold') ? 'bg-zinc-100 dark:bg-zinc-800 font-bold' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 px-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 ${editor.isActive('italic') ? 'bg-zinc-100 dark:bg-zinc-800 font-bold' : ''}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="p-1.5 px-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Heading
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-1.5 px-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Bullet List
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert max-w-none min-h-[300px] focus:outline-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-table:w-full prose-th:border-b prose-th:pb-2 prose-td:py-2" 
      />
    </div>
  );
}