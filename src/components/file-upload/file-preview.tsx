"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  X,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/file-utils";
import { FilePreviewProps } from "@/types/file-upload.types";

export function FilePreview({
  file,
  onRemove,
  onDownload,
  showSize = true,
  showRemoveButton = true,
  showDownloadButton = false,
  className,
}: FilePreviewProps) {
  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8" />;
    }
    if (file.type.startsWith("video/")) {
      return <Video className="h-8 w-8" />;
    }
    if (file.type.startsWith("audio/")) {
      return <Music className="h-8 w-8" />;
    }
    return <FileText className="h-8 w-8" />;
  };

  const getStatusIcon = () => {
    switch (file.status) {
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
        "relative group rounded-lg border bg-card p-3 transition-all hover:shadow-md",
        file.status === "error" && "border-destructive bg-destructive/5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {" "}
        {/* File Icon / Preview Image */}
        {file.preview && file.type.startsWith("image/") ? (
          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <NextImage
              src={file.preview}
              alt={file.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-muted-foreground flex-shrink-0">
            {getFileIcon()}
          </div>
        )}
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{file.name}</p>
              {showSize && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {getStatusIcon()}
              {showDownloadButton &&
                onDownload &&
                file.status === "success" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              {showRemoveButton && onRemove && file.status !== "uploading" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {file.status === "uploading" && file.progress !== undefined && (
            <div className="mt-2">
              <Progress value={file.progress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {file.progress}% uploaded
              </p>
            </div>
          )}

          {/* Error Message */}
          {file.status === "error" && file.error && (
            <p className="text-xs text-destructive mt-1">{file.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
