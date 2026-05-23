// components/forms/form-checkbox-group-field.tsx
'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormCheckboxGroup } from '@/components/checkbox-group/form-checkbox-group';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { CheckboxGroupProps } from '@/types/checkbox-group.types';

interface FormCheckboxGroupFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxGroupProps, 'value' | 'onChange' | 'error'> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormCheckboxGroupField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormCheckboxGroupFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-0">
          <FormControl>
            <FormCheckboxGroup
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