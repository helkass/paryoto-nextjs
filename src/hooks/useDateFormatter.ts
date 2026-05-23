import { useCallback, useMemo } from "react";
import {
  formatDate,
  formatDateTime,
  formatDateRange,
  formatTime,
  formatRelativeTime,
  formatDateDifference,
  parseDate,
  COMMON_FORMATS,
  type Locale,
} from "@/lib/date-formatter";
import { DatePickerValue, DateRange } from "@/types/datepicker.types";

export function useDateFormatter(locale: Locale = "en-US") {
  const format = useCallback(
    (date: Date | string | null | undefined, formatStr?: string) =>
      formatDate(date, formatStr, locale),
    [locale]
  );

  const formatWithTime = useCallback(
    (date: Date | string | null | undefined, formatStr?: string) =>
      formatDateTime(date, formatStr, locale),
    [locale]
  );

  const formatTimeOnly = useCallback(
    (date: Date | string | null | undefined, format24h?: boolean) =>
      formatTime(date, format24h, locale),
    [locale]
  );

  const formatRange = useCallback(
    (
      range: DateRange | null | undefined,
      formatStr?: string,
      separator?: string
    ) => formatDateRange(range, formatStr, separator, locale),
    [locale]
  );

  const formatRelative = useCallback(
    (date: Date | string | null | undefined) =>
      formatRelativeTime(date, locale),
    [locale]
  );

  const getDifference = useCallback(
    (
      from: Date | string | null,
      to: Date | string | null,
      unit?: "days" | "hours" | "minutes"
    ) => formatDateDifference(from, to, unit),
    []
  );

  const parse = useCallback(
    (dateString: string, formatStr?: string) =>
      parseDate(dateString, formatStr, locale),
    [locale]
  );

  const getFormatValue = useCallback(
    (value: DatePickerValue, formatStr?: string): string => {
      if (!value) return "";

      if (Array.isArray(value)) {
        return value
          .map((d) => format(d, formatStr))
          .filter(Boolean)
          .join(", ");
      }

      if (value && "from" in value) {
        return formatRange(value as DateRange, formatStr);
      }

      if (value instanceof Date) {
        return format(value, formatStr);
      }

      return "";
    },
    [format, formatRange]
  );

  return useMemo(
    () => ({
      format,
      formatWithTime,
      formatTimeOnly,
      formatRange,
      formatRelative,
      getDifference,
      parse,
      getFormatValue,
      formats: COMMON_FORMATS,
    }),
    [
      format,
      formatWithTime,
      formatTimeOnly,
      formatRange,
      formatRelative,
      getDifference,
      parse,
      getFormatValue,
    ]
  );
}
