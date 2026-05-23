// components/forms/form-toggle-field.tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormToggle } from "@/components/toggle/form-toggle";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ToggleProps } from "@/types/toggle.types";

interface FormToggleFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ToggleProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormToggleField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormToggleFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-0">
          <FormControl>
            <FormToggle
              value={field.value}
              onChange={field.onChange}
              required={required}
              error={fieldState.error?.message}
              label={label}
              description={description}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
