// components/form-wizard/wizard-step-indicator.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { WizardStepIndicatorProps } from "@/types/form-wizard.types";

const sizeClasses = {
  sm: {
    step: "h-6 w-6 text-xs",
    icon: "h-3 w-3",
    title: "text-xs",
  },
  md: {
    step: "h-8 w-8 text-sm",
    icon: "h-4 w-4",
    title: "text-sm",
  },
  lg: {
    step: "h-10 w-10 text-base",
    icon: "h-5 w-5",
    title: "text-base",
  },
};

export function WizardStepIndicator({
  steps,
  currentStep,
  onStepClick,
  variant = "default",
  orientation = "horizontal",
  size = "md",
  className,
}: WizardStepIndicatorProps) {
  const isCompleted = (index: number) => index < currentStep;
  const isCurrent = (index: number) => index === currentStep;

  // Progress variant
  if (variant === "progress") {
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Icons variant
  if (variant === "icons") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={!step.isValid && index > currentStep}
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                sizeClasses[size].step,
                isCurrent(index) &&
                  "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                isCompleted(index) && "bg-primary text-primary-foreground",
                !isCurrent(index) &&
                  !isCompleted(index) &&
                  "bg-muted text-muted-foreground hover:bg-muted/80",
                (step.isOptional || step.isValid) &&
                  index > currentStep &&
                  "cursor-pointer opacity-60 hover:opacity-100"
              )}
            >
              {isCompleted(index) ? (
                <Check className={sizeClasses[size].icon} />
              ) : (
                step.icon || index + 1
              )}
            </button>
            {index < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Numbered variant
  if (variant === "numbered") {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => {
          const completed = isCompleted(index);
          const current = isCurrent(index);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={!step.isValid && index > currentStep}
              className={cn(
                "flex w-full items-center gap-3 text-left transition-colors",
                (step.isOptional || step.isValid) &&
                  index > currentStep &&
                  "cursor-pointer opacity-60 hover:opacity-100"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full font-medium transition-all",
                  sizeClasses[size].step,
                  current &&
                    "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                  completed && "bg-primary text-primary-foreground",
                  !current && !completed && "bg-muted text-muted-foreground"
                )}
              >
                {completed ? (
                  <Check className={sizeClasses[size].icon} />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex-1">
                <div className={cn("font-medium", sizeClasses[size].title)}>
                  {step.title}
                  {step.isOptional && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Optional)
                    </span>
                  )}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Default variant (horizontal with labels)
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = isCompleted(index);
          const current = isCurrent(index);

          return (
            <div key={step.id} className="flex flex-1 flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={!step.isValid && index > currentStep}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  current &&
                    "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                  completed && "bg-primary text-primary-foreground",
                  !current &&
                    !completed &&
                    "bg-muted text-muted-foreground hover:bg-muted/80",
                  (step.isOptional || step.isValid) &&
                    index > currentStep &&
                    "cursor-pointer opacity-60 hover:opacity-100"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : index + 1}
              </button>
              <div className="mt-2 text-center">
                <div className={cn("font-medium", sizeClasses[size].title)}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Progress line */}
      <div className="absolute left-0 top-4 -z-10 h-px w-full -translate-y-1/2 bg-border" />
    </div>
  );
}
