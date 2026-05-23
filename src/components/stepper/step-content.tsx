// components/stepper/step-content.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StepContentProps } from "@/types/stepper.types";

export function StepContent({
  children,
  activeStep,
  steps,
  orientation = "horizontal",
  className,
}: StepContentProps) {
  // For horizontal layout, show only active step content
  if (orientation === "horizontal") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={cn("mt-6", className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  // For vertical layout, show all steps content
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className={cn(index !== activeStep && "hidden")}>
          {children}
        </div>
      ))}
    </div>
  );
}
