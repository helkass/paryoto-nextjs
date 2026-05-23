// components/image-upload/image-preview.tsx
"use client";

import * as React from "react";
import { X, Download, Crop, Loader2, AlertCircle } from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/image-utils";
import { ImagePreviewProps } from "@/types/image-upload.types";

export function ImagePreview({
  image,
  onRemove,
  onDownload,
  onCrop,
  showRemoveButton = true,
  showDownloadButton = false,
  showCropButton = false,
  circular = false,
  className,
}: ImagePreviewProps) {
  const previewUrl = image.croppedPreview || image.preview;

  const getStatusIcon = () => {
    switch (image.status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "success":
        return null;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card p-3 transition-all hover:shadow-md",
        image.status === "error" && "border-destructive bg-destructive/5",
        className
      )}
    >
      <div className="flex gap-3">
        {/* Image Preview */}
        <div
          className={cn(
            "relative h-20 w-20 flex-shrink-0 overflow-hidden bg-muted",
            circular ? "rounded-full" : "rounded-md"
          )}
        >
          {" "}
          {previewUrl ? (
            <NextImage
              src={previewUrl}
              alt={image.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
          )}
        </div>

        {/* Image Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{image.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatFileSize(image.size)}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {getStatusIcon()}
              {showCropButton && onCrop && image.status !== "uploading" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onCrop}
                  title="Crop image"
                >
                  <Crop className="h-4 w-4" />
                </Button>
              )}
              {showDownloadButton &&
                onDownload &&
                image.status === "success" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onDownload}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              {showRemoveButton && onRemove && image.status !== "uploading" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                  onClick={onRemove}
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {image.status === "uploading" && image.progress !== undefined && (
            <div className="mt-2">
              <Progress value={image.progress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {image.progress}% uploaded
              </p>
            </div>
          )}

          {/* Error Message */}
          {image.status === "error" && image.error && (
            <p className="text-xs text-destructive mt-1">{image.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
