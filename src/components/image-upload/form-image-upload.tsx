// components/image-upload/form-image-upload.tsx
"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ImagePreview } from "./image-preview";
import { ImageCropDialog } from "./image-crop-dialog";
import {
  createImageFile,
  revokeImageUrls,
  validateImage,
  getImageDimensions,
  formatFileSize,
} from "@/lib/image-utils";
import { ImageUploadProps, ImageFile } from "@/types/image-upload.types";

export function FormImageUpload({
  value,
  onChange,
  mode = "single",
  enableCrop = false,
  cropAspect = 1,
  cropShape = "rect",
  accept = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  minFiles,
  required = false,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  disabled = false,
  readOnly = false,
  showPreview = true,
  showRemoveButton = true,
  showDownloadButton = false,
  showCropButton = true,
  autoUpload = false,
  circularPreview = false,
  onUpload,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  onRemove,
  onCrop,
  label,
  description,
  buttonLabel = "Upload Images",
  removeLabel = "Remove",
  dragDropText = "Drag & drop images here or click to browse",
  className,
  dropzoneClassName,
  previewClassName,
  renderPreview,
  loading = false,
  error: externalError,
}: ImageUploadProps) {
  const [images, setImages] = React.useState<ImageFile[]>(() => {
    if (!value) return [];
    if (mode === "single" && value && !Array.isArray(value)) {
      return [value as ImageFile];
    }
    return (value as ImageFile[]) || [];
  });

  const [cropDialogOpen, setCropDialogOpen] = React.useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] =
    React.useState<ImageFile | null>(null);
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync with external value
  React.useEffect(() => {
    if (value) {
      if (mode === "single" && !Array.isArray(value)) {
        setImages([value as ImageFile]);
      } else if (Array.isArray(value)) {
        setImages(value);
      }
    } else {
      setImages([]);
    }
  }, [value, mode]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      revokeImageUrls(images);
    };
  }, [images]);

  const updateImages = (newImages: ImageFile[]) => {
    setImages(newImages);

    if (mode === "single") {
      onChange?.(newImages[0] || null);
    } else {
      onChange?.(newImages);
    }
  };

  const uploadImage = async (image: ImageFile): Promise<void> => {
    if (!onUpload) return;

    const imageIndex = images.findIndex((img) => img.id === image.id);
    if (imageIndex === -1) return;

    // Update status to uploading
    const updatedImages = [...images];
    updatedImages[imageIndex] = { ...image, status: "uploading", progress: 0 };
    updateImages(updatedImages);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        const currentImage = images[imageIndex];
        if (
          currentImage &&
          currentImage.status === "uploading" &&
          currentImage.progress !== undefined
        ) {
          const newProgress = Math.min((currentImage.progress || 0) + 10, 90);
          const progressImages = [...images];
          progressImages[imageIndex] = {
            ...currentImage,
            progress: newProgress,
          };
          updateImages(progressImages);
          onUploadProgress?.(image.id, newProgress);
        }
      }, 200);

      const url = await onUpload(image);

      clearInterval(progressInterval);

      // Update to success
      const successImages = [...images];
      successImages[imageIndex] = {
        ...image,
        status: "success",
        progress: 100,
      };
      updateImages(successImages);
      onUploadSuccess?.(image, url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload failed");
      const errorImages = [...images];
      errorImages[imageIndex] = {
        ...image,
        status: "error",
        error: error.message,
      };
      updateImages(errorImages);
      onUploadError?.(image, error);
    }
  };

  const handleFileSelect = async (selectedFiles: File[]) => {
    if (readOnly || disabled) return;

    // Validate dimensions for each file
    const validImages: ImageFile[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      // Validate file type and size
      const validation = validateImage(file, {
        accept,
        maxSize,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
      });
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      // Validate dimensions
      if (maxWidth || maxHeight || minWidth || minHeight) {
        const dimensions = await getImageDimensions(file);
        if (maxWidth && dimensions.width > maxWidth) {
          errors.push(`${file.name}: Width exceeds ${maxWidth}px`);
          continue;
        }
        if (maxHeight && dimensions.height > maxHeight) {
          errors.push(`${file.name}: Height exceeds ${maxHeight}px`);
          continue;
        }
        if (minWidth && dimensions.width < minWidth) {
          errors.push(`${file.name}: Width is less than ${minWidth}px`);
          continue;
        }
        if (minHeight && dimensions.height < minHeight) {
          errors.push(`${file.name}: Height is less than ${minHeight}px`);
          continue;
        }
      }

      const imageFile = createImageFile(file);
      validImages.push(imageFile);

      if (autoUpload && onUpload) {
        await uploadImage(imageFile);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(", "));
    }

    // Validate min files
    const totalFiles = images.length + validImages.length;
    if (minFiles && totalFiles < minFiles) {
      setError(`Minimum ${minFiles} image(s) required`);
      return;
    }

    // Validate max files
    if (mode === "multiple" && totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} image(s) allowed`);
      return;
    }

    setError(null);

    let updatedImages: ImageFile[];
    if (mode === "single") {
      // Replace existing image in single mode
      if (images.length > 0) {
        revokeImageUrls(images);
      }
      updatedImages = validImages.slice(0, 1);
    } else {
      updatedImages = [...images, ...validImages];
    }

    updateImages(updatedImages);
  };

  const handleRemoveImage = (imageToRemove: ImageFile) => {
    if (readOnly || disabled) return;

    // Revoke preview URLs
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    if (imageToRemove.croppedPreview) {
      URL.revokeObjectURL(imageToRemove.croppedPreview);
    }

    const updatedImages = images.filter((img) => img.id !== imageToRemove.id);
    updateImages(updatedImages);
    onRemove?.(imageToRemove);

    // Clear error if min files condition is met
    if (minFiles && updatedImages.length >= minFiles) {
      setError(null);
    }
  };

  const handleDownload = (image: ImageFile) => {
    const url = image.croppedPreview || image.preview;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = image.name;
      link.click();
    }
  };

  const handleOpenCrop = (image: ImageFile) => {
    setSelectedImageForCrop(image);
    setCropDialogOpen(true);
  };

  const handleCropConfirm = (croppedImage: ImageFile) => {
    const imageIndex = images.findIndex((img) => img.id === croppedImage.id);
    if (imageIndex !== -1) {
      const updatedImages = [...images];
      updatedImages[imageIndex] = croppedImage;
      updateImages(updatedImages);
      onCrop?.(croppedImage, { x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const handleUploadAll = async () => {
    if (!onUpload) return;

    setInternalLoading(true);

    for (const image of images) {
      if (image.status === "pending") {
        await uploadImage(image);
      }
    }

    setInternalLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          const reject = rejectedFiles[0];
          const errorMessage = reject.errors[0]?.message || "File rejected";
          setError(errorMessage);
          return;
        }
        handleFileSelect(acceptedFiles);
      },
      accept: accept?.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
      maxSize,
      multiple: mode === "multiple",
      disabled: disabled || loading || internalLoading,
      noClick: disabled,
      noKeyboard: disabled,
    });

  const isLoading = loading || internalLoading;
  const displayError = externalError || error;
  const showDropzone =
    !readOnly &&
    (mode === "multiple" ? images.length < maxFiles : images.length === 0);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      {label && (
        <Label
          className={cn(
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </Label>
      )}

      {/* Dropzone */}
      {showDropzone && (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 p-6",
            isDragActive && "border-primary bg-primary/5",
            isDragReject && "border-destructive bg-destructive/5",
            (disabled || isLoading) && "cursor-not-allowed opacity-60",
            !isDragActive &&
              !isDragReject &&
              "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            dropzoneClassName
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              {isDragActive ? "Drop images here" : dragDropText}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {accept.join(", ")} • Max {formatFileSize(maxSize)} each
            </p>
            {mode === "multiple" && (
              <p className="text-xs text-muted-foreground mt-1">
                Max {maxFiles} files
              </p>
            )}
          </div>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className={cn("space-y-2", previewClassName)}>
          {images.map((image) =>
            renderPreview ? (
              renderPreview(image, () => handleRemoveImage(image))
            ) : showPreview ? (
              <ImagePreview
                key={image.id}
                image={image}
                onRemove={() => handleRemoveImage(image)}
                onDownload={() => handleDownload(image)}
                onCrop={enableCrop ? () => handleOpenCrop(image) : undefined}
                showRemoveButton={showRemoveButton && !readOnly}
                showDownloadButton={showDownloadButton}
                showCropButton={showCropButton && enableCrop && !readOnly}
                circular={circularPreview}
              />
            ) : (
              <div className="flex items-center justify-between p-2 rounded-lg border">
                <span className="text-sm truncate">{image.name}</span>
                {showRemoveButton && !readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveImage(image)}
                  >
                    {removeLabel}
                  </Button>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!readOnly && images.length > 0 && mode === "multiple" && (
        <div className="flex gap-2">
          {onUpload && images.some((img) => img.status === "pending") && (
            <Button
              type="button"
              onClick={handleUploadAll}
              disabled={isLoading}
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              {buttonLabel}
            </Button>
          )}
          {images.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                revokeImageUrls(images);
                updateImages([]);
              }}
              disabled={isLoading}
            >
              Remove All
            </Button>
          )}
        </div>
      )}

      {/* Description */}
      {description && !displayError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Error */}
      {displayError && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Min/Max info */}
      {minFiles && images.length < minFiles && (
        <p className="text-xs text-warning">
          Minimum {minFiles} image(s) required. {minFiles - images.length} more
          needed.
        </p>
      )}

      {/* Crop Dialog */}
      {enableCrop && selectedImageForCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          image={selectedImageForCrop}
          aspect={cropAspect}
          shape={cropShape}
          onClose={() => setCropDialogOpen(false)}
          onCropConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
