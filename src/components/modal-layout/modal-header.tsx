// components/modal-layout/modal-header.tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModalHeaderProps } from "@/types/modal-layout.types";

export function ModalHeader({
  title,
  description,
  onClose,
  showCloseButton = true,
  className,
}: ModalHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex-1">
        {title && (
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
