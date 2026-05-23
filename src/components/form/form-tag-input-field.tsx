// components/forms/form-tag-input-field.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormTagInput } from "@/components/tag-input/form-tag-input";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { TagInputProps } from "@/types/tag-input.types";

interface FormTagInputFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TagInputProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormTagInputField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormTagInputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
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
            <FormTagInput
              value={field.value}
              onChange={field.onChange}
              required={required}
              error={fieldState.error?.message}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
