export interface SelectOption {
  id: string | number;
  label: string;
  value: string | number;
  [key: string]: string | number | boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectTwoProps {
  // Data
  options?: SelectOption[] | SelectGroup[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;

  // API Configuration
  fetchMainOptions?: () => Promise<SelectOption[]>;
  fetchSubOptions?: (parentId: string | number) => Promise<SelectOption[]>;

  // Behavior
  placeholder?: {
    main?: string;
    sub?: string;
  };
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;

  // Styling
  className?: string;
  size?: "default" | "sm" | "lg";

  // Labels
  labels?: {
    main?: string;
    sub?: string;
  };

  // Loading
  isLoading?: boolean;

  // Error handling
  error?: string;
}

export interface UseSelectTwoReturn {
  // State
  mainOptions: SelectOption[];
  subOptions: SelectOption[];
  selectedMain: SelectOption | null;
  selectedSub: SelectOption | null;
  isLoadingMain: boolean;
  isLoadingSub: boolean;
  errorMain: string | null;
  errorSub: string | null;

  // Handlers
  handleMainChange: (option: SelectOption) => void;
  handleSubChange: (option: SelectOption) => void;
  clearSelection: () => void;
  resetSubOptions: () => void;

  // Methods
  setSelectedMainById: (id: string | number) => void;
  setSelectedSubById: (id: string | number) => void;
  refetchMain: () => Promise<void>;
  refetchSub: (parentId: string | number) => Promise<void>;
}
