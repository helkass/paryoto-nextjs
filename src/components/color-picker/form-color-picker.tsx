// components/color-picker/form-color-picker.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { ColorSwatch } from "./color-swatch";
import { ColorPickerInput } from "./color-picker-input";
import { DEFAULT_PRESET_COLORS } from "@/lib/color-presets";
import { ColorPickerProps } from "@/types/color-picker.types";
import { Pipette, SwatchBook } from "lucide-react";

// Helper functions for color conversion
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const isValidHex = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color);
};

const isValidRgb = (color: string): boolean => {
  return /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(color);
};

export function FormColorPicker({
  value = "#3B82F6",
  onChange,
  format = "hex",
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  presetColors = DEFAULT_PRESET_COLORS,
  showPresets = true,
  showInput = true,
  showOpacity = false,
  showEyeDropper = false,
  size = "md",
  variant = "default",
  className,
  buttonClassName,
  popoverClassName,
  loading = false,
  error,
  onBlur,
  onFocus,
  onColorChange,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = React.useState(value);
  const [activeTab, setActiveTab] = React.useState<"presets" | "custom">(
    "presets"
  );
  const [customColor, setCustomColor] = React.useState(value);
  const [opacityValue, setOpacityValue] = React.useState(100);

  React.useEffect(() => {
    setSelectedColor(value);
    setCustomColor(value);
  }, [value]);

  const handleColorChange = (newColor: string) => {
    let finalColor = newColor;

    // Handle opacity if enabled
    if (showOpacity && format === "hex8" && newColor.startsWith("#")) {
      const opacityHex = Math.round((opacityValue / 100) * 255)
        .toString(16)
        .padStart(2, "0");
      finalColor =
        newColor.length === 7
          ? newColor + opacityHex
          : newColor.slice(0, 7) + opacityHex;
    }

    setSelectedColor(finalColor);
    setCustomColor(finalColor);
    onChange?.(finalColor);
    onColorChange?.(finalColor);
  };

  const handlePresetSelect = (color: string) => {
    if (readOnly) return;
    handleColorChange(color);
  };

  const handleCustomColorChange = (color: string) => {
    if (readOnly) return;
    let isValid = false;

    if (format === "hex" || format === "hex8") {
      isValid = isValidHex(color);
    } else if (format === "rgb" || format === "rgba") {
      isValid = isValidRgb(color);
    }

    if (isValid) {
      handleColorChange(color);
    }
    setCustomColor(color);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseInt(e.target.value, 10);
    setOpacityValue(newOpacity);

    if (selectedColor.startsWith("#")) {
      const opacityHex = Math.round((newOpacity / 100) * 255)
        .toString(16)
        .padStart(2, "0");
      const baseColor =
        selectedColor.length === 7 ? selectedColor : selectedColor.slice(0, 7);
      const newColor = baseColor + opacityHex;
      setSelectedColor(newColor);
      setCustomColor(newColor);
      onChange?.(newColor);
      onColorChange?.(newColor);
    }
  };

  const handleEyeDropper = async () => {
    if (!(window as any).EyeDropper) {
      alert("EyeDropper API is not supported in your browser");
      return;
    }

    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      const hexColor = result.sRGBHex;
      handleColorChange(hexColor);
    } catch (error) {
      console.error("EyeDropper failed:", error);
    }
  };

  const getDisplayColor = () => {
    if (format === "hex" || format === "hex8") {
      return selectedColor;
    } else if (format === "rgb" && selectedColor.startsWith("#")) {
      const rgb = hexToRgb(selectedColor);
      if (rgb) {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }
    }
    return selectedColor;
  };

  // Variant styles
  const variantClasses = {
    default: "rounded-md border shadow-sm",
    card: "rounded-lg border-2 shadow-md",
    compact: "rounded-sm border",
  };

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label}</Label>}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
          <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || readOnly}
            className={cn(
              "w-full justify-start gap-3",
              variantClasses[variant],
              buttonClassName
            )}
          >
            <div
              className={cn("rounded border shadow-sm", sizeClasses[size])}
              style={{ backgroundColor: selectedColor }}
            />
            <span className="font-mono text-sm">{getDisplayColor()}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn("w-80 p-4", popoverClassName)}
          align="start"
        >
          {/* Show tabs only if both presets and custom input are enabled */}
          {(showPresets || showInput) && (
            <Tabs
              defaultValue="presets"
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
            >
              <TabsList className="w-full">
                {showPresets && (
                  <TabsTrigger value="presets" className="flex-1">
                    <SwatchBook className="mr-2 h-4 w-4" />
                    Presets
                  </TabsTrigger>
                )}
                {showInput && (
                  <TabsTrigger value="custom" className="flex-1">
                    Custom
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Presets Tab */}
              {showPresets && (
                <TabsContent value="presets" className="space-y-4 mt-4">
                  <div className="grid grid-cols-8 gap-2">
                    {presetColors.map((color) => (
                      <ColorSwatch
                        key={color}
                        color={color}
                        isSelected={selectedColor === color}
                        onClick={() => handlePresetSelect(color)}
                        size="sm"
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Custom Tab */}
              {showInput && (
                <TabsContent value="custom" className="space-y-4 mt-4">
                  {/* Color input */}
                  <div className="space-y-2">
                    <Label className="text-xs">Color Value</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <ColorPickerInput
                          value={customColor}
                          onChange={handleCustomColorChange}
                          format={format}
                          disabled={readOnly}
                        />
                      </div>
                      {showEyeDropper && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleEyeDropper}
                          disabled={readOnly}
                        >
                          <Pipette className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Native color input */}
                  <div className="space-y-2">
                    <Label className="text-xs">Color Picker</Label>
                    <Input
                      type="color"
                      value={selectedColor.slice(0, 7)}
                      onChange={(e) => handleColorChange(e.target.value)}
                      disabled={readOnly}
                      className="h-10 w-full cursor-pointer p-1"
                    />
                  </div>

                  {/* Opacity slider */}
                  {showOpacity && (
                    <div className="space-y-2">
                      <Label className="text-xs">
                        Opacity: {opacityValue}%
                      </Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={opacityValue}
                        onChange={handleOpacityChange}
                        disabled={readOnly}
                        className="w-full"
                      />
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          )}

          {/* If both are disabled, show only color preview */}
          {!showPresets && !showInput && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="h-20 w-20 rounded-lg border shadow-md"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="font-mono text-sm">{getDisplayColor()}</span>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
