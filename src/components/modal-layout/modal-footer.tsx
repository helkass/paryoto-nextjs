// components/modal-layout/modal-footer.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ModalFooterProps } from "@/types/modal-layout.types";

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex justify-end gap-2", className)}>{children}</div>
  );
}
