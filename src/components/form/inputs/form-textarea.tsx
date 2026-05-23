"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormTextareaProps<TFieldValues extends FieldValues = FieldValues> {
  // Form props
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  // Textarea props
  label?: string;
  description?: string;
  placeholder?: string;

  // Validation
  required?: boolean;

  // Behavior
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;

  // Textarea specific
  rows?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";

  // Styling
  className?: string;
  textareaClassName?: string;

  // Character counter
  showCharCount?: boolean;

  // Event handlers
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function FormTextarea<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  rows = 4,
  maxLength,
  resize = "vertical",
  className,
  textareaClassName,
  showCharCount = false,
  onKeyDown,
  onBlur,
  onFocus,
}: FormTextareaProps<TFieldValues>) {
  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentLength = field.value?.length || 0;
        const isOverLimit = maxLength && currentLength > maxLength;

        return (
          <FormItem className={className}>
            {label && (
              <div className="flex justify-between items-center">
                <FormLabel
                  className={
                    required
                      ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                      : ""
                  }
                >
                  {label}
                </FormLabel>
                {showCharCount && maxLength && (
                  <span
                    className={cn(
                      "text-xs",
                      isOverLimit ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    {currentLength} / {maxLength}
                  </span>
                )}
              </div>
            )}

            <FormControl>
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus}
                rows={rows}
                maxLength={maxLength}
                className={cn(
                  resizeClasses[resize],
                  fieldState.error &&
                    "border-red-500 focus-visible:ring-red-500",
                  textareaClassName
                )}
                onKeyDown={onKeyDown}
                onBlur={(e) => {
                  field.onBlur();
                  onBlur?.(e);
                }}
                onFocus={onFocus}
              />
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />

            {isOverLimit && (
              <p className="text-xs text-red-500">
                Character limit exceeded by {currentLength - maxLength!}{" "}
                characters
              </p>
            )}
          </FormItem>
        );
      }}
    />
  );
}
