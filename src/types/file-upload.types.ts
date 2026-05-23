// types/file-upload.types.ts
import { ReactNode } from "react";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  preview?: string;
  progress?: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export interface FileUploadProps {
  // Core
  value?: UploadedFile[] | UploadedFile | null;
  onChange?: (files: UploadedFile[] | UploadedFile | null) => void;
  mode?: "single" | "multiple";

  // Validation
  accept?: string | string[];
  maxSize?: number; // in bytes
  maxFiles?: number;
  minFiles?: number;
  required?: boolean;

  // Options
  disabled?: boolean;
  readOnly?: boolean;
  showPreview?: boolean;
  showSize?: boolean;
  showRemoveButton?: boolean;
  showDownloadButton?: boolean;
  showUploadButton?: boolean;
  autoUpload?: boolean;

  // Upload handling
  onUpload?: (file: UploadedFile) => Promise<string>;
  onUploadProgress?: (fileId: string, progress: number) => void;
  onUploadSuccess?: (file: UploadedFile, url: string) => void;
  onUploadError?: (file: UploadedFile, error: Error) => void;
  onRemove?: (file: UploadedFile) => void;
  onFileSelect?: (files: File[]) => void;

  // Labels
  label?: string;
  description?: string;
  buttonLabel?: string;
  dragDropText?: string;
  removeLabel?: string;
  downloadLabel?: string;

  // Styling
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;

  // Preview render
  renderPreview?: (file: UploadedFile, onRemove: () => void) => ReactNode;

  // Loading & Error
  loading?: boolean;
  error?: string;
}

export interface FilePreviewProps {
  file: UploadedFile;
  onRemove?: () => void;
  onDownload?: () => void;
  showSize?: boolean;
  showRemoveButton?: boolean;
  showDownloadButton?: boolean;
  className?: string;
}

export interface FileUploadDropzoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string | string[];
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  loading?: boolean;
  dragDropText?: string;
  className?: string;
}
