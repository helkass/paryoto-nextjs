// components/forms/form-date-picker.tsx
"use client";

import * as React from "react";
import { format, isValid, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
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
import { FormDatePickerProps, DateRange } from "@/types/datepicker.types";
import { TimePicker } from "./time-picker";

const dateFormats: Record<string, string> = {
  "dd/MM/yyyy": "dd/MM/yyyy",
  "MM/dd/yyyy": "MM/dd/yyyy",
  "yyyy/MM/dd": "yyyy/MM/dd",
  "dd-MM-yyyy": "dd-MM-yyyy",
  "MM-dd-yyyy": "MM-dd-yyyy",
  "yyyy-MM-dd": "yyyy-MM-dd",
};

const defaultPresets = [
  { label: "Today", value: new Date() },
  { label: "Tomorrow", value: new Date(Date.now() + 86400000) },
  { label: "Yesterday", value: new Date(Date.now() - 86400000) },
  { label: "Next Week", value: new Date(Date.now() + 7 * 86400000) },
  { label: "Last Week", value: new Date(Date.now() - 7 * 86400000) },
];

const rangePresets = [
  { label: "Today", value: { from: new Date(), to: new Date() } },
  {
    label: "Yesterday",
    value: {
      from: new Date(Date.now() - 86400000),
      to: new Date(Date.now() - 86400000),
    },
  },
  {
    label: "Last 7 Days",
    value: { from: new Date(Date.now() - 7 * 86400000), to: new Date() },
  },
  {
    label: "Last 30 Days",
    value: { from: new Date(Date.now() - 30 * 86400000), to: new Date() },
  },
  {
    label: "This Month",
    value: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  },
];

export function FormDatePicker({
  value,
  onChange,
  mode = "single",
  dateFormat = "dd/MM/yyyy",
  timeFormat = "24h",
  placeholder = "Select date",
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDays = [],
  enableTime = false,
  timeInterval = 30,
  presets: customPresets,
  showFooter = true,
  showClearButton = true,
  showTodayButton = true,
  showPresets = true,
  numberOfMonths = 1,
  disabledPastDates = false,
  disabledFutureDates = false,
  className,
  inputClassName,
  calendarClassName,
  onApply,
  onClear,
  onClose,
  onOpen,
  loading = false,
  error,
  customTrigger,
  customInput,
}: FormDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<any>(null);
  const [tempTime, setTempTime] = React.useState<Date | undefined>(undefined);
  // Initialize tempDate when value changes or modal opens
  React.useEffect(() => {
    if (open) {
      if (mode === "single" && value instanceof Date && isValid(value)) {
        setTempDate(value);
        if (enableTime && value instanceof Date) {
          // Safely create time from valid date
          const timeDate = new Date(value);
          if (isValid(timeDate)) {
            setTempTime(timeDate);
          }
        }
      } else if (
        mode === "range" &&
        value &&
        typeof value === "object" &&
        "from" in value
      ) {
        setTempDate(value);
      } else if (mode === "multiple" && Array.isArray(value)) {
        setTempDate(value);
      } else {
        setTempDate(null);
        setTempTime(undefined);
      }
    }
  }, [open, value, mode, enableTime]);

  const formatDate = React.useCallback(
    (date: Date | null | undefined): string => {
      if (!date || !isValid(date)) return "";
      try {
        return format(date, dateFormats[dateFormat] || "dd/MM/yyyy");
      } catch {
        return "";
      }
    },
    [dateFormat]
  );

  const formatTime = React.useCallback(
    (date: Date | null | undefined): string => {
      if (!date || !isValid(date)) return "";
      const formatStr = timeFormat === "12h" ? "hh:mm a" : "HH:mm";
      return format(date, formatStr);
    },
    [timeFormat]
  );

  const formatRangeDisplay = React.useCallback(
    (range: DateRange | null | undefined): string => {
      if (!range?.from || !isValid(range.from)) return "";
      if (range.to && isValid(range.to) && !isSameDay(range.from, range.to)) {
        return `${formatDate(range.from)} - ${formatDate(range.to)}`;
      }
      return formatDate(range.from);
    },
    [formatDate]
  );

  const getDisplayValue = React.useCallback(() => {
    if (mode === "single" && value instanceof Date && isValid(value)) {
      const dateStr = formatDate(value);
      if (enableTime) {
        const timeStr = formatTime(value);
        return timeStr ? `${dateStr} ${timeStr}` : dateStr;
      }
      return dateStr;
    }
    if (
      mode === "range" &&
      value &&
      typeof value === "object" &&
      "from" in value
    ) {
      return formatRangeDisplay(value as DateRange);
    }
    if (mode === "multiple" && Array.isArray(value) && value.length > 0) {
      return value.map(formatDate).join(", ");
    }
    return "";
  }, [mode, value, formatDate, formatTime, enableTime, formatRangeDisplay]);
  const handleSelect = (selected: any) => {
    if (readOnly || disabled) return;

    if (mode === "single") {
      if (selected) {
        const selectedDate = new Date(selected);
        if (isValid(selectedDate)) {
          const newDate = new Date(selectedDate);

          if (enableTime && tempTime && isValid(tempTime)) {
            newDate.setHours(tempTime.getHours(), tempTime.getMinutes(), 0, 0);
          } else {
            newDate.setHours(0, 0, 0, 0);
          }

          setTempDate(newDate);

          if (!showFooter) {
            onChange?.(newDate);
            onApply?.(newDate);
            setOpen(false);
          }
        }
      } else {
        setTempDate(null);
        if (!showFooter) {
          onChange?.(null);
          onApply?.(null);
          setOpen(false);
        }
      }
    } else if (mode === "range") {
      if (selected && (selected.from || selected.to)) {
        setTempDate(selected);

        if (
          !showFooter &&
          selected?.from &&
          isValid(new Date(selected.from)) &&
          selected?.to &&
          isValid(new Date(selected.to))
        ) {
          onChange?.(selected);
          onApply?.(selected);
          setOpen(false);
        }
      }
    } else if (mode === "multiple") {
      if (Array.isArray(selected)) {
        setTempDate(selected);
        if (!showFooter) {
          onChange?.(selected);
          onApply?.(selected);
        }
      }
    }
  };

  const handleTimeChange = (time: Date) => {
    if (!isValid(time)) return;
    setTempTime(time);

    if (
      mode === "single" &&
      tempDate instanceof Date &&
      isValid(tempDate) &&
      !showFooter
    ) {
      const newDate = new Date(tempDate);
      newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
      onChange?.(newDate);
      onApply?.(newDate);
    }
  };
  const handleApply = () => {
    let finalValue = tempDate;

    if (mode === "single" && tempDate instanceof Date && isValid(tempDate)) {
      finalValue = new Date(tempDate);

      if (enableTime && tempTime && isValid(tempTime)) {
        finalValue.setHours(tempTime.getHours(), tempTime.getMinutes(), 0, 0);
      }
    }

    onChange?.(finalValue);
    onApply?.(finalValue);
    setOpen(false);
  };

  const handleClear = () => {
    setTempDate(null);
    setTempTime(undefined);
    onChange?.(null);
    onClear?.();
    if (mode !== "range" && mode !== "multiple") {
      setOpen(false);
    }
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mode === "single") {
      setTempDate(today);
      if (enableTime) {
        const now = new Date();
        setTempTime(now);
      }
      if (!showFooter) {
        const finalDate = enableTime ? new Date() : today;
        onChange?.(finalDate);
        onApply?.(finalDate);
        setOpen(false);
      }
    } else if (mode === "range") {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      setTempDate({ from: today, to: today });
      if (!showFooter) {
        onChange?.({ from: today, to: today });
        onApply?.({ from: today, to: today });
        setOpen(false);
      }
    }
  };

  const handlePreset = (presetValue: Date | DateRange) => {
    setTempDate(presetValue);
    if (!showFooter) {
      onChange?.(presetValue);
      onApply?.(presetValue);
      setOpen(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (!isValid(date)) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (disabledPastDates && date < today) return true;
    if (disabledFutureDates && date > today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disabledDates.some((d) => isValid(d) && isSameDay(d, date)))
      return true;
    if (disabledDays.includes(date.getDay())) return true;
    return false;
  };

  const presets =
    customPresets || (mode === "range" ? rangePresets : defaultPresets);
  const displayValue = getDisplayValue();

  const Trigger = customTrigger || (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start text-left font-normal",
        !displayValue && "text-muted-foreground",
        error && "border-destructive",
        inputClassName
      )}
      disabled={disabled || loading}
      onClick={() => setOpen(!open)}
      type="button"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {displayValue || placeholder}
      {showClearButton && displayValue && (
        <X
          className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
        />
      )}
    </Button>
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          className={cn(
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </Label>
      )}

      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) {
            onOpen?.();
          } else {
            onClose?.();
          }
        }}
      >
        <PopoverTrigger asChild>{customInput || Trigger}</PopoverTrigger>
        <PopoverContent
          className={cn("w-auto p-0", calendarClassName)}
          align="start"
        >
          <div className="flex">
            {/* Presets Sidebar */}
            {showPresets && presets.length > 0 && (
              <div className="border-r p-2 w-36">
                <ScrollArea className="h-[320px]">
                  <div className="space-y-1">
                    {presets.map((preset, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => handlePreset(preset.value)}
                        type="button"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Calendar */}
            <div className="p-3">
              {mode === "range" ? (
                <Calendar
                  mode="range"
                  selected={tempDate as DateRange}
                  onSelect={handleSelect}
                  numberOfMonths={numberOfMonths}
                  disabled={isDateDisabled}
                  locale={id}
                  className="rounded-md"
                />
              ) : mode === "multiple" ? (
                <Calendar
                  mode="multiple"
                  selected={tempDate as Date[]}
                  onSelect={handleSelect}
                  numberOfMonths={numberOfMonths}
                  disabled={isDateDisabled}
                  locale={id}
                  className="rounded-md"
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={tempDate as Date}
                  onSelect={handleSelect}
                  numberOfMonths={numberOfMonths}
                  disabled={isDateDisabled}
                  locale={id}
                  className="rounded-md"
                />
              )}

              {/* Time Picker */}
              {enableTime && mode === "single" && (
                <div className="mt-3 pt-3 border-t">
                  <Label className="text-xs mb-2 block">Select Time</Label>
                  <TimePicker
                    value={
                      tempTime ||
                      (tempDate instanceof Date && isValid(tempDate)
                        ? tempDate
                        : undefined)
                    }
                    onChange={handleTimeChange}
                    interval={timeInterval}
                    format={timeFormat}
                    disabled={disabled || !tempDate}
                  />
                </div>
              )}

              {/* Footer */}
              {showFooter && (
                <>
                  <Separator className="my-3" />
                  <div className="flex justify-between gap-2">
                    {showTodayButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToday}
                        type="button"
                      >
                        Today
                      </Button>
                    )}
                    <div className="flex gap-2 ml-auto">
                      {showClearButton && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClear}
                          type="button"
                        >
                          Clear
                        </Button>
                      )}{" "}
                      <Button
                        size="sm"
                        onClick={handleApply}
                        type="button"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
