// components/form-section/form-section-group.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FormSection } from "./form-section";
import { FormSectionGroupProps } from "@/types/form-section.types";

export function FormSectionGroup({
  sections,
  defaultOpenAll = false,
  allowMultipleOpen = true,
  className,
  children,
}: FormSectionGroupProps) {
  const [openSections, setOpenSections] = React.useState<
    Record<number, boolean>
  >(() => {
    const initial: Record<number, boolean> = {};
    sections.forEach((_, index) => {
      initial[index] = defaultOpenAll
        ? true
        : sections[index].defaultOpen ?? false;
    });
    return initial;
  });

  const handleToggle = (index: number, isOpen: boolean) => {
    if (!allowMultipleOpen) {
      const newState: Record<number, boolean> = {};
      sections.forEach((_, i) => {
        newState[i] = i === index ? isOpen : false;
      });
      setOpenSections(newState);
    } else {
      setOpenSections((prev) => ({ ...prev, [index]: isOpen }));
    }
  };

  const openAll = () => {
    const newState: Record<number, boolean> = {};
    sections.forEach((_, index) => {
      newState[index] = true;
    });
    setOpenSections(newState);
  };

  const closeAll = () => {
    const newState: Record<number, boolean> = {};
    sections.forEach((_, index) => {
      newState[index] = false;
    });
    setOpenSections(newState);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Group header with actions */}
      {children && (
        <div className="flex items-center justify-between">
          {children}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Expand All
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              type="button"
              onClick={closeAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <FormSection
            key={index}
            {...section}
            isOpen={openSections[index]}
            onOpenChange={(isOpen) => handleToggle(index, isOpen)}
          />
        ))}
      </div>
    </div>
  );
}
