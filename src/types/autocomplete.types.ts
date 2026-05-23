// types/autocomplete.types.ts
export interface AutoCompleteOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface AutoCompleteGroup {
  label: string;
  options: AutoCompleteOption[];
}

export interface AutoCompleteProps {
  // Core
  value?: string;
  onChange?: (value: string, option?: AutoCompleteOption) => void;
  options?: AutoCompleteOption[] | AutoCompleteGroup[];

  // Async
  fetchOptions?: (search: string) => Promise<AutoCompleteOption[]>;
  debounceDelay?: number;
  minChars?: number;

  // Labels
  label?: string;
  description?: string;
  placeholder?: string;
  emptyMessage?: string;
  loadingText?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Behavior
  clearable?: boolean;
  creatable?: boolean;
  creatableText?: string;
  closeOnSelect?: boolean;

  // Display
  showIcon?: boolean;
  showDescription?: boolean;
  maxResults?: number;
  minWidth?: number;

  // Styling
  className?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onSearch?: (search: string) => void;
  onSelect?: (option: AutoCompleteOption) => void;
  onCreate?: (value: string) => void;
}

export interface AutoCompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

export interface AutoCompleteOptionsListProps {
  options: AutoCompleteOption[];
  groups?: AutoCompleteGroup[];
  isLoading: boolean;
  loadingText?: string;
  emptyMessage?: string;
  selectedValue?: string;
  onSelect: (option: AutoCompleteOption) => void;
  highlightedIndex: number;
  showDescription?: boolean;
  showIcon?: boolean;
  className?: string;
  optionClassName?: string;
}
