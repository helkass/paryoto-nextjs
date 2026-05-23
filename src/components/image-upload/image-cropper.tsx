"use client";

import * as React from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageCropperProps, CroppedArea } from "@/types/image-upload.types";

export function ImageCropper({
  image,
  aspect = 1,
  shape = "rect",
  rotation = 0,
  zoom = 1,
  onCropChange,
  onCropComplete,
  className,
}: ImageCropperProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoomValue, setZoomValue] = React.useState(zoom);
  const [rotationValue, setRotationValue] = React.useState(rotation);
  const [, setCroppedAreaPixels] = React.useState<CroppedArea | null>(null);

  const onCropChangeHandler = (location: { x: number; y: number }) => {
    setCrop(location);
  };

  const onZoomChangeHandler = (value: number[]) => {
    setZoomValue(value[0]);
  };

  const onRotationChangeHandler = () => {
    setRotationValue((prev) => (prev + 90) % 360);
  };

  const onCropCompleteHandler = (
    croppedArea: CroppedArea,
    croppedAreaPixels: CroppedArea
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
    onCropComplete?.(croppedArea, croppedAreaPixels);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative h-[400px] w-full bg-muted rounded-lg overflow-hidden">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoomValue}
          rotation={rotationValue}
          aspect={aspect}
          cropShape={shape}
          showGrid={true}
          zoomWithScroll={true}
          onCropChange={onCropChangeHandler}
          onZoomChange={setZoomValue}
          onRotationChange={setRotationValue}
          onCropComplete={(croppedArea, croppedAreaPixels) => {
            onCropChange?.(croppedArea);
            onCropCompleteHandler(croppedArea, croppedAreaPixels);
          }}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[zoomValue]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={onZoomChangeHandler}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRotationChangeHandler}
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
