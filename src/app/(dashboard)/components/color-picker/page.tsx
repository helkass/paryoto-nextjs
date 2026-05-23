// app/color-picker-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormColorPickerField } from "@/components/form/form-color-picker-field";
import { FormColorPicker } from "@/components/color-picker/form-color-picker";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import {
  MODERN_PRESET_COLORS,
  TAILWIND_PRESET_COLORS,
} from "@/lib/color-presets";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  primaryColor: z.string().min(1, "Please select a color"),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ColorPickerDemoPage() {
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [accentColor, setAccentColor] = useState("#10B981");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: "#3B82F6",
      accentColor: "#10B981",
      textColor: "#1F2937",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Color preferences saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Color Picker Components</h1>
          <p className="text-muted-foreground mt-1">
            Select colors with preset options and custom values
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="presets">Custom Presets</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic">
            <DashboardCard title="Basic Color Picker">
              <div className="space-y-6">
                <FormColorPicker
                  label="Primary Color"
                  description="Choose your primary brand color"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  format="hex"
                  showPresets
                  showInput
                />

                <FormColorPicker
                  label="Accent Color"
                  value={accentColor}
                  onChange={setAccentColor}
                  format="hex"
                  showInput
                />

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <p className="text-white text-center">
                    Preview with selected color
                  </p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Custom Presets */}
          <TabsContent value="presets">
            <DashboardCard title="Color Picker with Custom Presets">
              <div className="space-y-6">
                <FormColorPicker
                  label="Modern Colors"
                  description="Modern color palette"
                  presetColors={MODERN_PRESET_COLORS}
                  showPresets
                  showInput
                />

                <FormColorPicker
                  label="Tailwind Colors"
                  description="Tailwind CSS color palette"
                  presetColors={TAILWIND_PRESET_COLORS}
                  showPresets
                  showInput
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Color Picker with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormColorPickerField
                    control={form.control}
                    name="primaryColor"
                    label="Primary Color"
                    description="Main brand color"
                    required
                    format="hex"
                    showPresets
                    showInput
                  />

                  <FormColorPickerField
                    control={form.control}
                    name="accentColor"
                    label="Accent Color"
                    description="Secondary brand color"
                    format="hex"
                    showInput
                  />

                  <FormColorPickerField
                    control={form.control}
                    name="textColor"
                    label="Text Color"
                    description="Default text color"
                    format="hex"
                    showInput
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Save Colors</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Color Preview */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-3">Color Preview</h4>
                <div className="flex gap-4">
                  <div className="flex-1 text-center">
                    <div
                      className="h-12 w-full rounded-lg mb-2"
                      style={{
                        backgroundColor:
                          form.watch("primaryColor") || "#3B82F6",
                      }}
                    />
                    <p className="text-xs">Primary</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div
                      className="h-12 w-full rounded-lg mb-2"
                      style={{
                        backgroundColor: form.watch("accentColor") || "#10B981",
                      }}
                    />
                    <p className="text-xs">Accent</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div
                      className="h-12 w-full rounded-lg mb-2 border"
                      style={{
                        backgroundColor: form.watch("textColor") || "#1F2937",
                      }}
                    />
                    <p className="text-xs">Text</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
