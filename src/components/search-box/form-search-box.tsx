// components/search-box/form-search-box.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SearchBoxProps,
  SearchSuggestion,
  SearchHistoryItem,
} from "@/types/search-box.types";

const RECENT_SEARCHES_KEY = "search-box-recent-searches";
const MAX_RECENT_SEARCHES = 5;

export function FormSearchBox({
  value = "",
  onChange,
  onSearch,
  suggestions = [],
  fetchSuggestions,
  debounceDelay = 300,
  minChars = 1,
  maxSuggestions = 10,
  label,
  description,
  placeholder = "Search...",
  noResultsMessage = "No results found",
  autoFocus = false,
  clearable = true,
  showRecentSearches = true,
  recentSearchesKey = RECENT_SEARCHES_KEY,
  maxRecentSearches = MAX_RECENT_SEARCHES,
  className,
  inputClassName,
  suggestionsClassName,
  suggestionClassName,
  loading: externalLoading = false,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  onBlur,
  onFocus,
  onSelectSuggestion,
  onClear,
}: SearchBoxProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<
    SearchHistoryItem[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(inputValue, debounceDelay);

  // Load recent searches from localStorage
  React.useEffect(() => {
    if (showRecentSearches) {
      const stored = localStorage.getItem(recentSearchesKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SearchHistoryItem[];
          setRecentSearches(parsed.slice(0, maxRecentSearches));
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [showRecentSearches, recentSearchesKey, maxRecentSearches]);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!showRecentSearches || !query.trim()) return;

    const newSearch: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now(),
    };

    const existingIndex = recentSearches.findIndex(
      (item) => item.query.toLowerCase() === query.toLowerCase()
    );

    let updated: SearchHistoryItem[];
    if (existingIndex !== -1) {
      updated = [
        newSearch,
        ...recentSearches.filter((_, i) => i !== existingIndex),
      ];
    } else {
      updated = [newSearch, ...recentSearches];
    }

    const limited = updated.slice(0, maxRecentSearches);
    setRecentSearches(limited);
    localStorage.setItem(recentSearchesKey, JSON.stringify(limited));
  };

  // Fetch suggestions
  const suggestionItems = React.useMemo(() => {
    // Minimum character check
    if (inputValue.length < minChars) return [];

    // Static suggestions mode
    if (!fetchSuggestions) {
      if (!inputValue.trim() || !suggestions.length) return [];

      const searchLower = inputValue.toLowerCase();

      return suggestions
        .filter(
          (suggestion) =>
            suggestion.label.toLowerCase().includes(searchLower) ||
            suggestion.description?.toLowerCase().includes(searchLower)
        )
        .slice(0, maxSuggestions);
    }

    // Async mode cannot be handled purely by useMemo
    return [];
  }, [inputValue, suggestions, fetchSuggestions, minChars, maxSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSearch = () => {
    if (inputValue.trim() && !readOnly && !disabled) {
      saveRecentSearch(inputValue);
      onSearch?.(inputValue);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    const selectedValue = suggestion.label;
    setInputValue(selectedValue);
    onChange?.(selectedValue);
    onSelectSuggestion?.(suggestion);
    saveRecentSearch(selectedValue);
    onSearch?.(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSelectRecentSearch = (query: string) => {
    setInputValue(query);
    onChange?.(query);
    onSearch?.(query);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onChange?.("");
    onClear?.();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(recentSearchesKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems =
      suggestionItems.length + (showRecentSearches ? recentSearches.length : 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen && totalItems > 0) {
          setIsOpen(true);
        }
        setHighlightedIndex((prev) => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < suggestionItems.length) {
            handleSelectSuggestion(suggestionItems[highlightedIndex]);
          } else {
            const recentIndex = highlightedIndex - suggestionItems.length;
            if (recentIndex < recentSearches.length) {
              handleSelectRecentSearch(recentSearches[recentIndex].query);
            }
          }
        } else if (inputValue.trim()) {
          handleSearch();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (disabled || readOnly) return;
    setIsOpen(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 200);
    onBlur?.();
  };

  const showSuggestions = isOpen && !disabled && !readOnly && !externalLoading;
  const hasSuggestions = suggestionItems.length > 0;
  const hasRecentSearches =
    showRecentSearches && recentSearches.length > 0 && !inputValue.trim();
  const showNoResults =
    !isLoading &&
    !hasSuggestions &&
    inputValue.length >= minChars &&
    !hasRecentSearches;

  const isLoadingState = isLoading || externalLoading;

  return (
    <div className={cn("space-y-2", className)} ref={containerRef}>
      {label && (
        <Label
          className={
            required
              ? "after:content-['*'] after:ml-0.5 after:text-red-500"
              : ""
          }
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            className={cn("pl-9 pr-8", inputClassName)}
          />
          {clearable && inputValue && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
            <ScrollArea className="max-h-80">
              {isLoadingState ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              ) : hasRecentSearches ? (
                <div className="p-1">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={handleClearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((item, idx) => (
                    <SuggestionItem
                      key={item.id}
                      icon={<Clock className="h-4 w-4" />}
                      label={item.query}
                      isHighlighted={
                        highlightedIndex === suggestionItems.length + idx
                      }
                      onClick={() => handleSelectRecentSearch(item.query)}
                      className={suggestionClassName}
                    />
                  ))}
                </div>
              ) : hasSuggestions ? (
                <div className="p-1">
                  {suggestionItems.map((suggestion, idx) => (
                    <SuggestionItem
                      key={suggestion.id}
                      icon={suggestion.icon || <Search className="h-4 w-4" />}
                      label={suggestion.label}
                      description={suggestion.description}
                      category={suggestion.category}
                      isHighlighted={highlightedIndex === idx}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={suggestionClassName}
                    />
                  ))}
                </div>
              ) : showNoResults ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {noResultsMessage}
                </div>
              ) : inputValue.length < minChars && minChars > 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Type at least {minChars} character{minChars !== 1 ? "s" : ""}{" "}
                  to search
                </div>
              ) : null}
            </ScrollArea>
          </div>
        )}
      </div>

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Helper component for suggestion item
interface SuggestionItemProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  category?: string;
  isHighlighted: boolean;
  onClick: () => void;
  className?: string;
}

function SuggestionItem({
  icon,
  label,
  description,
  category,
  isHighlighted,
  onClick,
  className,
}: SuggestionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
        "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
        isHighlighted && "bg-muted",
        className
      )}
    >
      {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground truncate">
            {description}
          </div>
        )}
      </div>
      {category && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {category}
        </span>
      )}
    </button>
  );
}
