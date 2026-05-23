// types/tag-input.types.ts
export interface Tag {
  id: string;
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}

export interface TagInputProps {
  // Core
  value?: Tag[];
  onChange?: (tags: Tag[]) => void;

  // Options
  suggestions?: Tag[];
  maxTags?: number;
  minTags?: number;
  maxLength?: number;
  placeholder?: string;

  // Labels
  label?: string;
  description?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Behavior
  allowDuplicates?: boolean;
  allowCreate?: boolean;
  validateTag?: (tag: string) => boolean | string;
  transformTag?: (tag: string) => string;

  // Display
  variant?: "default" | "outline" | "filled" | "modern";
  size?: "sm" | "md" | "lg";
  showCount?: boolean;

  // Styling
  className?: string;
  inputClassName?: string;
  tagClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onTagAdd?: (tag: Tag) => void;
  onTagRemove?: (tag: Tag) => void;
  onDuplicate?: (tag: string) => void;
  onMaxTagsReached?: () => void;
}

export interface TagComponentProps {
  tag: Tag;
  onRemove: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "filled" | "modern";
  className?: string;
}
