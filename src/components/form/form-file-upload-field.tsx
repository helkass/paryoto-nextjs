// components/forms/form-file-upload-field.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFileUpload } from "@/components/file-upload/form-file-upload";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import type { FileUploadProps } from "@/types/file-upload.types";

interface FormFileUploadFieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends Omit<FileUploadProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormFileUploadField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  mode = "multiple",
  ...props
}: FormFileUploadFieldProps<TFieldValues>) {
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
            <FormFileUpload
              value={field.value}
              onChange={field.onChange}
              mode={mode}
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
