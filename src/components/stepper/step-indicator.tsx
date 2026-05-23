// components/stepper/step-indicator.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { StepIndicatorProps } from "@/types/stepper.types";

const sizeClasses = {
  sm: {
    step: "h-6 w-6 text-xs",
    icon: "h-3 w-3",
    title: "text-xs",
    description: "text-[10px]",
  },
  md: {
    step: "h-8 w-8 text-sm",
    icon: "h-4 w-4",
    title: "text-sm",
    description: "text-xs",
  },
  lg: {
    step: "h-10 w-10 text-base",
    icon: "h-5 w-5",
    title: "text-base",
    description: "text-sm",
  },
};

export function StepIndicator({
  steps,
  activeStep,
  onStepClick,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  showConnector = true,
  showStepNumbers = true,
  truncateLabels = false,
  allowStepClick = true,
  validateStep,
  stepClassName,
  activeClassName,
  completedClassName,
  connectorClassName,
}: StepIndicatorProps) {
  const isCompleted = (index: number) => index < activeStep;
  const isActive = (index: number) => index === activeStep;
  const isCurrent = (index: number) => index === activeStep;

  const handleStepClick = (index: number) => {
    if (!allowStepClick) return;
    if (steps[index].disabled) return;

    // Validate if trying to go to future step
    if (index > activeStep && validateStep) {
      const isValid = validateStep(activeStep);
      if (!isValid) return;
    }

    onStepClick?.(index);
  };

  // Progress variant
  if (variant === "progress") {
    const progress = ((activeStep + 1) / steps.length) * 100;

    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">
            Step {activeStep + 1} of {steps.length}
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
      <div
        className={cn(
          "flex items-center",
          orientation === "vertical" ? "flex-col gap-2" : "justify-between"
        )}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => handleStepClick(index)}
              disabled={step.disabled}
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                sizeClasses[size].step,
                isActive(index) &&
                  cn(
                    "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                    activeClassName
                  ),
                isCompleted(index) &&
                  cn("bg-primary text-primary-foreground", completedClassName),
                !isActive(index) &&
                  !isCompleted(index) &&
                  "bg-muted text-muted-foreground hover:bg-muted/80",
                step.disabled && "cursor-not-allowed opacity-50",
                stepClassName
              )}
            >
              {isCompleted(index) ? (
                <Check className={sizeClasses[size].icon} />
              ) : (
                step.icon || (showStepNumbers ? index + 1 : null)
              )}
            </button>
            {showConnector &&
              index < steps.length - 1 &&
              orientation === "horizontal" && (
                <div
                  className={cn("h-px flex-1 bg-border", connectorClassName)}
                />
              )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Default & Numbered variants (horizontal)
  if (orientation === "horizontal") {
    return (
      <div className="relative">
        {/* Connector line */}
        {showConnector && (
          <div className="absolute left-0 right-0 top-4 -z-10 h-px bg-border" />
        )}

        <div className="flex justify-between">
          {steps.map((step, index) => {
            const completed = isCompleted(index);
            const active = isActive(index);

            return (
              <div key={step.id} className="flex flex-1 flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={step.disabled}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                    sizeClasses[size].step,
                    active &&
                      cn(
                        "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                        activeClassName
                      ),
                    completed &&
                      cn(
                        "bg-primary text-primary-foreground",
                        completedClassName
                      ),
                    !active &&
                      !completed &&
                      "bg-muted text-muted-foreground hover:bg-muted/80",
                    step.disabled && "cursor-not-allowed opacity-50",
                    stepClassName
                  )}
                >
                  {completed ? (
                    <Check className={sizeClasses[size].icon} />
                  ) : showStepNumbers ? (
                    index + 1
                  ) : (
                    step.icon || index + 1
                  )}
                </button>

                <div className="mt-2 text-center">
                  <div className={cn("font-medium", sizeClasses[size].title)}>
                    {truncateLabels && step.title.length > 20
                      ? `${step.title.slice(0, 20)}...`
                      : step.title}
                    {step.optional && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        "text-muted-foreground",
                        sizeClasses[size].description
                      )}
                    >
                      {truncateLabels && step.description.length > 30
                        ? `${step.description.slice(0, 30)}...`
                        : step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical variant
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const completed = isCompleted(index);
        const active = isActive(index);

        return (
          <div key={step.id} className="relative flex gap-3">
            {/* Connector line */}
            {showConnector && index < steps.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
            )}

            <button
              type="button"
              onClick={() => handleStepClick(index)}
              disabled={step.disabled}
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all shrink-0",
                sizeClasses[size].step,
                active &&
                  cn(
                    "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                    activeClassName
                  ),
                completed &&
                  cn("bg-primary text-primary-foreground", completedClassName),
                !active &&
                  !completed &&
                  "bg-muted text-muted-foreground hover:bg-muted/80",
                step.disabled && "cursor-not-allowed opacity-50",
                stepClassName
              )}
            >
              {completed ? (
                <Check className={sizeClasses[size].icon} />
              ) : showStepNumbers ? (
                index + 1
              ) : (
                step.icon || index + 1
              )}
            </button>

            <div className="flex-1 pb-6">
              <div className={cn("font-medium", sizeClasses[size].title)}>
                {step.title}
                {step.optional && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (Optional)
                  </span>
                )}
              </div>
              {step.description && (
                <div
                  className={cn(
                    "text-muted-foreground",
                    sizeClasses[size].description
                  )}
                >
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
