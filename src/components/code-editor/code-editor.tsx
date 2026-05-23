// components/code-editor/code-editor.tsx
"use client";

import * as React from "react";
import Editor from "react-simple-code-editor";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { CodeEditorToolbar } from "./code-editor-toolbar";
import {
  highlightCode,
  validateJSON,
  formatJSON,
  formatJavaScript,
} from "@/lib/syntax-highlighter";
import { CodeEditorProps, CodeLanguage } from "@/types/code-editor.types";

export function CodeEditor({
  value = "",
  onChange,
  language = "json",
  placeholder = "Enter your code here...",
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  minHeight = 200,
  maxHeight = 500,
  lineNumbers = true,
  jsonValidation = true,
  showCopyButton = true,
  showFormatButton = true,
  showMinimizeButton = true,
  showResetButton = false,
  className,
  editorClassName,
  loading = false,
  error: externalError,
  onFormat,
  onValidate,
  onBlur,
  onFocus,
}: CodeEditorProps) {
  const [internalValue, setInternalValue] = React.useState(value);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  );
  const [currentLanguage, setCurrentLanguage] =
    React.useState<CodeLanguage>(language);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Validate JSON
  React.useEffect(() => {
    if (jsonValidation && currentLanguage === "json" && internalValue) {
      const result = validateJSON(internalValue);
      setValidationError(result.error || null);

      if (onValidate) {
        const customResult = onValidate(internalValue);
        if (customResult.error) {
          setValidationError(customResult.error);
        }
      }
    } else {
      setValidationError(null);
    }
  }, [internalValue, currentLanguage, jsonValidation, onValidate]);

  const handleChange = (code: string) => {
    setInternalValue(code);
    onChange?.(code);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(internalValue);
  };

  const handleFormat = () => {
    if (onFormat) {
      const formatted = onFormat(internalValue);
      handleChange(formatted);
      return;
    }

    let formatted = internalValue;
    if (currentLanguage === "json") {
      formatted = formatJSON(internalValue);
    } else if (
      currentLanguage === "javascript" ||
      currentLanguage === "typescript"
    ) {
      formatted = formatJavaScript(internalValue);
    }

    handleChange(formatted);
  };

  const handleReset = () => {
    handleChange("");
  };

  const handleLanguageChange = (newLanguage: CodeLanguage) => {
    setCurrentLanguage(newLanguage);
    // Optionally clear validation error when changing language
    setValidationError(null);
  };

  const highlight = (code: string) => {
    return highlightCode(code, currentLanguage);
  };

  const displayError = externalError || validationError;
  const displayValue = internalValue;

  // Line number generation
  const getLineNumbers = () => {
    if (!lineNumbers) return null;

    const lines = displayValue.split("\n").length;
    return Array.from({ length: lines }, (_, i) => i + 1).map((num) => (
      <div
        key={num}
        className="text-right text-xs text-muted-foreground select-none"
        style={{ lineHeight: "1.5" }}
      >
        {num}
      </div>
    ));
  };

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
        <div className="rounded-md border bg-muted/20 p-4">
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse bg-muted rounded" />
            <div className="h-4 w-3/4 animate-pulse bg-muted rounded" />
            <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

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
          {currentLanguage === "json" && validationError && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>Invalid JSON</span>
            </div>
          )}
          {currentLanguage === "json" && !validationError && internalValue && (
            <div className="flex items-center gap-1 text-xs text-success">
              <CheckCircle className="h-3 w-3" />
              <span>Valid JSON</span>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "rounded-md border overflow-hidden transition-all duration-200",
          displayError && "border-destructive",
          className
        )}
      >
        <CodeEditorToolbar
          language={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onCopy={handleCopy}
          onFormat={handleFormat}
          onReset={showResetButton ? handleReset : undefined}
          onMinimize={
            showMinimizeButton ? () => setIsMinimized(!isMinimized) : undefined
          }
          isMinimized={isMinimized}
          showCopyButton={showCopyButton}
          showFormatButton={showFormatButton}
          showResetButton={showResetButton}
          showMinimizeButton={showMinimizeButton}
          disabled={disabled || readOnly}
        />

        {!isMinimized && (
          <div
            className="relative"
            style={{
              minHeight:
                typeof minHeight === "number" ? `${minHeight}px` : minHeight,
              maxHeight:
                typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
            }}
          >
            {/* Line Numbers */}
            {lineNumbers && (
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/30 border-r overflow-hidden">
                <div className="p-3">{getLineNumbers()}</div>
              </div>
            )}

            {/* Editor */}
            <div className={cn(lineNumbers ? "ml-10" : "", "h-full")}>
              <Editor
                value={displayValue}
                onValueChange={handleChange}
                highlight={highlight}
                placeholder={placeholder}
                disabled={disabled || readOnly}
                onBlur={onBlur}
                onFocus={onFocus}
                className={cn(
                  "font-mono text-sm focus:outline-none",
                  editorClassName
                )}
                style={{
                  fontFamily: '"Fira Code", "Fira Mono", monospace',
                  fontSize: 13,
                  minHeight:
                    typeof minHeight === "number"
                      ? `${minHeight}px`
                      : minHeight,
                  maxHeight:
                    typeof maxHeight === "number"
                      ? `${maxHeight}px`
                      : maxHeight,
                  overflow: "auto",
                }}
                textareaClassName="focus:outline-none"
                padding={12}
              />
            </div>
          </div>
        )}
      </div>

      {description && !displayError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {displayError && (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
