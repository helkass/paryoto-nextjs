// components/form-wizard/wizard-navigation.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WizardNavigationProps } from "@/types/form-wizard.types";

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onComplete,
  canGoNext = true,
  canGoPrevious = true,
  isLastStep,
  nextLabel = "Next",
  previousLabel = "Back",
  submitLabel = "Submit",
  loading = false,
  className,
}: WizardNavigationProps) {
  return (
    <div className={cn("flex justify-between gap-3 pt-4", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || !canGoPrevious || loading}
      >
        {previousLabel}
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onComplete}
          disabled={!canGoNext || loading}
        >
          {submitLabel}
        </Button>
      ) : (
        <Button type="button" onClick={onNext} disabled={!canGoNext || loading}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
