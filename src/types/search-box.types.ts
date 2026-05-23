// types/search-box.types.ts
export interface SearchSuggestion {
  id: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  url?: string;
}

export interface SearchBoxProps {
  // Core
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;

  // Suggestions
  suggestions?: SearchSuggestion[];
  fetchSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
  debounceDelay?: number;
  minChars?: number;
  maxSuggestions?: number;

  // Labels
  label?: string;
  description?: string;
  placeholder?: string;
  noResultsMessage?: string;

  // Behavior
  autoFocus?: boolean;
  clearable?: boolean;
  showRecentSearches?: boolean;
  recentSearchesKey?: string;
  maxRecentSearches?: number;

  // Styling
  className?: string;
  inputClassName?: string;
  suggestionsClassName?: string;
  suggestionClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Validation
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}
