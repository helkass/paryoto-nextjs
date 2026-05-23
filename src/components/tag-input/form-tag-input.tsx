// components/tag-input/form-tag-input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tag as TagComponent } from "./tag";
import { Tag, TagInputProps } from "@/types/tag-input.types";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function FormTagInput({
  value = [],
  onChange,
  suggestions = [],
  maxTags,
  minTags,
  maxLength = 50,
  placeholder = "Type and press Enter...",
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  allowDuplicates = false,
  allowCreate = true,
  validateTag,
  transformTag,
  variant = "default",
  size = "md",
  showCount = true,
  className,
  inputClassName,
  tagClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
  onTagAdd,
  onTagRemove,
  onDuplicate,
  onMaxTagsReached,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // FIX 1: Hapus state `tags` internal dan `useEffect` sync-nya.
  // Komponen ini sekarang fully controlled — pakai `value` prop langsung.
  // Ini memotus siklus: onChange → parent setState → value baru → setTags → loop.
  const tags = value;

  // FIX 2: Ganti useEffect filter suggestions dengan useMemo.
  // useEffect + setState untuk derived data = anti-pattern yang menyebabkan
  // extra render. useMemo menghitung ulang hanya saat dependensi benar-benar berubah
  // (by value check), tanpa memicu setState sama sekali.
  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue.trim() || !suggestions.length) return [];

    const searchLower = inputValue.toLowerCase();
    return suggestions
      .filter(
        (suggestion) =>
          suggestion.label.toLowerCase().includes(searchLower) &&
          (allowDuplicates ||
            !tags.some((tag) => tag.value === suggestion.value))
      )
      .slice(0, 5);
  }, [inputValue, suggestions, tags, allowDuplicates]);

  // FIX 3: updateTags hanya panggil onChange (sumber kebenaran ada di parent).
  // Tidak perlu setTags karena `tags` sekarang langsung dari `value` prop.
  const updateTags = (newTags: Tag[]) => {
    onChange?.(newTags);
  };

  const validateAndTransform = (input: string): string | null => {
    let processed = input.trim();

    if (!processed) return null;

    if (maxLength && processed.length > maxLength) {
      processed = processed.slice(0, maxLength);
    }

    if (transformTag) {
      processed = transformTag(processed);
    }

    if (validateTag) {
      const result = validateTag(processed);
      if (result !== true) {
        return null;
      }
    }

    return processed;
  };

  const addTag = (tagValue: string) => {
    if (disabled || readOnly) return;

    const processedValue = validateAndTransform(tagValue);
    if (!processedValue) return;

    if (maxTags && tags.length >= maxTags) {
      onMaxTagsReached?.();
      return;
    }

    const exists = tags.some((tag) => tag.value === processedValue);
    if (exists && !allowDuplicates) {
      onDuplicate?.(processedValue);
      setInputValue("");
      return;
    }

    const newTag: Tag = {
      id: generateId(),
      label: processedValue,
      value: processedValue,
    };

    updateTags([...tags, newTag]);
    onTagAdd?.(newTag);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: Tag) => {
    if (disabled || readOnly) return;

    updateTags(tags.filter((tag) => tag.id !== tagToRemove.id));
    onTagRemove?.(tagToRemove);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (disabled || readOnly) return;
    onFocus?.();
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
    onBlur?.();
  };

  const handleSuggestionClick = (suggestion: Tag) => {
    addTag(suggestion.value);
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 w-20 animate-pulse rounded-full bg-muted"
            />
          ))}
          <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  const isMaxTagsReached = maxTags && tags.length >= maxTags;
  const isMinTagsError =
    minTags && tags.length < minTags && (error || !description);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header with label and count */}
      <div className="flex items-center justify-between">
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}
        {showCount && maxTags && (
          <span
            className={cn(
              "text-xs",
              tags.length >= maxTags
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {tags.length} / {maxTags}
          </span>
        )}
      </div>

      {/* Tags container */}
      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-md border p-2 transition-colors",
          "focus-within:ring-1 focus-within:ring-ring",
          disabled && "bg-muted cursor-not-allowed",
          isMinTagsError && "border-destructive",
          inputClassName
        )}
      >
        {/* Existing tags */}
        {tags.map((tag) => (
          <TagComponent
            key={tag.id}
            tag={tag}
            onRemove={() => removeTag(tag)}
            disabled={disabled || readOnly}
            size={size}
            variant={variant}
            className={tagClassName}
          />
        ))}

        {/* Input field */}
        {(!maxTags || tags.length < maxTags) && !readOnly && (
          <div className="relative flex-1 min-w-[120px]">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={tags.length === 0 ? placeholder : ""}
              disabled={disabled}
              className={cn(
                "h-auto min-h-[32px] border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
                disabled && "cursor-not-allowed"
              )}
            />

            {/* Suggestions dropdown */}
            {showSuggestions &&
              filteredSuggestions.length > 0 &&
              !disabled &&
              !readOnly && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {suggestion.icon && (
                        <span className="h-4 w-4">{suggestion.icon}</span>
                      )}
                      <span>{suggestion.label}</span>
                    </button>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Read-only display */}
        {readOnly && tags.length === 0 && (
          <span className="text-sm text-muted-foreground">No tags</span>
        )}
      </div>

      {/* Description and error messages */}
      {description && !error && !isMinTagsError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {!error && minTags && tags.length < minTags && (
        <p className="text-xs text-destructive">
          Please add at least {minTags} tag(s). {minTags - tags.length} more
          needed.
        </p>
      )}

      {!error && maxTags && tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tag(s) reached.
        </p>
      )}

      {!error && allowCreate && !disabled && !readOnly && !isMaxTagsReached && (
        <p className="text-xs text-muted-foreground">
          Press Enter to add a new tag
        </p>
      )}
    </div>
  );
}
