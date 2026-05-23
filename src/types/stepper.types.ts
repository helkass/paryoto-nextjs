// types/stepper.types.ts
import { ReactNode } from "react";

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
  disabled?: boolean;
}

export interface StepperProps {
  // Core
  steps: Step[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  children?: React.ReactNode;

  // Behavior
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "numbered" | "icons" | "progress";
  size?: "sm" | "md" | "lg";

  // Navigation
  showNavigation?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;

  // Validation
  allowStepClick?: boolean;
  validateStep?: (step: number) => boolean | Promise<boolean>;

  // Display
  showConnector?: boolean;
  showStepNumbers?: boolean;
  truncateLabels?: boolean;

  // Styling
  className?: string;
  stepClassName?: string;
  activeClassName?: string;
  completedClassName?: string;
  connectorClassName?: string;

  // Loading & Error
  loading?: boolean;
  error?: string;

  // Callbacks
  onStepClick?: (step: number) => void;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface StepIndicatorProps {
  steps: Step[];
  activeStep: number;
  onStepClick?: (step: number) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "numbered" | "icons" | "progress";
  size?: "sm" | "md" | "lg";
  showConnector?: boolean;
  showStepNumbers?: boolean;
  truncateLabels?: boolean;
  allowStepClick?: boolean;
  validateStep?: (step: number) => boolean;
  stepClassName?: string;
  activeClassName?: string;
  completedClassName?: string;
  connectorClassName?: string;
}

export interface StepContentProps {
  children: ReactNode;
  activeStep: number;
  steps: Step[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export interface StepperNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastStep: boolean;
  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;
  loading?: boolean;
  className?: string;
}
