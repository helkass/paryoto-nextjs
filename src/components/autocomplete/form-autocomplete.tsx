// components/autocomplete/form-autocomplete.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Search, Loader2, Check } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  AutoCompleteProps,
  AutoCompleteOption,
  AutoCompleteGroup,
} from "@/types/autocomplete.types";

export function FormAutoComplete({
  value = "",
  onChange,
  options: staticOptions = [],
  fetchOptions,
  debounceDelay = 300,
  minChars = 1,
  label,
  description,
  placeholder = "Search...",
  emptyMessage = "No results found",
  loadingText = "Loading...",
  required = false,
  disabled = false,
  readOnly = false,
  clearable = true,
  creatable = false,
  creatableText = 'Create "{value}"',
  closeOnSelect = true,
  showIcon = true,
  showDescription = true,
  maxResults = 50,
  minWidth = 300,
  className,
  inputClassName,
  optionsClassName,
  optionClassName,
  loading: externalLoading = false,
  error,
  onBlur,
  onFocus,
  onSearch,
  onSelect,
  onCreate,
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [options, setOptions] = React.useState<AutoCompleteOption[]>([]);
  const [groups, setGroups] = React.useState<AutoCompleteGroup[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(inputValue, debounceDelay);
  const isAsync = !!fetchOptions;
  const hasStaticOptions = staticOptions.length > 0;

  // Check if static options are grouped
  const isGrouped = React.useMemo(() => {
    if (!hasStaticOptions) return false;
    return "group" in (staticOptions[0] as AutoCompleteGroup);
  }, [hasStaticOptions, staticOptions]);

  // Load static options
  React.useEffect(() => {
    if (hasStaticOptions && !isAsync) {
      if (isGrouped) {
        setGroups(staticOptions as AutoCompleteGroup[]);
        setOptions([]);
      } else {
        setOptions(staticOptions as AutoCompleteOption[]);
        setGroups([]);
      }
    }
  }, [staticOptions, isAsync, isGrouped, hasStaticOptions]);

  // Fetch options on search
  React.useEffect(() => {
    const fetchData = async () => {
      if (!isAsync) return;

      if (debouncedSearch.length < minChars) {
        setOptions([]);
        setGroups([]);
        return;
      }

      setIsLoading(true);
      onSearch?.(debouncedSearch);

      try {
        const results = await fetchOptions(debouncedSearch);
        setOptions(results.slice(0, maxResults));
        setGroups([]);
      } catch (err) {
        console.error("Failed to fetch options:", err);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, isAsync, fetchOptions, minChars, maxResults, onSearch]);

  const getFilteredOptions = (): AutoCompleteOption[] => {
    if (isAsync) return options;

    if (debouncedSearch.length < minChars) {
      return [];
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filterFn = (opt: AutoCompleteOption) =>
      opt.label.toLowerCase().includes(searchLower) ||
      opt.value.toLowerCase().includes(searchLower) ||
      opt.description?.toLowerCase().includes(searchLower);

    if (isGrouped) {
      const filteredGroups = (staticOptions as AutoCompleteGroup[])
        .map((group) => ({
          ...group,
          options: group.options.filter(filterFn),
        }))
        .filter((group) => group.options.length > 0);

      setGroups(filteredGroups);
      return [];
    }

    return (staticOptions as AutoCompleteOption[])
      .filter(filterFn)
      .slice(0, maxResults);
  };

  const filteredOptions = getFilteredOptions();
  const displayOptions = isAsync ? options : filteredOptions;
  const displayGroups = isAsync ? [] : groups;
  const isLoadingState = isLoading || externalLoading;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setHighlightedIndex(-1);

    if (!isOpen && val.length >= minChars) {
      setIsOpen(true);
    }
  };

  const handleSelect = (option: AutoCompleteOption) => {
    if (readOnly || disabled) return;

    setInputValue(option.label);
    onChange?.(option.value, option);
    onSelect?.(option);

    if (closeOnSelect) {
      setIsOpen(false);
    }

    inputRef.current?.focus();
  };

  const handleClear = () => {
    setInputValue("");
    onChange?.("", undefined);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleCreate = () => {
    if (!creatable || !inputValue.trim()) return;

    const newValue = inputValue.trim();
    const newOption: AutoCompleteOption = {
      value: newValue,
      label: newValue,
    };

    setInputValue(newValue);
    onChange?.(newValue, newOption);
    onCreate?.(newValue);
    onSelect?.(newOption);

    if (closeOnSelect) {
      setIsOpen(false);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = displayOptions.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen && displayOptions.length > 0) {
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
        if (highlightedIndex >= 0 && displayOptions[highlightedIndex]) {
          handleSelect(displayOptions[highlightedIndex]);
        } else if (creatable && inputValue.trim()) {
          handleCreate();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    if (disabled || readOnly) return;
    onFocus?.();
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow click on options
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
    onBlur?.();
  };

  const showCreateOption =
    creatable &&
    inputValue.trim().length >= minChars &&
    !displayOptions.some((opt) => opt.value === inputValue.trim()) &&
    !isLoadingState;

  const showOptions =
    isOpen &&
    !disabled &&
    !readOnly &&
    (displayOptions.length > 0 ||
      displayGroups.length > 0 ||
      isLoadingState ||
      showCreateOption);

  return (
    <div
      className={cn("space-y-2", className)}
      style={{ minWidth }}
      ref={containerRef}
    >
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
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

        {/* Options dropdown */}
        {showOptions && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
            <div className="max-h-[300px] overflow-y-auto p-1">
              {isLoadingState ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {loadingText}
                  </span>
                </div>
              ) : displayGroups.length > 0 ? (
                <div className="space-y-2">
                  {displayGroups.map((group) => (
                    <div key={group.label}>
                      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {group.label}
                      </div>
                      <div className="space-y-0.5">
                        {group.options.map((option, idx) => {
                          const globalIdx = displayOptions.indexOf(option);
                          return (
                            <OptionItem
                              key={option.value}
                              option={option}
                              isSelected={value === option.value}
                              isHighlighted={highlightedIndex === globalIdx}
                              showIcon={showIcon}
                              showDescription={showDescription}
                              onSelect={() => handleSelect(option)}
                              className={optionClassName}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayOptions.length > 0 ? (
                <div className="space-y-0.5">
                  {displayOptions.map((option, idx) => (
                    <OptionItem
                      key={option.value}
                      option={option}
                      isSelected={value === option.value}
                      isHighlighted={highlightedIndex === idx}
                      showIcon={showIcon}
                      showDescription={showDescription}
                      onSelect={() => handleSelect(option)}
                      className={optionClassName}
                    />
                  ))}
                </div>
              ) : (
                !isLoadingState && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                )
              )}

              {showCreateOption && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex-1">
                    <div className="text-sm">
                      {creatableText.replace("{value}", inputValue.trim())}
                    </div>
                  </div>
                </button>
              )}
            </div>
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

// Helper component for option item
interface OptionItemProps {
  option: AutoCompleteOption;
  isSelected: boolean;
  isHighlighted: boolean;
  showIcon: boolean;
  showDescription: boolean;
  onSelect: () => void;
  className?: string;
}

function OptionItem({
  option,
  isSelected,
  isHighlighted,
  showIcon,
  showDescription,
  onSelect,
  className,
}: OptionItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
        "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
        option.disabled && "cursor-not-allowed opacity-50",
        isHighlighted && "bg-muted",
        className
      )}
    >
      {showIcon && (
        <div className="shrink-0">
          {option.icon || <div className="h-4 w-4" />}
        </div>
      )}
      <div className="flex-1">
        <div className="text-sm font-medium">{option.label}</div>
        {showDescription && option.description && (
          <div className="text-xs text-muted-foreground">
            {option.description}
          </div>
        )}
      </div>
      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
    </button>
  );
}
