// components/ui/select-two.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, Loader2 } from "lucide-react";
import type { SelectOption, SelectTwoProps } from "./select";
import { useSelectTwo } from "@/hooks/useSelectTwo";
import { cn } from "@/lib/utils";

// Mock data untuk development
export const MOCK_MAIN_OPTIONS: SelectOption[] = [
  { id: 1, label: "Technology", value: "tech" },
  { id: 2, label: "Healthcare", value: "health" },
  { id: 3, label: "Finance", value: "finance" },
  { id: 4, label: "Education", value: "edu" },
];

export const MOCK_SUB_OPTIONS: Record<number, SelectOption[]> = {
  1: [
    { id: 11, label: "Frontend Development", value: "frontend" },
    { id: 12, label: "Backend Development", value: "backend" },
    { id: 13, label: "DevOps", value: "devops" },
    { id: 14, label: "Mobile Development", value: "mobile" },
  ],
  2: [
    { id: 21, label: "Cardiology", value: "cardio" },
    { id: 22, label: "Neurology", value: "neuro" },
    { id: 23, label: "Pediatrics", value: "pedia" },
  ],
  3: [
    { id: 31, label: "Investment Banking", value: "ib" },
    { id: 32, label: "Risk Management", value: "risk" },
    { id: 33, label: "Financial Planning", value: "planning" },
  ],
  4: [
    { id: 41, label: "K-12 Education", value: "k12" },
    { id: 42, label: "Higher Education", value: "higher" },
    { id: 43, label: "EdTech", value: "edtech" },
  ],
};

// Mock API functions
export const fetchMainOptionsAPI = async (): Promise<SelectOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_MAIN_OPTIONS;
};

export const fetchSubOptionsAPI = async (
  parentId: string | number
): Promise<SelectOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_SUB_OPTIONS[Number(parentId)] || [];
};

// Komponen Select wrapper dengan shadcn
const ShadcnSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  isLoading = false,
  error,
  size = "default",
}: {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
  size?: "default" | "sm" | "lg";
}) => {
  const sizeClasses = {
    sm: "h-8 text-sm",
    default: "h-10",
    lg: "h-12 text-lg",
  };

  if (isLoading) {
    return <Skeleton className={cn("w-full", sizeClasses[size])} />;
  }

  return (
    <div className="space-y-1">
      <Select
        value={value?.id?.toString()}
        onValueChange={(val) => {
          const selected = options.find((opt) => opt.id.toString() === val);
          if (selected) onChange(selected);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(sizeClasses[size], error && "border-red-500")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Main SelectTwo Component
export const SelectTwo = ({
  options: propOptions,
  value,
  onChange,
  fetchMainOptions: propFetchMain,
  fetchSubOptions: propFetchSub,
  placeholder = { main: "Select category", sub: "Select subcategory" },
  disabled = false,
  required = false,
  clearable = true,
  className,
  size = "default",
  labels,
  isLoading: externalLoading,
  error: externalError,
}: SelectTwoProps) => {
  const {
    mainOptions,
    subOptions,
    selectedMain,
    selectedSub,
    isLoadingMain,
    isLoadingSub,
    errorMain,
    errorSub,
    handleMainChange,
    handleSubChange,
    clearSelection,
  } = useSelectTwo({
    initialValue: value,
    fetchMainOptions: propFetchMain,
    fetchSubOptions: propFetchSub,
    initialMainOptions: propOptions as SelectOption[],
    onChange,
  });

  const isLoading = externalLoading || isLoadingMain || isLoadingSub;
  const error = externalError || errorMain || errorSub;

  if (!propFetchMain && !propOptions) {
    console.warn("SelectTwo requires either options or fetchMainOptions prop");
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3">
        {/* Main Select */}
        <div className="space-y-1.5">
          {labels?.main && (
            <Label
              className={
                required
                  ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                  : ""
              }
            >
              {labels.main}
            </Label>
          )}
          <ShadcnSelect
            options={mainOptions}
            value={selectedMain}
            onChange={handleMainChange}
            placeholder={placeholder.main}
            disabled={disabled}
            isLoading={isLoadingMain}
            error={errorMain}
            size={size}
          />
        </div>

        {/* Sub Select */}
        <div className="space-y-1.5">
          {labels?.sub && <Label>{labels.sub}</Label>}
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <ShadcnSelect
                options={subOptions}
                value={selectedSub}
                onChange={handleSubChange}
                placeholder={placeholder.sub}
                disabled={disabled || !selectedMain}
                isLoading={isLoadingSub}
                error={errorSub}
                size={size}
              />
            </div>
            {clearable && (selectedMain || selectedSub) && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="mt-0.5 shrink-0"
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && !errorMain && !errorSub && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && !errorMain && !errorSub && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
