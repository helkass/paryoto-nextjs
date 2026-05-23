// lib/image-utils.ts
import { ImageFile } from "@/types/image-upload.types";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const generateImageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createImageFile = (file: File): ImageFile => {
  const preview = URL.createObjectURL(file);

  return {
    id: generateImageId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    preview,
    status: "pending",
  };
};

export const revokeImageUrls = (images: ImageFile[]): void => {
  images.forEach((image) => {
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }
    if (image.croppedPreview) {
      URL.revokeObjectURL(image.croppedPreview);
    }
  });
};

export const validateImage = (
  file: File,
  options: {
    accept?: string[];
    maxSize?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
  }
): { valid: boolean; error?: string } => {
  // Check file type
  if (options.accept && options.accept.length > 0) {
    const isValidType = options.accept.some((type) => file.type === type);
    if (!isValidType) {
      return {
        valid: false,
        error: `File type not accepted. Accepted: ${options.accept.join(", ")}`,
      };
    }
  }

  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${formatFileSize(options.maxSize)}`,
    };
  }

  return { valid: true };
};

export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
