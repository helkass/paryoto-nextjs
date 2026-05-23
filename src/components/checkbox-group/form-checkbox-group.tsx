// components/checkbox-group/form-checkbox-group.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxCard } from './checkbox-card';
import { CheckboxGroupProps } from '@/types/checkbox-group.types';

const layoutClasses = {
  horizontal: 'flex flex-row flex-wrap gap-4',
  vertical: 'flex flex-col gap-3',
  grid: 'grid',
};

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function FormCheckboxGroup({
  value = [],
  onChange,
  options,
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  layout = 'vertical',
  columns = 2,
  variant = 'default',
  size = 'md',
  selectAll = false,
  selectAllLabel = 'Select All',
  maxSelections,
  minSelections,
  className,
  checkboxClassName,
  labelClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
  onSelectionChange,
}: CheckboxGroupProps) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value);

  // Gunakan useRef untuk mencegah infinite loop
  const isInitialMount = React.useRef(true);

  // Sync external value to internal state - hanya saat value berubah dari luar
  React.useEffect(() => {
    // Jangan sync saat initial mount karena sudah di-set dari initial value
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Hanya update jika value berbeda dari state saat ini
    if (JSON.stringify(value) !== JSON.stringify(selectedValues)) {
      setSelectedValues(value);
    }
  }, [value, selectedValues]);

  const handleChange = (optionValue: string, checked: boolean) => {
    if (readOnly) return;
    
    let newSelected: string[];
    if (checked) {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      newSelected = [...selectedValues, optionValue];
    } else {
      newSelected = selectedValues.filter(v => v !== optionValue);
    }
    
    setSelectedValues(newSelected);
    onChange?.(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectAll = () => {
    if (readOnly) return;
    
    const selectableOptions = options.filter(opt => !opt.disabled);
    const allSelected = selectableOptions.every(opt => selectedValues.includes(opt.value));
    
    let newSelected: string[];
    if (allSelected) {
      newSelected = selectedValues.filter(v => !selectableOptions.map(opt => opt.value).includes(v));
    } else {
      const toAdd = selectableOptions.map(opt => opt.value);
      newSelected = [...new Set([...selectedValues, ...toAdd])];
      
      if (maxSelections && newSelected.length > maxSelections) {
        newSelected = newSelected.slice(0, maxSelections);
      }
    }
    
    setSelectedValues(newSelected);
    onChange?.(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isAllSelected = React.useMemo(() => {
    const selectableOptions = options.filter(opt => !opt.disabled);
    return selectableOptions.length > 0 && 
           selectableOptions.every(opt => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  const isIndeterminate = React.useMemo(() => {
    const selectableOptions = options.filter(opt => !opt.disabled);
    const selectedCount = selectableOptions.filter(opt => selectedValues.includes(opt.value)).length;
    return selectedCount > 0 && selectedCount < selectableOptions.length;
  }, [options, selectedValues]);

  const getValidationMessage = () => {
    if (minSelections && selectedValues.length < minSelections) {
      return `Please select at least ${minSelections} option(s)`;
    }
    if (maxSelections && selectedValues.length > maxSelections) {
      return `Please select at most ${maxSelections} option(s)`;
    }
    return null;
  };

  const validationMessage = getValidationMessage();
  const displayError = error || validationMessage;

  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {label && (
          <Label className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
            {label}
          </Label>
        )}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getLayoutClass = () => {
    if (layout === 'grid') {
      return cn(layoutClasses.grid, gridColumns[columns]);
    }
    return layoutClasses[layout];
  };

  const generateName = React.useId();

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with label and select all */}
      <div className="flex items-center justify-between">
        {label && (
          <Label className={cn(required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : "", labelClassName)}>
            {label}
          </Label>
        )}
        {selectAll && !disabled && !readOnly && options.length > 0 && (
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={handleSelectAll}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectAll();
              }
            }}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <Checkbox
              checked={isAllSelected}
              className="h-3.5 w-3.5 pointer-events-none"
              data-state={isIndeterminate ? 'indeterminate' : isAllSelected ? 'checked' : 'unchecked'}
            />
            {selectAllLabel}
          </div>
        )}
      </div>

      {/* Selection limit info */}
      {(maxSelections || minSelections) && (
        <div className="text-xs text-muted-foreground">
          {maxSelections && `Maximum ${maxSelections} selection(s) allowed. `}
          {minSelections && `Minimum ${minSelections} selection(s) required. `}
          <span className="font-medium">Selected: {selectedValues.length}</span>
        </div>
      )}

      {/* Checkbox options */}
      <div
        className={cn(getLayoutClass(), variant === 'button' && 'inline-flex flex-wrap gap-2')}
        role="group"
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {options.map((option) => (
          <CheckboxCard
            key={option.value}
            option={option}
            isChecked={selectedValues.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            disabled={disabled}
            name={generateName}
            variant={variant}
            size={size}
            className={checkboxClassName}
          />
        ))}
      </div>

      {/* Description */}
      {description && !displayError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Error */}
      {displayError && (
        <p className="text-xs text-destructive">{displayError}</p>
      )}
    </div>
  );
}