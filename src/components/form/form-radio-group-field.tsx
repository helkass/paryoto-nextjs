// components/forms/form-radio-group-field.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormRadioGroup } from "@/components/radio-group/form-radio-group";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { RadioGroupProps } from "@/types/radio-group.types";

interface FormRadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends Omit<RadioGroupProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormRadioGroupField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormRadioGroupFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-0">
          <FormControl>
            <FormRadioGroup
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
