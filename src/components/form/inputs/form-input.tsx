// components/forms/form-input.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea";

interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
  // Form props
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  // Input props
  label?: string;
  description?: string;
  placeholder?: string;
  type?: InputType;

  // Validation
  required?: boolean;

  // Behavior
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;

  // Number specific
  min?: number;
  max?: number;
  step?: number;

  // Textarea specific
  rows?: number;
  maxLength?: number;

  // Styling
  className?: string;
  inputClassName?: string;

  // Icon
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Event handlers
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  autoComplete,
  min,
  max,
  step,
  rows = 3,
  maxLength,
  className,
  inputClassName,
  leftIcon,
  rightIcon,
  onKeyDown,
  onBlur,
  onFocus,
}: FormInputProps<TFieldValues>) {
  const isTextarea = type === "textarea";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel
              className={
                required
                  ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                  : ""
              }
            >
              {label}
            </FormLabel>
          )}

          <FormControl>
            <div className="relative">
              {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {leftIcon}
                </div>
              )}

              {isTextarea ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  autoFocus={autoFocus}
                  rows={rows}
                  maxLength={maxLength}
                  className={cn(
                    leftIcon && "pl-10",
                    rightIcon && "pr-10",
                    fieldState.error &&
                      "border-red-500 focus-visible:ring-red-500",
                    inputClassName
                  )}
                  onKeyDown={onKeyDown}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.(e);
                  }}
                  onFocus={onFocus}
                />
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  autoFocus={autoFocus}
                  autoComplete={autoComplete}
                  min={min}
                  max={max}
                  step={step}
                  maxLength={maxLength}
                  className={cn(
                    leftIcon && "pl-10",
                    rightIcon && "pr-10",
                    fieldState.error &&
                      "border-red-500 focus-visible:ring-red-500",
                    inputClassName
                  )}
                  onKeyDown={onKeyDown}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.(e);
                  }}
                  onFocus={onFocus}
                />
              )}

              {rightIcon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {rightIcon}
                </div>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
