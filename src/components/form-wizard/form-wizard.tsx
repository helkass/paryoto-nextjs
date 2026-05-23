// components/form-wizard/form-wizard.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { WizardNavigation } from "./wizard-navigation";
import { FormWizardProps } from "@/types/form-wizard.types";

export function FormWizard({
  steps,
  currentStep: externalCurrentStep,
  onChangeStep,
  children,
  showNavigation = true,
  nextLabel = "Next",
  previousLabel = "Back",
  submitLabel = "Submit",
  canGoNext = true,
  canGoPrevious = true,
  validateStep,
  variant = "default",
  orientation = "horizontal",
  size = "md",
  showProgress = false,
  progressLabel,
  className,
  stepsClassName,
  contentClassName,
  navigationClassName,
  loading = false,
  error,
  onStepChange,
  onComplete,
  onSubmit,
}: FormWizardProps) {
  const [internalCurrentStep, setInternalCurrentStep] = React.useState(0);
  const [isValidating, setIsValidating] = React.useState(false);
  const [stepValidation, setStepValidation] = React.useState<
    Record<number, boolean>
  >({});

  // Use external or internal step
  const currentStep =
    externalCurrentStep !== undefined
      ? externalCurrentStep
      : internalCurrentStep;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Memoized computed values
  const stepStatus = React.useMemo(() => {
    return steps.map((step, index) => ({
      ...step,
      isCompleted: index < currentStep,
      isCurrent: index === currentStep,
      isValid: stepValidation[index] ?? step.isValid ?? true,
    }));
  }, [steps, currentStep, stepValidation]);

  const progressText = React.useMemo(() => {
    if (progressLabel) {
      return progressLabel(currentStep + 1, steps.length);
    }
    return `Step ${currentStep + 1} of ${steps.length}`;
  }, [currentStep, steps.length, progressLabel]);

  // Handle step change
  const handleStepChange = React.useCallback(
    async (step: number) => {
      if (step === currentStep) return;
      if (step < 0 || step >= steps.length) return;

      const direction = step > currentStep ? "next" : "previous";

      // Validate if moving forward
      if (direction === "next" && validateStep) {
        setIsValidating(true);
        try {
          const isValid = await validateStep(currentStep);
          if (!isValid) return;
        } finally {
          setIsValidating(false);
        }
      }

      if (externalCurrentStep === undefined) {
        setInternalCurrentStep(step);
      }
      onChangeStep?.(step);
      onStepChange?.(step, direction);
    },
    [
      currentStep,
      externalCurrentStep,
      onChangeStep,
      onStepChange,
      steps.length,
      validateStep,
    ]
  );

  const handleNext = React.useCallback(async () => {
    if (isLastStep) return;

    if (validateStep) {
      setIsValidating(true);
      try {
        const isValid = await validateStep(currentStep);
        if (!isValid) return;
      } finally {
        setIsValidating(false);
      }
    }

    const nextStep = currentStep + 1;
    if (externalCurrentStep === undefined) {
      setInternalCurrentStep(nextStep);
    }
    onChangeStep?.(nextStep);
    onStepChange?.(nextStep, "next");
  }, [
    currentStep,
    isLastStep,
    externalCurrentStep,
    onChangeStep,
    onStepChange,
    validateStep,
  ]);

  const handlePrevious = React.useCallback(() => {
    if (isFirstStep) return;

    const prevStep = currentStep - 1;
    if (externalCurrentStep === undefined) {
      setInternalCurrentStep(prevStep);
    }
    onChangeStep?.(prevStep);
    onStepChange?.(prevStep, "previous");
  }, [
    currentStep,
    isFirstStep,
    externalCurrentStep,
    onChangeStep,
    onStepChange,
  ]);

  const handleComplete = React.useCallback(async () => {
    if (validateStep) {
      setIsValidating(true);
      try {
        const isValid = await validateStep(currentStep);
        if (!isValid) return;
      } finally {
        setIsValidating(false);
      }
    }

    onSubmit?.();
    onComplete?.();
  }, [currentStep, onSubmit, onComplete, validateStep]);

  // Memoized children render
  const renderedChildren = React.useMemo(() => {
    if (typeof children === "function") {
      return children({ step: currentStep, isLastStep, isFirstStep });
    }
    return children;
  }, [children, currentStep, isLastStep, isFirstStep]);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  const showStepIndicator = variant !== "progress";
  const showProgressBar = showProgress || variant === "progress";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Step Indicator or Progress Bar */}
      {showStepIndicator && (
        <WizardStepIndicator
          steps={stepStatus}
          currentStep={currentStep}
          onStepClick={handleStepChange}
          variant={variant}
          orientation={orientation}
          size={size}
          className={stepsClassName}
        />
      )}

      {showProgressBar && variant !== "progress" && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">{progressText}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn("min-h-[200px]", contentClassName)}>
        {renderedChildren}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onComplete={handleComplete}
          canGoNext={canGoNext && !isValidating}
          canGoPrevious={canGoPrevious}
          isLastStep={isLastStep}
          nextLabel={nextLabel}
          previousLabel={previousLabel}
          submitLabel={submitLabel}
          loading={loading || isValidating}
          className={navigationClassName}
        />
      )}
    </div>
  );
}
