"use client";

import { useDateFormatter } from "@/hooks/useDateFormatter";
import { FormDatePicker } from "@/components/form/form-date-picker";
import { DatePickerValue, DateRange } from "@/types/datepicker.types";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tabs/custom-tabs";
import { DashboardCard } from "@/components/cards/dashboard-card";

export default function DatePickerDemoPage() {
  const { format, formatRange } = useDateFormatter("id");

  const handleApplySingle = (date: DatePickerValue) => {
    if (date instanceof Date) {
      toast.success(`Selected date: ${format(date, "dd/MM/yyyy")}`);
    }
  };

  const handleApplyRange = (dateRange: DatePickerValue) => {
    if (dateRange && "from" in dateRange) {
      const range = dateRange as DateRange;
      const formatted = formatRange(range, "dd/MM/yyyy");
      toast.success(`Selected range: ${formatted}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="single">
          <TabsList className="mb-6">
            <TabsTrigger value="single">Single Date</TabsTrigger>
            <TabsTrigger value="range">Date Range</TabsTrigger>
            <TabsTrigger value="time">With Time</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <DashboardCard title="Single Date Picker">
              <div className="space-y-6">
                <FormDatePicker
                  label="Select Date"
                  description="Choose a single date"
                  placeholder="Pick a date"
                  mode="single"
                  showFooter={true}
                  onApply={handleApplySingle}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          <TabsContent value="range">
            <DashboardCard title="Date Range Picker">
              <div className="space-y-6">
                <FormDatePicker
                  label="Select Date Range"
                  description="Choose start and end date"
                  placeholder="Pick date range"
                  mode="range"
                  showFooter={true}
                  onApply={handleApplyRange}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          <TabsContent value="time">
            <DashboardCard title="Date Picker with Time">
              <div className="space-y-6">
                <FormDatePicker
                  label="Select Date and Time"
                  description="Choose date with time"
                  placeholder="Pick date and time"
                  mode="single"
                  enableTime={true}
                  timeInterval={15}
                  showFooter={true}
                  onApply={handleApplySingle}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          <TabsContent value="advanced">
            <DashboardCard title="Advanced Date Picker">
              <div className="space-y-6">
                <FormDatePicker
                  label="Advanced Picker"
                  description="With all features enabled"
                  placeholder="Pick a date"
                  mode="single"
                  enableTime={true}
                  showFooter={true}
                  showClearButton={true}
                  showTodayButton={true}
                  showPresets={true}
                  presets={[
                    { label: "Today", value: new Date() },
                    {
                      label: "Last 7 days",
                      value: {
                        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        to: new Date(),
                      },
                    },
                  ]}
                  onApply={handleApplySingle}
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
