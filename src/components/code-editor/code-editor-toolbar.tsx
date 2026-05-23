// components/code-editor/code-editor-toolbar.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Code2,
  RefreshCw,
  Minimize2,
  Maximize2,
  Check,
} from "lucide-react";
import {
  CodeEditorToolbarProps,
  CodeLanguage,
} from "@/types/code-editor.types";
import { LANGUAGE_OPTIONS } from "@/lib/syntax-highlighter";

export function CodeEditorToolbar({
  language,
  onLanguageChange,
  onCopy,
  onFormat,
  onReset,
  onMinimize,
  isMinimized = false,
  showCopyButton = true,
  showFormatButton = true,
  showResetButton = true,
  showMinimizeButton = true,
  languages = LANGUAGE_OPTIONS,
  disabled = false,
}: CodeEditorToolbarProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b bg-muted/30">
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        {onLanguageChange && (
          <Select
            value={language}
            onValueChange={(value) => onLanguageChange(value as CodeLanguage)}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Language Icon */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <Code2 className="h-3 w-3" />
          <span>
            {LANGUAGE_OPTIONS.find((l) => l.value === language)?.label ||
              language}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Copy Button */}
        {showCopyButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Format Button */}
        {showFormatButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFormat}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <Code2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Format Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Reset Button */}
        {showResetButton && onReset && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset to default</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Minimize Button */}
        {showMinimizeButton && onMinimize && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMinimize}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMinimized ? "Expand" : "Minimize"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
