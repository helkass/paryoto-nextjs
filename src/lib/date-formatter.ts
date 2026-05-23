import {
  format as dateFnsFormat,
  parse as dateFnsParse,
  isValid,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addMonths,
  addYears,
  parseISO,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { DateRange, DateFormat } from "@/types/datepicker.types";

export type Locale = "en-US" | "id";

// Default date formats
export const DATE_FORMATS: Record<DateFormat, string> = {
  "dd/MM/yyyy": "dd/MM/yyyy",
  "MM/dd/yyyy": "MM/dd/yyyy",
  "yyyy/MM/dd": "yyyy/MM/dd",
  "dd-MM-yyyy": "dd-MM-yyyy",
  "MM-dd-yyyy": "MM-dd-yyyy",
  "yyyy-MM-dd": "yyyy-MM-dd",
};

// Common formats
export const COMMON_FORMATS = {
  DATE_ONLY: "dd/MM/yyyy",
  DATE_TIME: "dd/MM/yyyy HH:mm",
  DATE_TIME_SECONDS: "dd/MM/yyyy HH:mm:ss",
  TIME_ONLY: "HH:mm",
  TIME_SECONDS: "HH:mm:ss",
  MONTH_YEAR: "MMMM yyyy",
  FULL_DATE: "EEEE, MMMM d, yyyy",
  ISO_DATE: "yyyy-MM-dd",
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

/**
 * Get locale object from locale string
 */
export function getLocale(locale: Locale) {
  return locale === "id" ? idLocale : enUS;
}

/**
 * Format a single date
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatStr: string = COMMON_FORMATS.DATE_ONLY,
  locale: Locale = "en-US"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";

    return dateFnsFormat(dateObj, formatStr, { locale: getLocale(locale) });
  } catch {
    return "";
  }
}

/**
 * Format date range
 */
export function formatDateRange(
  range: DateRange | null | undefined,
  formatStr: string = COMMON_FORMATS.DATE_ONLY,
  separator: string = " - ",
  locale: Locale = "en-US"
): string {
  if (!range?.from || !range?.to) return "";

  try {
    const fromStr = formatDate(range.from, formatStr, locale);
    const toStr = formatDate(range.to, formatStr, locale);
    return `${fromStr}${separator}${toStr}`;
  } catch {
    return "";
  }
}

/**
 * Format multiple dates
 */
export function formatMultipleDates(
  dates: Date[] | null | undefined,
  formatStr: string = COMMON_FORMATS.DATE_ONLY,
  separator: string = ", ",
  locale: Locale = "en-US"
): string {
  if (!dates || dates.length === 0) return "";

  try {
    return dates
      .map((date) => formatDate(date, formatStr, locale))
      .filter(Boolean)
      .join(separator);
  } catch {
    return "";
  }
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: Date | string | null | undefined,
  formatStr: string = COMMON_FORMATS.DATE_TIME,
  locale: Locale = "en-US"
): string {
  return formatDate(date, formatStr, locale);
}

/**
 * Format time only
 */
export function formatTime(
  date: Date | string | null | undefined,
  format24h: boolean = true,
  locale: Locale = "en-US"
): string {
  const formatStr = format24h ? COMMON_FORMATS.TIME_ONLY : "hh:mm a";
  return formatDate(date, formatStr, locale);
}

/**
 * Format as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string | null | undefined,
  locale: Locale = "en-US"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: getLocale(locale),
    });
  } catch {
    return "";
  }
}

/**
 * Format as relative time strict (e.g., "2 hours")
 */
export function formatRelativeTimeStrict(
  date: Date | string | null | undefined,
  locale: Locale = "en-US"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";

    return formatDistanceToNowStrict(dateObj, {
      addSuffix: true,
      locale: getLocale(locale),
    });
  } catch {
    return "";
  }
}

/**
 * Format date difference between two dates
 */
export function formatDateDifference(
  from: Date | string | null | undefined,
  to: Date | string | null | undefined,
  unit: "days" | "hours" | "minutes" = "days"
): number {
  if (!from || !to) return 0;

  try {
    const fromDate = typeof from === "string" ? parseISO(from) : from;
    const toDate = typeof to === "string" ? parseISO(to) : to;

    if (!isValid(fromDate) || !isValid(toDate)) return 0;

    switch (unit) {
      case "days":
        return differenceInDays(toDate, fromDate);
      case "hours":
        return differenceInHours(toDate, fromDate);
      case "minutes":
        return differenceInMinutes(toDate, fromDate);
      default:
        return 0;
    }
  } catch {
    return 0;
  }
}

/**
 * Parse date from string
 */
export function parseDate(
  dateString: string,
  formatStr: string = COMMON_FORMATS.ISO_DATE,
  locale: Locale = "en-US"
): Date | null {
  try {
    const parsed = dateFnsParse(dateString, formatStr, new Date(), {
      locale: getLocale(locale),
    });
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Check if two dates are the same day
 */
export function isSameDateDay(
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): boolean {
  if (!date1 || !date2) return false;

  try {
    const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const d2 = typeof date2 === "string" ? parseISO(date2) : date2;

    if (!isValid(d1) || !isValid(d2)) return false;
    return isSameDay(d1, d2);
  } catch {
    return false;
  }
}

/**
 * Check if two dates are in the same month
 */
export function isSameDateMonth(
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): boolean {
  if (!date1 || !date2) return false;

  try {
    const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const d2 = typeof date2 === "string" ? parseISO(date2) : date2;

    if (!isValid(d1) || !isValid(d2)) return false;
    return isSameMonth(d1, d2);
  } catch {
    return false;
  }
}

/**
 * Check if two dates are in the same year
 */
export function isSameDateYear(
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): boolean {
  if (!date1 || !date2) return false;

  try {
    const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const d2 = typeof date2 === "string" ? parseISO(date2) : date2;

    if (!isValid(d1) || !isValid(d2)) return false;
    return isSameYear(d1, d2);
  } catch {
    return false;
  }
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return startOfDay(d);
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return endOfDay(d);
}

/**
 * Get start of week
 */
export function getStartOfWeek(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return startOfWeek(d);
}

/**
 * Get end of week
 */
export function getEndOfWeek(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return endOfWeek(d);
}

/**
 * Get start of month
 */
export function getStartOfMonth(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return startOfMonth(d);
}

/**
 * Get end of month
 */
export function getEndOfMonth(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return endOfMonth(d);
}

/**
 * Get start of year
 */
export function getStartOfYear(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return startOfYear(d);
}

/**
 * Get end of year
 */
export function getEndOfYear(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return endOfYear(d);
}

/**
 * Add days to date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return addDays(d, days);
}

/**
 * Add months to date
 */
export function addMonthsToDate(date: Date | string, months: number): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return addMonths(d, months);
}

/**
 * Add years to date
 */
export function addYearsToDate(date: Date | string, years: number): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return addYears(d, years);
}

/**
 * Validate if string is valid date
 */
export function isValidDate(date: any): date is Date | string {
  if (date instanceof Date) {
    return isValid(date);
  }
  if (typeof date === "string") {
    try {
      return isValid(parseISO(date));
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Format date range for display (e.g., "Dec 15 - 20, 2024")
 */
export function formatDateRangeCompact(
  range: DateRange | null | undefined,
  locale: Locale = "en-US"
): string {
  if (!range?.from || !range?.to) return "";

  try {
    const fromDate = range.from;
    const toDate = range.to;

    // Same day
    if (isSameDay(fromDate, toDate)) {
      return formatDate(fromDate, COMMON_FORMATS.FULL_DATE, locale);
    }

    // Same month
    if (isSameMonth(fromDate, toDate)) {
      const fromStr = dateFnsFormat(fromDate, "MMM d", {
        locale: getLocale(locale),
      });
      const toStr = formatDate(toDate, "d, yyyy", locale);
      return `${fromStr} - ${toStr}`;
    }

    // Same year
    if (isSameYear(fromDate, toDate)) {
      const fromStr = dateFnsFormat(fromDate, "MMM d", {
        locale: getLocale(locale),
      });
      const toStr = formatDate(toDate, "MMM d, yyyy", locale);
      return `${fromStr} - ${toStr}`;
    }

    // Different years
    return formatDateRange(range, "MMM d, yyyy", " - ", locale);
  } catch {
    return "";
  }
}
