// components/forms/form-image-upload-field.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormImageUpload } from "@/components/image-upload/form-image-upload";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ImageUploadProps } from "@/types/image-upload.types";

interface FormImageUploadFieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends Omit<ImageUploadProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormImageUploadField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  mode = "single",
  ...props
}: FormImageUploadFieldProps<TFieldValues>) {
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
            <FormImageUpload
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
