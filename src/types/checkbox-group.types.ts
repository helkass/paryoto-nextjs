// types/checkbox-group.types.ts
export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CheckboxGroupProps {
  // Core
  value?: string[];
  onChange?: (value: string[]) => void;
  options: CheckboxOption[];
  
  // Labels
  label?: string;
  description?: string;
  
  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  
  // Display Options
  layout?: 'horizontal' | 'vertical' | 'grid';
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'card' | 'modern' | 'button';
  size?: 'sm' | 'md' | 'lg';
  
  // Features
  selectAll?: boolean;
  selectAllLabel?: string;
  maxSelections?: number;
  minSelections?: number;
  
  // Styling
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  
  // Loading & Error
  loading?: boolean;
  error?: string;
  
  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onSelectionChange?: (selected: string[]) => void;
}

export interface CheckboxCardProps {
  option: CheckboxOption;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name: string;
  variant?: 'default' | 'card' | 'modern' | 'button';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}