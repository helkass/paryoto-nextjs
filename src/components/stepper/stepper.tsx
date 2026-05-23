// components/stepper/stepper.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { StepIndicator } from "./step-indicator";
import { StepContent } from "./step-content";
import { StepperNavigation } from "./stepper-navigation";
import { StepperProps } from "@/types/stepper.types";
import { AlertCircle } from "lucide-react";

export function Stepper({
  steps,
  activeStep: externalActiveStep,
  onStepChange,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  showNavigation = true,
  nextLabel = "Next",
  previousLabel = "Back",
  completeLabel = "Complete",
  allowStepClick = true,
  validateStep,
  showConnector = true,
  showStepNumbers = true,
  truncateLabels = false,
  className,
  stepClassName,
  activeClassName,
  completedClassName,
  connectorClassName,
  loading = false,
  error,
  onStepClick,
  onComplete,
  onNext,
  onPrevious,
  children,
}: StepperProps) {
  const [internalActiveStep, setInternalActiveStep] =
    React.useState(externalActiveStep);
  const [isValidating, setIsValidating] = React.useState(false);

  // Sync with external active step
  React.useEffect(() => {
    setInternalActiveStep(externalActiveStep);
  }, [externalActiveStep]);

  const activeStep = internalActiveStep;
  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  const handleStepChange = (step: number) => {
    if (step === activeStep) return;
    if (step < 0 || step >= steps.length) return;

    setInternalActiveStep(step);
    onStepChange?.(step);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    if (!validateStep) return true;

    setIsValidating(true);
    try {
      const isValid = await validateStep(activeStep);
      return isValid;
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    if (isLastStep) return;

    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const nextStep = activeStep + 1;
    handleStepChange(nextStep);
    onNext?.();
  };

  const handlePrevious = () => {
    if (isFirstStep) return;

    const prevStep = activeStep - 1;
    handleStepChange(prevStep);
    onPrevious?.();
  };

  const handleComplete = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    onComplete?.();
  };

  const handleStepClickWrapper = (step: number) => {
    if (!allowStepClick) return;

    // Only allow clicking on completed steps or previous steps
    if (step > activeStep) {
      if (validateStep) {
        // Validate all steps between current and target
        let allValid = true;
        for (let i = activeStep; i < step; i++) {
          const isValid = validateStep(i);
          if (!isValid) {
            allValid = false;
            break;
          }
        }
        if (!allValid) return;
      }
    }

    handleStepChange(step);
    onStepClick?.(step);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Step Indicator */}
      <StepIndicator
        steps={steps}
        activeStep={activeStep}
        onStepClick={handleStepClickWrapper}
        orientation={orientation}
        variant={variant}
        size={size}
        showConnector={showConnector}
        showStepNumbers={showStepNumbers}
        truncateLabels={truncateLabels}
        allowStepClick={allowStepClick}
        validateStep={(step) => validateStep?.(step) === true}
        stepClassName={stepClassName}
        activeClassName={activeClassName}
        completedClassName={completedClassName}
        connectorClassName={connectorClassName}
      />

      {/* Step Content */}
      <StepContent
        activeStep={activeStep}
        steps={steps}
        orientation={orientation}
      >
        {steps[activeStep]?.id && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">
                {steps[activeStep].title}
              </h2>
              {steps[activeStep].description && (
                <p className="mt-1 text-muted-foreground">
                  {steps[activeStep].description}
                </p>
              )}
            </div>
            {children}
          </div>
        )}
      </StepContent>

      {/* Navigation */}
      {showNavigation && (
        <StepperNavigation
          activeStep={activeStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onComplete={handleComplete}
          canGoNext={!isValidating}
          canGoPrevious={true}
          isLastStep={isLastStep}
          nextLabel={nextLabel}
          previousLabel={previousLabel}
          completeLabel={completeLabel}
          loading={loading || isValidating}
        />
      )}
    </div>
  );
}
