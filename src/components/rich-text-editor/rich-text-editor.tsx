// components/rich-text-editor/rich-text-editor.tsx
"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RichTextEditorProps } from "@/types/rich-text-editor.types";
import { ToolbarButton } from "./toolbar-button";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Undo,
  Redo,
  Eraser,
} from "lucide-react";
import { Button } from "../ui/button";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  features = {
    heading: true,
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    bulletList: true,
    orderedList: true,
    taskList: true,
    blockquote: true,
    code: true,
    codeBlock: true,
    link: true,
    image: true,
    horizontalRule: true,
    clearFormatting: true,
    undoRedo: true,
    textAlign: true,
    highlight: true,
  },
  onImageUpload,
  maxLength,
  showCharCount = false,
  className,
  editorClassName,
  minHeight = 200,
  maxHeight = 500,
  toolbarPosition = "top",
  toolbarVariant = "default",
  loading = false,
  error,
  onFocus,
  onBlur,
  onEditorReady,
}: RichTextEditorProps) {
  const [charCount, setCharCount] = React.useState(0);
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkText, setLinkText] = React.useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: value,
    editable: !disabled && !readOnly && !loading,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4",
          editorClassName
        ),
        style: `min-height: ${
          typeof minHeight === "number" ? minHeight + "px" : minHeight
        }; max-height: ${
          typeof maxHeight === "number" ? maxHeight + "px" : maxHeight
        }; overflow-y: auto;`,
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const image = items.find((item) => item.type.startsWith("image"));

        if (image) {
          event.preventDefault();
          const file = image.getAsFile();
          if (file && onImageUpload) {
            onImageUpload(file).then((url) => {
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({ src: url })
                )
              );
            });
          }
          return true; // Menangani event
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);

      if (showCharCount) {
        const text = editor.getText();
        setCharCount(text.length);
      }
    },
    onFocus: onFocus,
    onBlur: onBlur,
  });

  React.useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }

    setIsLinkModalOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  const addImage = () => {
    if (!editor || !onImageUpload) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}
        <div className="rounded-md border bg-muted/20 p-4">
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse bg-muted rounded" />
            <div className="h-4 w-3/4 animate-pulse bg-muted rounded" />
            <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          className={
            required
              ? "after:content-['*'] after:ml-0.5 after:text-red-500"
              : ""
          }
        >
          {label}
        </Label>
      )}

      <div className="rounded-md border overflow-hidden">
        {/* Toolbar */}
        {toolbarVariant !== "bubble" && toolbarPosition === "top" && (
          <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-1">
            {features.undoRedo && (
              <>
                <ToolbarButton
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  icon={<Undo className="h-4 w-4" />}
                  label="Undo"
                />
                <ToolbarButton
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  icon={<Redo className="h-4 w-4" />}
                  label="Redo"
                />
                <div className="w-px h-6 bg-border mx-1" />
              </>
            )}

            {features.bold && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editor?.isActive("bold")}
                icon={<Bold className="h-4 w-4" />}
                label="Bold"
              />
            )}

            {features.italic && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editor?.isActive("italic")}
                icon={<Italic className="h-4 w-4" />}
                label="Italic"
              />
            )}

            {features.underline && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                isActive={editor?.isActive("underline")}
                icon={<UnderlineIcon className="h-4 w-4" />}
                label="Underline"
              />
            )}

            {features.strike && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                isActive={editor?.isActive("strike")}
                icon={<Strikethrough className="h-4 w-4" />}
                label="Strikethrough"
              />
            )}

            {features.highlight && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
                isActive={editor?.isActive("highlight")}
                icon={<Highlighter className="h-4 w-4" />}
                label="Highlight"
              />
            )}

            <div className="w-px h-6 bg-border mx-1" />

            {features.textAlign && (
              <>
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor?.isActive({ textAlign: "left" })}
                  icon={<AlignLeft className="h-4 w-4" />}
                  label="Align Left"
                />
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor?.isActive({ textAlign: "center" })}
                  icon={<AlignCenter className="h-4 w-4" />}
                  label="Align Center"
                />
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor?.isActive({ textAlign: "right" })}
                  icon={<AlignRight className="h-4 w-4" />}
                  label="Align Right"
                />
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("justify").run()
                  }
                  isActive={editor?.isActive({ textAlign: "justify" })}
                  icon={<AlignJustify className="h-4 w-4" />}
                  label="Justify"
                />
                <div className="w-px h-6 bg-border mx-1" />
              </>
            )}

            {features.bulletList && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editor?.isActive("bulletList")}
                icon={<List className="h-4 w-4" />}
                label="Bullet List"
              />
            )}

            {features.orderedList && (
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                isActive={editor?.isActive("orderedList")}
                icon={<ListOrdered className="h-4 w-4" />}
                label="Numbered List"
              />
            )}

            {features.taskList && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                isActive={editor?.isActive("taskList")}
                icon={<CheckSquare className="h-4 w-4" />}
                label="Task List"
              />
            )}

            {features.blockquote && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                isActive={editor?.isActive("blockquote")}
                icon={<Quote className="h-4 w-4" />}
                label="Quote"
              />
            )}

            {features.code && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCode().run()}
                isActive={editor?.isActive("code")}
                icon={<Code className="h-4 w-4" />}
                label="Inline Code"
              />
            )}

            {features.codeBlock && (
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                isActive={editor?.isActive("codeBlock")}
                icon={<Code2 className="h-4 w-4" />}
                label="Code Block"
              />
            )}

            {features.link && (
              <ToolbarButton
                onClick={() => setIsLinkModalOpen(true)}
                isActive={editor?.isActive("link")}
                icon={<LinkIcon className="h-4 w-4" />}
                label="Add Link"
              />
            )}

            {features.image && onImageUpload && (
              <ToolbarButton
                onClick={addImage}
                icon={<ImageIcon className="h-4 w-4" />}
                label="Add Image"
              />
            )}

            {features.horizontalRule && (
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().setHorizontalRule().run()
                }
                icon={<Minus className="h-4 w-4" />}
                label="Horizontal Rule"
              />
            )}

            {features.clearFormatting && (
              <>
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton
                  onClick={() => editor?.chain().focus().unsetAllMarks().run()}
                  icon={<Eraser className="h-4 w-4" />}
                  label="Clear Formatting"
                />
              </>
            )}
          </div>
        )}

        {/* Editor Content */}
        <EditorContent editor={editor} className="focus:outline-none" />

        {/* Character Counter */}
        {showCharCount && maxLength && (
          <div className="border-t px-3 py-2 text-right">
            <span
              className={cn(
                "text-xs",
                charCount > maxLength
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {charCount} / {maxLength} characters
            </span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-background p-6 shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Insert Link</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Link Text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLinkModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={setLink}>Insert Link</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
