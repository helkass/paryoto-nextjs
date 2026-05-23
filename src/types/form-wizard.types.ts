// types/form-wizard.types.ts
import { ReactNode } from "react";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  isOptional?: boolean;
  isValid?: boolean;
}

export interface FormWizardProps {
  // Core
  steps: WizardStep[];
  currentStep?: number;
  onChangeStep?: (step: number) => void;
  children:
    | ReactNode
    | ((props: {
        step: number;
        isLastStep: boolean;
        isFirstStep: boolean;
      }) => ReactNode);

  // Navigation
  showNavigation?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;

  // Validation
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  validateStep?: (step: number, data?: any) => boolean | Promise<boolean>;

  // Display
  variant?: "default" | "numbered" | "icons" | "progress";
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";

  // Progress
  showProgress?: boolean;
  progressLabel?: (current: number, total: number) => string;

  // Styling
  className?: string;
  stepsClassName?: string;
  contentClassName?: string;
  navigationClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onStepChange?: (step: number, direction?: "next" | "previous") => void;
  onComplete?: () => void;
  onSubmit?: () => void;
}

export interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  variant?: "default" | "numbered" | "icons" | "progress";
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastStep: boolean;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
}
