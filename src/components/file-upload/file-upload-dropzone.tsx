// components/file-upload/file-upload-dropzone.tsx
"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFile, formatFileSize } from "@/lib/file-utils";
import { FileUploadDropzoneProps } from "@/types/file-upload.types";

export function FileUploadDropzone({
  onFileSelect,
  accept,
  maxSize,
  maxFiles = 1,
  disabled = false,
  loading = false,
  dragDropText = "Drag & drop files here or click to browse",
  className,
}: FileUploadDropzoneProps) {
  const [error, setError] = React.useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: (acceptedFiles, rejectedFiles) => {
        setError(null);

        // Handle rejected files
        if (rejectedFiles.length > 0) {
          const reject = rejectedFiles[0];
          const errorMessage = reject.errors[0]?.message || "File rejected";
          setError(errorMessage);
          return;
        }

        // Validate each file
        const validFiles: File[] = [];
        const errors: string[] = [];

        for (const file of acceptedFiles) {
          const validation = validateFile(file, accept, maxSize);
          if (validation.valid) {
            validFiles.push(file);
          } else if (validation.error) {
            errors.push(`${file.name}: ${validation.error}`);
          }
        }

        if (errors.length > 0) {
          setError(errors.join(", "));
        }

        if (validFiles.length > 0) {
          // Limit number of files
          const filesToAdd = validFiles.slice(0, maxFiles);
          onFileSelect(filesToAdd);

          if (validFiles.length > maxFiles) {
            setError(
              `Maximum ${maxFiles} file(s) allowed. Only ${maxFiles} file(s) added.`
            );
          }
        }
      },
      accept: accept
        ? typeof accept === "string"
          ? { [accept]: [] }
          : undefined
        : undefined,
      maxSize,
      multiple: maxFiles > 1,
      disabled: disabled || loading,
      noClick: disabled,
      noKeyboard: disabled,
    });

  const dropzoneClassName = cn(
    "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200",
    isDragActive && "border-primary bg-primary/5",
    isDragReject && "border-destructive bg-destructive/5",
    (disabled || loading) && "cursor-not-allowed opacity-60",
    !isDragActive &&
      !isDragReject &&
      "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
    className
  );

  return (
    <div className="space-y-2">
      <div {...getRootProps()} className={dropzoneClassName}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">
            {isDragActive ? "Drop files here" : dragDropText}
          </p>
          {maxSize && (
            <p className="text-xs text-muted-foreground mt-2">
              Max file size: {formatFileSize(maxSize)}
            </p>
          )}
          {accept && (
            <p className="text-xs text-muted-foreground mt-1">
              Accepted: {Array.isArray(accept) ? accept.join(", ") : accept}
            </p>
          )}
          {maxFiles > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              Max files: {maxFiles}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
