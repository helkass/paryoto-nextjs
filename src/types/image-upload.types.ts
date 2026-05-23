// types/image-upload.types.ts
import { ReactNode } from "react";

export interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  preview: string;
  croppedPreview?: string;
  croppedBlob?: Blob;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  progress?: number;
}

export interface ImageUploadProps {
  // Core
  value?: ImageFile | ImageFile[] | null;
  onChange?: (images: ImageFile | ImageFile[] | null) => void;
  mode?: "single" | "multiple";

  // Cropping
  enableCrop?: boolean;
  cropAspect?: number;
  cropShape?: "rect" | "round";
  cropRotation?: boolean;
  cropZoom?: boolean;
  minCropWidth?: number;
  minCropHeight?: number;
  maxCropWidth?: number;
  maxCropHeight?: number;

  // Validation
  accept?: string[];
  maxSize?: number; // in bytes
  maxFiles?: number;
  minFiles?: number;
  required?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;

  // Options
  disabled?: boolean;
  readOnly?: boolean;
  showPreview?: boolean;
  showRemoveButton?: boolean;
  showDownloadButton?: boolean;
  showCropButton?: boolean;
  autoUpload?: boolean;
  circularPreview?: boolean;

  // Upload handling
  onUpload?: (image: ImageFile) => Promise<string>;
  onUploadProgress?: (imageId: string, progress: number) => void;
  onUploadSuccess?: (image: ImageFile, url: string) => void;
  onUploadError?: (image: ImageFile, error: Error) => void;
  onRemove?: (image: ImageFile) => void;
  onCrop?: (image: ImageFile, croppedArea: CroppedArea) => void;

  // Labels
  label?: string;
  description?: string;
  buttonLabel?: string;
  cropButtonLabel?: string;
  removeLabel?: string;
  downloadLabel?: string;
  dragDropText?: string;

  // Styling
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  cropperClassName?: string;

  // Render
  renderPreview?: (image: ImageFile, onRemove: () => void) => ReactNode;

  // Loading & Error
  loading?: boolean;
  error?: string;
}

export interface ImageCropperProps {
  image: string;
  aspect?: number;
  shape?: "rect" | "round";
  rotation?: number;
  zoom?: number;
  minCropWidth?: number;
  minCropHeight?: number;
  maxCropWidth?: number;
  maxCropHeight?: number;
  onCropChange?: (area: CroppedArea) => void;
  onCropComplete?: (
    croppedArea: CroppedArea,
    croppedAreaPixels: CroppedArea
  ) => void;
  className?: string;
}

export interface ImagePreviewProps {
  image: ImageFile;
  onRemove?: () => void;
  onDownload?: () => void;
  onCrop?: () => void;
  showRemoveButton?: boolean;
  showDownloadButton?: boolean;
  showCropButton?: boolean;
  circular?: boolean;
  className?: string;
}
