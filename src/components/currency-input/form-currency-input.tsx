// components/currency-input/form-currency-input.tsx
"use client";

import * as React from "react";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { CurrencyInputProps } from "@/types/currency-input.types";

export function FormCurrencyInput({
  value,
  onChange,
  currency = "IDR",
  locale = "id-ID",
  intlConfig,
  decimals = 0,
  decimalSeparator = ",",
  groupSeparator = ".",
  prefix,
  suffix,
  allowNegative = false,
  allowDecimals = true,
  disableGroupSeparators = false,
  disableAbbreviations = false,
  maxLength,
  max,
  min,
  placeholder = "0",
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  label,
  description,
  className,
  inputClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
  onValueChange,
}: CurrencyInputProps) {
  const [localValue, setLocalValue] = React.useState<string | undefined>(
    value !== undefined && value !== null ? String(value) : undefined
  );

  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setLocalValue(String(value));
    } else {
      setLocalValue(undefined);
    }
  }, [value]);

  const handleValueChange = (
    newValue: string | undefined,
    name?: string,
    values?: { float: number | null; formatted: string; value: string }
  ) => {
    const floatValue = values?.float ?? null;
    setLocalValue(newValue);
    onChange?.(floatValue);
    onValueChange?.(floatValue, name);
  };

  // Determine intl config
  const intlConfigValue = intlConfig || { locale, currency };

  // Determine prefix and suffix based on currency
  const getDefaultPrefix = () => {
    if (prefix) return prefix;
    if (currency === "IDR") return "Rp ";
    if (currency === "USD") return "$ ";
    if (currency === "EUR") return "€ ";
    if (currency === "GBP") return "£ ";
    if (currency === "JPY") return "¥ ";
    return "";
  };

  const getDefaultSuffix = () => {
    if (suffix) return suffix;
    return "";
  };

  const finalPrefix = getDefaultPrefix();
  const finalSuffix = getDefaultSuffix();

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
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
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        {description && (
          <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
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

      <CurrencyInput
        id={`currency-input-${label}`}
        name={`currency-input-${label}`}
        value={localValue}
        onValueChange={handleValueChange}
        intlConfig={intlConfigValue}
        decimalsLimit={decimals}
        decimalSeparator={decimalSeparator}
        groupSeparator={groupSeparator}
        prefix={finalPrefix}
        suffix={finalSuffix}
        allowNegativeValue={allowNegative}
        allowDecimals={allowDecimals}
        disableGroupSeparators={disableGroupSeparators}
        disableAbbreviations={disableAbbreviations}
        maxLength={maxLength}
        max={max}
        min={min}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          inputClassName
        )}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
