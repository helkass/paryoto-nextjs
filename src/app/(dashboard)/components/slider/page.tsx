// app/slider-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/slider/slider";
import { RangeSlider } from "@/components/slider/range-slider";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";
import { FormSliderField } from "@/components/form/form-slider-field";

const formSchema = z.object({
  volume: z.number().min(0).max(100),
  priceRange: z.tuple([z.number(), z.number()]),
  brightness: z.number().min(0).max(100).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Custom marks
const volumeMarks = [
  { value: 0, label: "Mute" },
  { value: 25, label: "Low" },
  { value: 50, label: "Medium" },
  { value: 75, label: "High" },
  { value: 100, label: "Max" },
];

const priceMarks = [
  { value: 0, label: "$0" },
  { value: 250, label: "$250" },
  { value: 500, label: "$500" },
  { value: 750, label: "$750" },
  { value: 1000, label: "$1000" },
];

export default function SliderDemoPage() {
  const [volume, setVolume] = useState(50);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 800]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volume: 50,
      priceRange: [200, 800],
      brightness: 70,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Slider Components</h1>
          <p className="text-muted-foreground mt-1">
            Range slider with numeric input and real-time updates
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="mb-6">
            <TabsTrigger value="single">Single Slider</TabsTrigger>
            <TabsTrigger value="range">Range Slider</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Single Slider */}
          <TabsContent value="single">
            <DashboardCard title="Single Slider">
              <div className="space-y-8">
                <Slider
                  label="Volume"
                  description="Adjust the volume level"
                  value={volume}
                  onChange={(val) => typeof val === "number" && setVolume(val)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  formatValue={formatPercentage}
                  showInput
                  showMarks
                  marks={volumeMarks}
                  showTooltip
                />

                <Slider
                  label="Temperature"
                  value={24}
                  onChange={(val) => console.log("Temperature:", val)}
                  min={-10}
                  max={40}
                  step={0.5}
                  unit="°C"
                  showInput
                  showMinMax
                />

                <Slider
                  label="Opacity"
                  value={0.75}
                  onChange={(val) => console.log("Opacity:", val)}
                  min={0}
                  max={1}
                  step={0.01}
                  formatValue={(val) => `${Math.round(val * 100)}%`}
                  showInput
                />

                <Slider
                  label="Disabled Slider"
                  value={30}
                  min={0}
                  max={100}
                  disabled
                  description="This slider is disabled"
                  showInput
                />

                <Slider
                  label="Read-only Slider"
                  value={60}
                  min={0}
                  max={100}
                  readOnly
                  description="This slider is read-only"
                  showInput
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Range Slider */}
          <TabsContent value="range">
            <DashboardCard title="Range Slider">
              <div className="space-y-8">
                <RangeSlider
                  label="Price Range"
                  description="Select your price range"
                  value={priceRange}
                  onChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                  unit="$"
                  formatValue={formatCurrency}
                  showInput
                  showMarks
                  marks={priceMarks}
                  showTooltip
                />

                <RangeSlider
                  label="Date Range (Years)"
                  value={[2010, 2020]}
                  onChange={(val) => console.log("Date range:", val)}
                  min={2000}
                  max={2024}
                  step={1}
                  showInput
                  showMinMax
                />

                <RangeSlider
                  label="Percentage Range"
                  value={[25, 75]}
                  onChange={(val) => console.log("Percentage range:", val)}
                  min={0}
                  max={100}
                  step={5}
                  formatValue={(val) => `${val}%`}
                  showInput
                  showMarks
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 25, label: "25%" },
                    { value: 50, label: "50%" },
                    { value: 75, label: "75%" },
                    { value: 100, label: "100%" },
                  ]}
                />

                <RangeSlider
                  label="Disabled Range"
                  value={[300, 700]}
                  min={0}
                  max={1000}
                  disabled
                  showInput
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Slider with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormSliderField
                    control={form.control}
                    name="volume"
                    label="Volume Level"
                    description="Set the volume level (0-100)"
                    required
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    formatValue={formatPercentage}
                    showInput
                    showMarks
                    marks={volumeMarks}
                    showTooltip
                  />

                  <FormSliderField
                    control={form.control}
                    name="priceRange"
                    label="Price Range"
                    description="Select minimum and maximum price"
                    mode="range"
                    min={0}
                    max={1000}
                    step={10}
                    unit="$"
                    formatValue={formatCurrency}
                    showInput
                    showMarks
                    marks={priceMarks}
                    showTooltip
                  />

                  <FormSliderField
                    control={form.control}
                    name="brightness"
                    label="Brightness (Optional)"
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    formatValue={formatPercentage}
                    showInput
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
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

              {/* Display current values */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Current Values:</h4>
                <div className="space-y-1 text-sm">
                  <p>Volume: {form.watch("volume")}%</p>
                  <p>
                    Price Range: {formatCurrency(form.watch("priceRange")?.[0])}{" "}
                    - {formatCurrency(form.watch("priceRange")?.[1])}
                  </p>
                  <p>Brightness: {form.watch("brightness") || "Not set"}%</p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <DashboardCard title="Additional Features">
              <div className="space-y-8">
                <Slider
                  label="Custom Format"
                  value={42}
                  min={0}
                  max={100}
                  formatValue={(val) => {
                    if (val < 20) return "Low";
                    if (val < 60) return "Medium";
                    if (val < 80) return "High";
                    return "Very High";
                  }}
                  showInput
                  description="Custom text formatting based on value"
                />

                <Slider
                  label="No Input"
                  value={65}
                  min={0}
                  max={100}
                  showInput={false}
                  description="Slider without numeric input"
                />

                <Slider
                  label="Custom Step"
                  value={10}
                  min={0}
                  max={100}
                  step={5}
                  showInput
                  description="Step size of 5"
                />

                <Slider
                  label="Large Range"
                  value={5000}
                  min={0}
                  max={10000}
                  step={100}
                  showInput
                  description="Large range from 0 to 10,000"
                />

                <Slider
                  label="Decimal Values"
                  value={3.14}
                  min={0}
                  max={10}
                  step={0.01}
                  showInput
                  description="Decimal values with 0.01 step"
                />

                <Slider label="Loading State" loading min={0} max={100} />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
