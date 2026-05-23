// components/image-upload/image-crop-dialog.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageCropper } from "./image-cropper";
import { CroppedArea, ImageFile } from "@/types/image-upload.types";

interface ImageCropDialogProps {
  open: boolean;
  image: ImageFile;
  aspect?: number;
  shape?: "rect" | "round";
  onClose: () => void;
  onCropConfirm: (croppedImage: ImageFile) => void;
}

export function ImageCropDialog({
  open,
  image,
  aspect = 1,
  shape = "rect",
  onClose,
  onCropConfirm,
}: ImageCropDialogProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] =
    React.useState<CroppedArea | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const getCroppedImg = React.useCallback(async (): Promise<Blob | null> => {
    if (!croppedAreaPixels) return null;

    const imageElement = new Image();
    imageElement.src = image.preview;

    await new Promise((resolve) => {
      imageElement.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      imageElement,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, image.type);
    });
  }, [image.preview, image.type, croppedAreaPixels]);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) {
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImg();
      if (!croppedBlob) throw new Error("Failed to crop image");

      const croppedFile = new File([croppedBlob], `cropped-${image.name}`, {
        type: image.type,
      });

      const croppedPreview = URL.createObjectURL(croppedBlob);

      const croppedImage: ImageFile = {
        ...image,
        file: croppedFile,
        size: croppedBlob.size,
        croppedBlob,
        croppedPreview,
      };

      onCropConfirm(croppedImage);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {" "}
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Drag the corners to adjust the crop area. Click apply when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ImageCropper
          image={image.preview}
          aspect={aspect}
          shape={shape}
          onCropComplete={(_croppedArea, pixels) =>
            setCroppedAreaPixels(pixels)
          }
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Apply Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
