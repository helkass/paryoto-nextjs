// types/code-editor.types.ts
export type CodeLanguage =
  | "javascript"
  | "typescript"
  | "json"
  | "html"
  | "css"
  | "python"
  | "sql"
  | "yaml"
  | "markdown"
  | "xml"
  | "shell";

export interface CodeEditorProps {
  // Core
  value?: string;
  onChange?: (value: string) => void;
  language?: CodeLanguage;
  placeholder?: string;

  // Labels
  label?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Editor Options
  minHeight?: number | string;
  maxHeight?: number | string;
  tabSize?: number;
  lineNumbers?: boolean;
  highlight?: (code: string) => string;

  // JSON Specific
  jsonValidation?: boolean;
  jsonSchema?: object;

  // Actions
  showCopyButton?: boolean;
  showFormatButton?: boolean;
  showMinimizeButton?: boolean;
  showResetButton?: boolean;

  // Styling
  className?: string;
  editorClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onFormat?: (value: string) => string;
  onValidate?: (value: string) => { valid: boolean; error?: string };
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface CodeEditorToolbarProps {
  language: CodeLanguage;
  onLanguageChange?: (language: CodeLanguage) => void;
  onCopy: () => void;
  onFormat: () => void;
  onReset?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  showCopyButton?: boolean;
  showFormatButton?: boolean;
  showResetButton?: boolean;
  showMinimizeButton?: boolean;
  languages?: Array<{ value: CodeLanguage; label: string }>;
  disabled?: boolean;
}
