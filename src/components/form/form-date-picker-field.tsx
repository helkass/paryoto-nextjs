"use client";

import * as React from "react";
import { format, isValid, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FormDatePickerProps,
  DateRange,
  DatePickerValue,
} from "@/types/datepicker.types";
import { TimePicker } from "./time-picker";

export function FormDatePicker({
  value,
  onChange,
  mode = "single",
  label,
  description,
  placeholder = "Pick a date",
  dateFormat = "dd/MM/yyyy",
  required = false,
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDays,
  enableTime = false,
  timeInterval = 30,
  showFooter = false,
  showClearButton = true,
  showTodayButton = false,
  showPresets = false,
  presets = [],
  className,
  inputClassName,
  calendarClassName,
  onApply,
  onClear,
  onClose,
  onOpen,
  loading = false,
  error,
}: FormDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<DatePickerValue>(value);
  const [tempTime, setTempTime] = React.useState<string>(() => {
    if (value instanceof Date && isValid(value)) {
      return format(value, "HH:mm");
    }
    return "00:00";
  });

  // Sync tempDate when value changes externally
  React.useEffect(() => {
    if (!isOpen) {
      setTempDate(value);
      if (value instanceof Date && isValid(value)) {
        setTempTime(format(value, "HH:mm"));
      }
    }
  }, [value, isOpen]);

  const handleDateSelect = React.useCallback(
    (date: Date | Date[] | { from: Date; to: Date } | null) => {
      if (!date) {
        setTempDate(null);
        return;
      }

      // Handle multiple dates
      if (Array.isArray(date)) {
        setTempDate(date);
        return;
      }

      // Handle date range
      if (date && typeof date === "object" && "from" in date) {
        setTempDate(date as DateRange);
        return;
      }

      // Handle single date
      if (date instanceof Date) {
        if (!isValid(date)) return;

        const newDate = new Date(date);

        if (enableTime && tempTime) {
          const timeParts = tempTime.split(":").map(Number);
          newDate.setHours(timeParts[0] || 0, timeParts[1] || 0, 0, 0);
        } else {
          newDate.setHours(0, 0, 0, 0);
        }

        setTempDate(newDate);
      }
    },
    [enableTime, tempTime]
  );

  const handleApply = React.useCallback(() => {
    const isValidValue =
      tempDate instanceof Date
        ? isValid(tempDate)
        : tempDate &&
          (typeof tempDate === "object" && "from" in tempDate
            ? (tempDate.from && isValid(tempDate.from)) ||
              (tempDate.to && isValid(tempDate.to))
            : Array.isArray(tempDate) && tempDate.length > 0);

    if (isValidValue) {
      onChange?.(tempDate);
      onApply?.(tempDate);
      setIsOpen(false);
    }
  }, [tempDate, onChange, onApply]);

  const handleClear = React.useCallback(() => {
    setTempDate(null);
    setTempTime("00:00");
    onChange?.(null);
    onClear?.();
  }, [onChange, onClear]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open) {
        onOpen?.();
        setTempDate(value);
        if (value instanceof Date && isValid(value)) {
          setTempTime(format(value, "HH:mm"));
        } else {
          setTempTime("00:00");
        }
      } else {
        onClose?.();
      }
    },
    [value, onOpen, onClose]
  );

  const displayValue = React.useMemo(() => {
    if (!value) return "";

    try {
      if (
        mode === "range" &&
        value &&
        typeof value === "object" &&
        "from" in value
      ) {
        const rangeValue = value as DateRange;
        const fromStr =
          rangeValue.from && isValid(rangeValue.from)
            ? format(rangeValue.from, dateFormat)
            : "";
        const toStr =
          rangeValue.to && isValid(rangeValue.to)
            ? format(rangeValue.to, dateFormat)
            : "";
        return fromStr && toStr ? `${fromStr} - ${toStr}` : "";
      }

      if (Array.isArray(value)) {
        return value
          .filter((d) => d instanceof Date && isValid(d))
          .map((d) => format(d, dateFormat))
          .join(", ");
      }

      if (value instanceof Date && isValid(value)) {
        return format(value, dateFormat);
      }

      return "";
    } catch (error) {
      console.error("Error formatting display value:", error);
      return "";
    }
  }, [value, dateFormat, mode]);

  const isDisabled = React.useCallback(
    (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disabledDates && disabledDates.length > 0) {
        if (disabledDates.some((d) => isSameDay(d, date))) return true;
      }
      if (disabledDays && disabledDays.includes(date.getDay())) return true;
      return false;
    },
    [minDate, maxDate, disabledDates, disabledDays]
  );

  // Transform tempDate to proper Calendar selected format (convert to Date[] or undefined to match Calendar's selected prop)
  const calendarSelected = React.useMemo(() => {
    if (!tempDate) return undefined;

    if (tempDate instanceof Date && isValid(tempDate)) {
      return [tempDate];
    }

    if (typeof tempDate === "object" && "from" in tempDate) {
      const range = tempDate as DateRange;
      const fromValid =
        range.from && isValid(range.from) ? range.from : undefined;
      const toValid = range.to && isValid(range.to) ? range.to : undefined;
      const arr: Date[] = [];
      if (fromValid) arr.push(fromValid);
      if (toValid) arr.push(toValid);
      return arr.length > 0 ? arr : undefined;
    }

    if (Array.isArray(tempDate)) {
      const arr = tempDate.filter((d) => d instanceof Date && isValid(d));
      return arr.length > 0 ? arr : undefined;
    }

    return undefined;
  }, [tempDate]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          className={
            required
              ? "after:content-['*'] after:ml-1 after:text-destructive"
              : ""
          }
        >
          {label}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !displayValue && "text-muted-foreground",
              inputClassName
            )}
            disabled={disabled || loading || readOnly}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue || placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <div className={cn("p-4", calendarClassName)}>
            <Calendar
              mode={mode as "single" | "multiple" | "range"}
              selected={calendarSelected}
              onSelect={handleDateSelect}
              disabled={isDisabled}
              initialFocus
            />

            {enableTime && (
              <>
                <Separator className="my-3" />
                <TimePicker
                  value={
                    tempDate instanceof Date && isValid(tempDate)
                      ? tempDate
                      : undefined
                  }
                  onChange={(date) => {
                    if (isValid(date)) {
                      setTempDate(date);
                      setTempTime(format(date, "HH:mm"));
                    }
                  }}
                  interval={timeInterval}
                  disabled={disabled}
                />
              </>
            )}

            {showPresets && presets.length > 0 && (
              <>
                <Separator className="my-3" />
                <ScrollArea className="space-y-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setTempDate(preset.value);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </ScrollArea>
              </>
            )}

            {showFooter && (
              <>
                <Separator className="my-3" />
                <div className="flex gap-2">
                  {showClearButton && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  )}
                  {showTodayButton && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        handleDateSelect(today);
                      }}
                    >
                      Today
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleApply}
                    disabled={!tempDate}
                  >
                    Apply
                  </Button>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
