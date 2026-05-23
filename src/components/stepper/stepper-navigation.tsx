// components/stepper/stepper-navigation.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepperNavigationProps } from "@/types/stepper.types";

export function StepperNavigation({
  activeStep,
  totalSteps,
  onNext,
  onPrevious,
  onComplete,
  canGoNext = true,
  canGoPrevious = true,
  isLastStep,
  nextLabel = "Next",
  previousLabel = "Back",
  completeLabel = "Complete",
  loading = false,
  className,
}: StepperNavigationProps) {
  return (
    <div className={cn("flex justify-between gap-3 pt-6", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={activeStep === 0 || !canGoPrevious || loading}
      >
        {previousLabel}
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onComplete}
          disabled={!canGoNext || loading}
        >
          {completeLabel}
        </Button>
      ) : (
        <Button type="button" onClick={onNext} disabled={!canGoNext || loading}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
