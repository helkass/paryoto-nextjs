// types/rich-text-editor.types.ts
import { Editor } from "@tiptap/react";

export interface RichTextEditorProps {
  // Core
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;

  // Options
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Editor Features
  features?: {
    heading?: boolean | { levels: number[] };
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    bulletList?: boolean;
    orderedList?: boolean;
    taskList?: boolean;
    blockquote?: boolean;
    code?: boolean;
    codeBlock?: boolean;
    link?: boolean;
    image?: boolean;
    video?: boolean;
    table?: boolean;
    horizontalRule?: boolean;
    clearFormatting?: boolean;
    undoRedo?: boolean;
    textAlign?: boolean;
    textColor?: boolean;
    highlight?: boolean;
    fontSize?: boolean;
    fontFamily?: boolean;
  };

  // Upload handling
  onImageUpload?: (file: File) => Promise<string>;
  onVideoUpload?: (file: File) => Promise<string>;

  // Character limit
  maxLength?: number;
  showCharCount?: boolean;

  // Styling
  className?: string;
  editorClassName?: string;
  minHeight?: number | string;
  maxHeight?: number | string;

  // Toolbar
  toolbarPosition?: "top" | "bottom";
  toolbarVariant?: "default" | "bubble" | "floating";

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onFocus?: () => void;
  onBlur?: () => void;
  onEditorReady?: (editor: Editor) => void;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>;
  onError?: (error: Error) => void;
}
