// components/forms/form-rating-field.tsx
'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormRating } from '@/components/rating/form-rating';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { RatingProps } from '@/types/rating.types';

interface FormRatingFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<RatingProps, 'value' | 'onChange' | 'error'> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormRatingField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  ...props
}: FormRatingFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-2">
          {label && (
            <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <FormRating
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