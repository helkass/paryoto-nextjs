// components/forms/form-search-box-field.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSearchBox } from "@/components/search-box/form-search-box";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { SearchBoxProps } from "@/types/search-box.types";

interface FormSearchBoxFieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends Omit<SearchBoxProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormSearchBoxField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormSearchBoxFieldProps<TFieldValues>) {
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
            <FormSearchBox
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
