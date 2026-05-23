// components/forms/form-currency-input-field.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormCurrencyInput } from "@/components/currency-input/form-currency-input";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { CurrencyInputProps } from "@/types/currency-input.types";

interface FormCurrencyInputFieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends Omit<CurrencyInputProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormCurrencyInputField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormCurrencyInputFieldProps<TFieldValues>) {
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
            <FormCurrencyInput
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
