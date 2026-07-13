"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs rounded px-2 py-1 transition-colors ${
        active ? "bg-rotary-blue text-white" : "hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

function LinkPopover({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState<string>(editor.getAttributes("link").href ?? "");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  const apply = () => {
    const trimmed = url.trim();
    if (trimmed) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    onClose();
  };

  const remove = () => {
    editor.chain().focus().unsetLink().run();
    onClose();
  };

  return (
    <motion.div
      ref={boxRef}
      className="absolute z-10 top-full left-0 mt-1 flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-2 shadow-lg"
      initial={{ opacity: 0, scale: 0.96, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -4 }}
      transition={{ duration: reduced ? 0 : DURATION.fast, ease: EASE }}
    >
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            apply();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
          }
        }}
        placeholder="https://exemplo.com"
        className="w-56 rounded border border-neutral-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-rotary-blue"
      />
      <button
        type="button"
        onClick={apply}
        className="text-xs rounded bg-rotary-blue px-2 py-1 text-white hover:bg-rotary-blue-dark whitespace-nowrap"
      >
        Aplicar
      </button>
      {editor.isActive("link") && (
        <button
          type="button"
          onClick={remove}
          className="text-xs rounded px-2 py-1 text-neutral-500 hover:bg-neutral-100 whitespace-nowrap"
        >
          Remover
        </button>
      )}
    </motion.div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "rich-editor-content" },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-neutral-300 overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Negrito
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Itálico
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Lista
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Lista
        </ToolbarButton>
        <div className="relative">
          <ToolbarButton
            active={editor.isActive("link")}
            onClick={() => setLinkPopoverOpen((v) => !v)}
          >
            Link
          </ToolbarButton>
          <AnimatePresence>
            {linkPopoverOpen && (
              <LinkPopover editor={editor} onClose={() => setLinkPopoverOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>
      <EditorContent editor={editor} className="px-3 py-2 min-h-[160px] text-sm" />
    </div>
  );
}
