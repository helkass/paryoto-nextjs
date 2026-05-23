// components/otp-input/form-otp-input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OtpInputField } from "./otp-input-field";
import { OtpInputProps } from "@/types/otp-input.types";

export function FormOtpInput({
  value = "",
  onChange,
  numInputs = 6,
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  autoFocus = true,
  shouldAutoFocus = true,
  isDisabled = false,
  isInputNum = true,
  isSecure = false,
  isInputPassword = false,
  placeholder = "●",
  separator,
  className,
  inputClassName,
  containerClassName,
  showTimer = false,
  timerDuration = 60,
  onTimerEnd,
  resendText = "Resend Code",
  onResend,
  maskCharacter = "●",
  validate,
  loading = false,
  error,
  onBlur,
  onFocus,
  onComplete,
  onOtpSubmit,
}: OtpInputProps) {
  const [otpValue, setOtpValue] = React.useState<string[]>(
    value ? value.split("").slice(0, numInputs) : Array(numInputs).fill("")
  );
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [timer, setTimer] = React.useState(timerDuration);
  const [canResend, setCanResend] = React.useState(!showTimer);
  const inputRefs = React.useRef<React.RefObject<HTMLInputElement | null>[]>(
    []
  );

  // Initialize refs
  React.useEffect(() => {
    inputRefs.current = Array(numInputs)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement | null>());
  }, [numInputs]);

  // Sync with external value
  React.useEffect(() => {
    if (value) {
      const newOtp = value.split("").slice(0, numInputs);
      const filled = [...otpValue];
      newOtp.forEach((char, i) => {
        filled[i] = char;
      });
      setOtpValue(filled);
    }
  }, [value, numInputs]);

  // Timer logic
  React.useEffect(() => {
    if (!showTimer) return;

    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            onTimerEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer, canResend, showTimer, onTimerEnd]);

  const updateOtpValue = (newOtp: string[]) => {
    setOtpValue(newOtp);
    const stringValue = newOtp.join("");
    onChange?.(stringValue);

    // Check if complete
    const isComplete = stringValue.length === numInputs;
    if (isComplete && validate) {
      const validationResult = validate(stringValue);
      if (validationResult === true) {
        onComplete?.(stringValue);
        onOtpSubmit?.(stringValue);
      }
    } else if (isComplete) {
      onComplete?.(stringValue);
      onOtpSubmit?.(stringValue);
    }
  };

  const handleChange = (newValue: string, index: number) => {
    if (disabled || readOnly) return;

    const newOtp = [...otpValue];
    newOtp[index] = newValue;
    updateOtpValue(newOtp);

    // Move to next input if value is entered
    if (newValue && index < numInputs - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled || readOnly) return;

    if (e.key === "Backspace") {
      if (otpValue[index] === "" && index > 0) {
        // Move to previous input on backspace when current is empty
        inputRefs.current[index - 1]?.current?.focus();
        const newOtp = [...otpValue];
        newOtp[index - 1] = "";
        updateOtpValue(newOtp);
      } else if (otpValue[index] !== "") {
        // Clear current input
        const newOtp = [...otpValue];
        newOtp[index] = "";
        updateOtpValue(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && index < numInputs - 1) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleFocus = (index: number) => {
    if (disabled || readOnly) return;
    setActiveIndex(index);
    onFocus?.();
  };

  const handleBlur = () => {
    setActiveIndex(-1);
    onBlur?.();
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(timerDuration);
    onResend?.();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled || readOnly) return;

    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, numInputs);

    if (isInputNum && !/^\d+$/.test(pastedData)) return;

    const newOtp = [...otpValue];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    updateOtpValue(newOtp);

    // Focus on the next empty input or last input
    const lastFilledIndex = Math.min(pastedData.length, numInputs - 1);
    inputRefs.current[lastFilledIndex]?.current?.focus();
  };

  const getValidationError = (): string | null => {
    const stringValue = otpValue.join("");
    if (required && stringValue.length !== numInputs) {
      return `Please enter the ${numInputs}-digit verification code`;
    }
    if (validate && stringValue.length === numInputs) {
      const result = validate(stringValue);
      if (result !== true) {
        return result as string;
      }
    }
    return null;
  };

  const validationError = getValidationError();
  const displayError = error || validationError;
  const finalDisabled = disabled || isDisabled || loading;
  const finalReadOnly = readOnly;

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
        )}
        <div className="flex gap-2">
          {Array.from({ length: numInputs }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-12 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  const stringValue = otpValue.join("");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            className={
              required
                ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                : ""
            }
          >
            {label}
          </Label>
          {showTimer && !canResend && (
            <span className="text-xs text-muted-foreground">
              Resend in {timer}s
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2",
          containerClassName
        )}
        onPaste={handlePaste}
      >
        {Array.from({ length: numInputs }).map((_, index) => (
          <React.Fragment key={index}>
            <OtpInputField
              index={index}
              value={otpValue[index]}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              inputRef={inputRefs.current[index]}
              disabled={finalDisabled}
              readOnly={finalReadOnly}
              autoFocus={autoFocus && shouldAutoFocus && index === 0}
              isInputNum={isInputNum}
              isSecure={isSecure || isInputPassword}
              placeholder={
                typeof placeholder === "string"
                  ? placeholder
                  : placeholder[index]
              }
              maskCharacter={maskCharacter}
              className={cn(
                activeIndex === index && "ring-2 ring-ring border-transparent",
                displayError &&
                  "border-destructive focus-visible:ring-destructive",
                inputClassName
              )}
            />
            {separator && index < numInputs - 1 && (
              <span className="text-muted-foreground">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {description && !displayError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {displayError && (
        <p className="text-xs text-destructive">{displayError}</p>
      )}

      {showTimer && canResend && onResend && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleResend}
            className="text-xs"
          >
            {resendText}
          </Button>
        </div>
      )}

      {!showTimer && onResend && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleResend}
            className="text-xs"
          >
            {resendText}
          </Button>
        </div>
      )}
    </div>
  );
}
