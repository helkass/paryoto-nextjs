// components/forms/time-picker.tsx
"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimePickerProps } from "@/types/datepicker.types";

export function TimePicker({
  value,
  onChange,
  interval = 30,
  format = "24h",
  disabled = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const generateTimeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        slots.push(date);
      }
    }
    return slots;
  }, [interval]);

  const formatTime = React.useCallback(
    (date: Date): string => {
      if (!date || isNaN(date.getTime())) return "";

      if (format === "12h") {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes.toString().padStart(2, "0");
        return `${hours}:${minutesStr} ${ampm}`;
      }
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    [format]
  );

  const getCurrentTime = React.useCallback((): string => {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) return "";
    return formatTime(value);
  }, [value, formatTime]);

  const handleSelect = React.useCallback(
    (time: Date) => {
      const selectedTime = new Date(time);

      // Preserve the original date if value exists
      if (value && value instanceof Date && !isNaN(value.getTime())) {
        selectedTime.setFullYear(value.getFullYear());
        selectedTime.setMonth(value.getMonth());
        selectedTime.setDate(value.getDate());
      }

      onChange?.(selectedTime);
      setOpen(false);
    },
    [value, onChange]
  );

  // Get current time display
  const displayValue = getCurrentTime();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          type="button"
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <ScrollArea className="h-64">
          <div className="p-1">
            {generateTimeSlots.map((time, idx) => {
              const timeString = formatTime(time);
              const isSelected =
                value &&
                value instanceof Date &&
                value.getHours() === time.getHours() &&
                value.getMinutes() === time.getMinutes();

              return (
                <Button
                  key={idx}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handleSelect(time)}
                  type="button"
                >
                  {timeString}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
