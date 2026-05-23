// components/file-upload/form-file-upload.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from "lucide-react";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { FilePreview } from "./file-preview";
import {
  createUploadedFile,
  revokePreviewUrls,
  validateFile,
} from "@/lib/file-utils";
import { FileUploadProps, UploadedFile } from "@/types/file-upload.types";

export function FormFileUpload({
  value,
  onChange,
  mode = "multiple",
  accept,
  maxSize,
  maxFiles = 10,
  minFiles,
  required = false,
  disabled = false,
  readOnly = false,
  showPreview = true,
  showSize = true,
  showRemoveButton = true,
  showDownloadButton = false,
  showUploadButton = true,
  autoUpload = false,
  onUpload,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  onRemove,
  onFileSelect,
  label,
  description,
  buttonLabel = "Upload Files",
  dragDropText = "Drag & drop files here or click to browse",
  removeLabel = "Remove",
  className,
  dropzoneClassName,
  previewClassName,
  renderPreview,
  loading = false,
  error: externalError,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>(() => {
    if (!value) return [];
    if (mode === "single" && value && !Array.isArray(value)) {
      return [value as UploadedFile];
    }
    return (value as UploadedFile[]) || [];
  });

  const [internalLoading, setInternalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync with external value
  React.useEffect(() => {
    if (value) {
      if (mode === "single" && !Array.isArray(value)) {
        setFiles([value as UploadedFile]);
      } else if (Array.isArray(value)) {
        setFiles(value);
      }
    } else {
      setFiles([]);
    }
  }, [value, mode]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      revokePreviewUrls(files);
    };
  }, [files]);

  const updateFiles = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);

    if (mode === "single") {
      onChange?.(newFiles[0] || null);
    } else {
      onChange?.(newFiles);
    }
  };

  const handleFileSelect = async (selectedFiles: File[]) => {
    if (readOnly || disabled) return;

    // Validate min files
    const totalFiles = files.length + selectedFiles.length;
    if (minFiles && totalFiles < minFiles) {
      setError(`Minimum ${minFiles} file(s) required`);
      return;
    }

    // Validate max files
    if (mode === "multiple" && totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    setError(null);

    const newUploadedFiles: UploadedFile[] = [];

    for (const file of selectedFiles) {
      // Validate file
      const validation = validateFile(file, accept, maxSize);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        continue;
      }

      const uploadedFile = createUploadedFile(file);

      if (autoUpload && onUpload) {
        await uploadFile(uploadedFile);
      }

      newUploadedFiles.push(uploadedFile);
    }

    let updatedFiles: UploadedFile[];
    if (mode === "single") {
      // Replace existing file in single mode
      if (files.length > 0) {
        revokePreviewUrls(files);
      }
      updatedFiles = newUploadedFiles.slice(0, 1);
    } else {
      updatedFiles = [...files, ...newUploadedFiles];
    }

    updateFiles(updatedFiles);
    onFileSelect?.(selectedFiles);
  };

  const uploadFile = async (file: UploadedFile): Promise<void> => {
    if (!onUpload) return;

    const fileIndex = files.findIndex((f) => f.id === file.id);
    if (fileIndex === -1) return;

    // Update status to uploading
    const updatedFiles = [...files];
    updatedFiles[fileIndex] = { ...file, status: "uploading", progress: 0 };
    updateFiles(updatedFiles);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        const currentFile = files[fileIndex];
        if (
          currentFile &&
          currentFile.status === "uploading" &&
          currentFile.progress !== undefined
        ) {
          const newProgress = Math.min((currentFile.progress || 0) + 10, 90);
          const progressFiles = [...files];
          progressFiles[fileIndex] = { ...currentFile, progress: newProgress };
          updateFiles(progressFiles);
          onUploadProgress?.(file.id, newProgress);
        }
      }, 200);

      const url = await onUpload(file);

      clearInterval(progressInterval);

      // Update to success
      const successFiles = [...files];
      successFiles[fileIndex] = { ...file, status: "success", progress: 100 };
      updateFiles(successFiles);
      onUploadSuccess?.(file, url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload failed");
      const errorFiles = [...files];
      errorFiles[fileIndex] = {
        ...file,
        status: "error",
        error: error.message,
      };
      updateFiles(errorFiles);
      onUploadError?.(file, error);
    }
  };

  const handleRemoveFile = (fileToRemove: UploadedFile) => {
    if (readOnly || disabled) return;

    // Revoke preview URL
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((f) => f.id !== fileToRemove.id);
    updateFiles(updatedFiles);
    onRemove?.(fileToRemove);

    // Clear error if min files condition is met
    if (minFiles && updatedFiles.length >= minFiles) {
      setError(null);
    }
  };

  const handleRemoveAll = () => {
    if (readOnly || disabled) return;
    revokePreviewUrls(files);
    updateFiles([]);
  };

  const handleDownload = (file: UploadedFile) => {
    if (file.preview) {
      const link = document.createElement("a");
      link.href = file.preview;
      link.download = file.name;
      link.click();
    }
  };

  const handleUploadAll = async () => {
    if (!onUpload) return;

    setInternalLoading(true);

    for (const file of files) {
      if (file.status === "pending") {
        await uploadFile(file);
      }
    }

    setInternalLoading(false);
  };

  const isLoading = loading || internalLoading;
  const displayError = externalError || error;

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
      {!readOnly &&
        (mode === "multiple"
          ? files.length < maxFiles
          : files.length === 0) && (
          <FileUploadDropzone
            onFileSelect={handleFileSelect}
            accept={accept}
            maxSize={maxSize}
            maxFiles={mode === "multiple" ? maxFiles - files.length : 1}
            disabled={disabled || isLoading}
            loading={isLoading}
            dragDropText={dragDropText}
            className={dropzoneClassName}
          />
        )}

      {/* File List */}
      {files.length > 0 && (
        <div className={cn("space-y-2", previewClassName)}>
          {files.map((file) =>
            renderPreview ? (
              renderPreview(file, () => handleRemoveFile(file))
            ) : showPreview ? (
              <FilePreview
                key={file.id}
                file={file}
                onRemove={() => handleRemoveFile(file)}
                onDownload={() => handleDownload(file)}
                showSize={showSize}
                showRemoveButton={showRemoveButton && !readOnly}
                showDownloadButton={showDownloadButton}
              />
            ) : (
              <div className="flex items-center justify-between p-2 rounded-lg border">
                <span className="text-sm truncate">{file.name}</span>
                {showRemoveButton && !readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file)}
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
      {!readOnly && files.length > 0 && (
        <div className="flex gap-2">
          {showUploadButton &&
            onUpload &&
            files.some((f) => f.status === "pending") && (
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
          {mode === "multiple" && files.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveAll}
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
      {minFiles && files.length < minFiles && (
        <p className="text-xs text-warning">
          Minimum {minFiles} file(s) required. {minFiles - files.length} more
          needed.
        </p>
      )}
    </div>
  );
}
