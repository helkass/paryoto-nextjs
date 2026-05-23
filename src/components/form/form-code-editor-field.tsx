"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { CodeEditorProps } from "@/types/code-editor.types";

interface FormCodeEditorFieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends Omit<CodeEditorProps, "value" | "onChange" | "error"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormCodeEditorField<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormCodeEditorFieldProps<TFieldValues>) {
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
            <CodeEditor
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
