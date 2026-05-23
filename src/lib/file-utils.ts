// lib/file-utils.ts
import { UploadedFile } from "@/types/file-upload.types";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const getFileType = (file: File): string => {
  return file.type.split("/")[0];
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith("video/");
};

export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith("audio/");
};

export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf";
};

export const generateFileId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createUploadedFile = (file: File): UploadedFile => {
  let preview: string | undefined = undefined;

  if (isImageFile(file)) {
    preview = URL.createObjectURL(file);
  }

  return {
    id: generateFileId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    preview,
    status: "pending",
  };
};

export const revokePreviewUrls = (files: UploadedFile[]): void => {
  files.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
};

export const validateFile = (
  file: File,
  accept?: string | string[],
  maxSize?: number
): { valid: boolean; error?: string } => {
  // Check file type
  if (accept) {
    const acceptTypes = Array.isArray(accept) ? accept : [accept];
    const isValidType = acceptTypes.some((type) => {
      if (type.endsWith("/*")) {
        const mainType = type.slice(0, -2);
        return file.type.startsWith(mainType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return {
        valid: false,
        error: `File type not accepted. Accepted: ${acceptTypes.join(", ")}`,
      };
    }
  }

  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${formatFileSize(maxSize)}`,
    };
  }

  return { valid: true };
};
