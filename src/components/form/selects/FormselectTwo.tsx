"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectTwo } from "./selectTwo";
import type { SelectOption } from "./select";
import { Control, FieldPath, FieldValues } from "react-hook-form";

// Type untuk array tuple [mainId, subId]
export type SelectTwoValue = [string | number, string | number];

interface FormSelectTwoProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  // Form props
  control: Control<TFieldValues>;
  name: TName;

  // Labels
  label?: string;
  description?: string;

  // Required
  required?: boolean;

  // SelectTwo props
  fetchMainOptions?: () => Promise<SelectOption[]>;
  fetchSubOptions?: (parentId: string | number) => Promise<SelectOption[]>;
  options?: SelectOption[];
  placeholder?: {
    main?: string;
    sub?: string;
  };
  disabled?: boolean;
  clearable?: boolean;
  size?: "default" | "sm" | "lg";
  labels?: {
    main?: string;
    sub?: string;
  };

  // Custom class
  className?: string;

  // Optional: Custom transform functions
  transform?: {
    fromForm?: (value: TFieldValues[TName]) => SelectTwoValue;
    toForm?: (value: SelectTwoValue) => TFieldValues[TName];
  };
}

export function FormSelectTwo<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required = false,
  fetchMainOptions,
  fetchSubOptions,
  options,
  placeholder,
  disabled = false,
  clearable = true,
  size = "default",
  labels,
  className,
  transform,
}: FormSelectTwoProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Handle transform if provided
        // SelectTwo expects a simple array type (string | number)[]; normalize the form value to that shape.
        let fieldValue: (string | number)[] = Array.isArray(field.value)
          ? (field.value as (string | number)[])
          : ([] as (string | number)[]);

        // If a transform.fromForm is provided, use it to derive the UI value.
        if (transform && transform.fromForm) {
          fieldValue = transform.fromForm(field.value) as (string | number)[];
        }

        // Create an onChange handler that matches SelectTwo's signature and converts to the form value.
        const fieldOnChange = (value: (string | number)[]) => {
          // Ensure a 2-tuple for the form representation (fill missing entries with empty string)
          const tuple: SelectTwoValue = [value[0] ?? "", value[1] ?? ""];

          if (transform && transform.toForm) {
            field.onChange(transform.toForm(tuple));
          } else {
            // Cast tuple into the form field type
            field.onChange(tuple as unknown as TFieldValues[TName]);
          }
        };

        return (
          <FormItem className={className}>
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
              <SelectTwo
                fetchMainOptions={fetchMainOptions}
                fetchSubOptions={fetchSubOptions}
                options={options}
                value={fieldValue}
                onChange={fieldOnChange}
                placeholder={placeholder}
                disabled={disabled}
                clearable={clearable}
                size={size}
                labels={labels}
                required={required}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// Type untuk form values dengan select two
export interface WithSelectTwoFields {
  category: SelectTwoValue;
  [key: string]: SelectTwoValue;
}

/**
 * EXAMPLE USAGE
 *
 * // Define your form schema
 * const formSchema = z.object({
 *   category: z.tuple([z.union([z.string(), z.number()]), z.union([z.string(), z.number()])]),
 * });
 *
 * type FormValues = z.infer<typeof formSchema>;
 *
 * const form = useForm<FormValues>({
 *   resolver: zodResolver(formSchema),
 * });
 *
 * <FormSelectTwo<FormValues>
 *   control={form.control}
 *   name="category"
 *   label="Category Selection"
 *   description="Select a category and subcategory"
 *   required
 *   fetchMainOptions={fetchMainOptionsAPI}
 *   fetchSubOptions={fetchSubOptionsAPI}
 *   labels={{
 *     main: 'Main Category',
 *     sub: 'Sub Category'
 *   }}
 *   placeholder={{
 *     main: 'Choose a category',
 *     sub: 'Choose a subcategory'
 *   }}
 *   clearable
 * />
 */
