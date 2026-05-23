// components/autocomplete/autocomplete-options-list.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";
import {
  AutoCompleteOptionsListProps,
  AutoCompleteOption,
} from "@/types/autocomplete.types";

export function AutoCompleteOptionsList({
  options,
  groups,
  isLoading,
  loadingText = "Loading...",
  emptyMessage = "No results found",
  selectedValue,
  onSelect,
  highlightedIndex,
  showDescription = true,
  showIcon = true,
  className,
  optionClassName,
}: AutoCompleteOptionsListProps) {
  const getOptionProps = (option: AutoCompleteOption, index: number) => ({
    className: cn(
      "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
      "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
      option.disabled && "cursor-not-allowed opacity-50",
      highlightedIndex === index && "bg-muted",
      selectedValue === option.value && "bg-primary/10",
      optionClassName
    ),
    onClick: () => !option.disabled && onSelect(option),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          {loadingText}
        </span>
      </div>
    );
  }

  if (options.length === 0 && (!groups || groups.length === 0)) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Render grouped options
  if (groups && groups.length > 0) {
    let globalIndex = 0;
    return (
      <div className={cn("space-y-2", className)}>
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.options.map((option) => {
                const currentIndex = globalIndex++;
                return (
                  <div
                    key={option.value}
                    {...getOptionProps(option, currentIndex)}
                  >
                    {showIcon && (
                      <div className="shrink-0">
                        {option.icon || <div className="h-4 w-4" />}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{option.label}</div>
                      {showDescription && option.description && (
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {selectedValue === option.value && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render flat options
  return (
    <div className={cn("space-y-0.5", className)}>
      {options.map((option, index) => (
        <div key={option.value} {...getOptionProps(option, index)}>
          {showIcon && (
            <div className="shrink-0">
              {option.icon || <div className="h-4 w-4" />}
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-medium">{option.label}</div>
            {showDescription && option.description && (
              <div className="text-xs text-muted-foreground">
                {option.description}
              </div>
            )}
          </div>
          {selectedValue === option.value && (
            <Check className="h-4 w-4 shrink-0 text-primary" />
          )}
        </div>
      ))}
    </div>
  );
}
