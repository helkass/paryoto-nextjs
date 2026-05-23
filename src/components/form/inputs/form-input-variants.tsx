// components/forms/form-input-variants.tsx
"use client";

import { FormInput } from "./form-input";
import { Control, FieldValues, FieldPath } from "react-hook-form";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Search,
  DollarSign,
  Hash,
  Globe,
  FileText,
  MessageSquare,
  AlignLeft,
} from "lucide-react";
import { FormTextarea } from "./form-textarea";

export const inputIconVariants = {
  email: Mail,
  password: Lock,
  user: User,
  phone: Phone,
  address: MapPin,
  search: Search,
  price: DollarSign,
  number: Hash,
  url: Globe,
  description: FileText,
  bio: MessageSquare,
  notes: AlignLeft,
} as const;

export type IconVariant = keyof typeof inputIconVariants;

interface FormTextareaInputProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  iconVariant?: IconVariant;
}

export function FormTextareaInput<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label = "Description",
  placeholder = "Enter description...",
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className,
  iconVariant = "description",
}: FormTextareaInputProps<TFieldValues>) {
  const IconComponent = inputIconVariants[iconVariant];

  return (
    <FormInput
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      type="textarea"
      required={required}
      disabled={disabled}
      rows={rows}
      maxLength={maxLength}
      leftIcon={<IconComponent className="h-4 w-4" />}
      className={className}
    />
  );
}

// Enhanced Textarea with character counter
interface FormRichTextareaProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
}

export function FormRichTextarea<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  rows = 6,
  maxLength = 500,
  showCharCount = true,
  className,
}: FormRichTextareaProps<TFieldValues>) {
  return (
    <FormTextarea
      control={control}
      name={name}
      label={label}
      description={description}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      maxLength={maxLength}
      showCharCount={showCharCount}
      className={className}
      textareaClassName="font-mono"
    />
  );
}

// Bio textarea specific
export function FormBioTextarea<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label = "Bio",
  placeholder = "Tell us about yourself...",
  required = false,
  disabled = false,
  className,
}: FormTextareaInputProps<TFieldValues>) {
  return (
    <FormInput
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      type="textarea"
      required={required}
      disabled={disabled}
      rows={5}
      maxLength={300}
      leftIcon={<MessageSquare className="h-4 w-4" />}
      className={className}
    />
  );
}

// Notes textarea
export function FormNotesTextarea<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  label = "Notes",
  placeholder = "Add your notes here...",
  required = false,
  disabled = false,
  className,
}: FormTextareaInputProps<TFieldValues>) {
  return (
    <FormInput
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      type="textarea"
      required={required}
      disabled={disabled}
      rows={3}
      leftIcon={<AlignLeft className="h-4 w-4" />}
      className={className}
    />
  );
}
