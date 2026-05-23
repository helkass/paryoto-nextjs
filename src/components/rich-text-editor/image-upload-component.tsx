"use client";

import * as React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export function ImageUploadComponent({
  editor,
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      try {
        // Get image URL from editor props
        const uploadImage = (
          editor?.options?.editorProps as Record<string, unknown>
        )?.handleImageUpload;
        if (uploadImage && typeof uploadImage === "function") {
          const url = await uploadImage(file);
          clearInterval(interval);
          setUploadProgress(100);
          updateAttributes({ src: url });
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        clearInterval(interval);
        setIsUploading(false);
      }
    },
  });

  if (isUploading) {
    return (
      <NodeViewWrapper className="my-2">
        <div className="relative flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Uploading image...
            </p>
            <Progress value={uploadProgress} className="mt-2 w-48" />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  if (node.attrs.src) {
    return (
      <NodeViewWrapper className="relative my-2 inline-block group">
        <Image
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          title={node.attrs.title || ""}
          className="max-w-full rounded-lg shadow-sm"
          style={{
            width: node.attrs.width || "auto",
            height: node.attrs.height || "auto",
          }}
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => deleteNode()}
        >
          <X className="h-3 w-3" />
        </Button>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive && "border-primary bg-primary/5",
          "hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive ? "Drop image here" : "Click or drag to upload image"}
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
      </div>
    </NodeViewWrapper>
  );
}
