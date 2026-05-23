// app/toggle-demo/page.tsx
"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";
import { FormToggle } from "@/components/toggle/form-toggle";
import { FormToggleField } from "@/components/form/form-toggle-field";

// Form schema
const formSchema = z.object({
  notifications: z.boolean().default(false),
  emailUpdates: z.boolean().default(true),
  theme: z.string().default("light"),
  features: z.array(z.string()).default(["analytics", "reports"]),
});

type FormValues = z.infer<typeof formSchema>;

// Options for multiple toggle
const themeOptions = [
  { value: "light", label: "Light Mode" },
  { value: "dark", label: "Dark Mode" },
  { value: "system", label: "System Default" },
];

const featureOptions = [
  {
    value: "analytics",
    label: "Analytics",
    description: "View analytics dashboard",
  },
  {
    value: "reports",
    label: "Reports",
    description: "Generate and export reports",
  },
  {
    value: "notifications",
    label: "Notifications",
    description: "Real-time notifications",
  },
  { value: "api", label: "API Access", description: "REST API access" },
  {
    value: "export",
    label: "Data Export",
    description: "Export data to CSV/Excel",
  },
];

export default function ToggleDemoPage() {
  const [singleToggle, setSingleToggle] = useState(false);
  const [theme, setTheme] = useState<string>("light");
  const [features, setFeatures] = useState<string[]>(["analytics", "reports"]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      notifications: false,
      emailUpdates: true,
      theme: "light",
      features: ["analytics", "reports"],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Toggle Components</h1>
          <p className="text-muted-foreground mt-1">
            Switch toggle with labels and multi-select toggle groups
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="mb-6">
            <TabsTrigger value="single">Single Toggle</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Toggle</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Single Toggle */}
          <TabsContent value="single">
            <DashboardCard title="Single Toggle Examples">
              <div className="space-y-6">
                <FormToggle
                  label="Enable Notifications"
                  description="Receive notifications about your account activity"
                  value={singleToggle}
                  onChange={(val) => setSingleToggle(val as boolean)}
                  leftLabel="Off"
                  rightLabel="On"
                  size="md"
                />

                <FormToggle
                  label="Dark Mode"
                  description="Enable dark theme for the application"
                  value={false}
                  onChange={(val) => console.log("Dark mode:", val)}
                  leftLabel="Light"
                  rightLabel="Dark"
                  size="lg"
                />

                <FormToggle
                  label="Email Updates"
                  description="Receive email updates about new features"
                  value={true}
                  onChange={(val) => console.log("Email updates:", val)}
                  leftLabel="Disabled"
                  rightLabel="Enabled"
                  size="sm"
                />

                <FormToggle
                  label="Disabled Toggle"
                  description="This toggle is disabled"
                  value={false}
                  disabled
                  leftLabel="Off"
                  rightLabel="On"
                />

                <FormToggle
                  label="Read-only Toggle"
                  description="This toggle is read-only"
                  value={true}
                  readOnly
                  leftLabel="Off"
                  rightLabel="On"
                />

                <FormToggle
                  label="Loading Toggle"
                  loading
                  leftLabel="Off"
                  rightLabel="On"
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Multiple Toggle */}
          <TabsContent value="multiple">
            <DashboardCard title="Multiple Toggle Examples">
              <div className="space-y-6">
                <FormToggle
                  label="Theme Selection"
                  description="Choose your preferred theme"
                  mode="multiple"
                  value={theme}
                  onChange={(val) => setTheme(val as string)}
                  options={themeOptions}
                  size="md"
                />

                <FormToggle
                  label="Feature Flags"
                  description="Enable or disable specific features"
                  mode="multiple"
                  value={features}
                  onChange={(val) => setFeatures(val as string[])}
                  options={featureOptions}
                  size="sm"
                />

                <FormToggle
                  label="Permissions"
                  description="Select user permissions (Multiple selection)"
                  mode="multiple"
                  value={["read", "write"]}
                  onChange={(val) => console.log("Permissions:", val)}
                  options={[
                    { value: "read", label: "Read Access" },
                    { value: "write", label: "Write Access" },
                    { value: "delete", label: "Delete Access" },
                    { value: "admin", label: "Admin Access", disabled: true },
                  ]}
                />

                <FormToggle
                  label="Disabled Group"
                  description="This toggle group is disabled"
                  mode="multiple"
                  value={["option1"]}
                  disabled
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Toggle with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormToggleField
                    control={form.control}
                    name="notifications"
                    label="Push Notifications"
                    description="Receive push notifications on your device"
                    leftLabel="Off"
                    rightLabel="On"
                  />

                  <FormToggleField
                    control={form.control}
                    name="emailUpdates"
                    label="Email Updates"
                    description="Receive weekly email updates"
                    leftLabel="Disabled"
                    rightLabel="Enabled"
                  />

                  <FormToggleField
                    control={form.control}
                    name="theme"
                    label="Theme Preference"
                    description="Choose your preferred theme"
                    mode="multiple"
                    options={themeOptions}
                  />

                  <FormToggleField
                    control={form.control}
                    name="features"
                    label="Enabled Features"
                    description="Select which features to enable"
                    mode="multiple"
                    options={featureOptions}
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
                <h4 className="text-sm font-medium mb-2">
                  Current Form Values:
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    Notifications:{" "}
                    {form.watch("notifications") ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    Email Updates:{" "}
                    {form.watch("emailUpdates") ? "Enabled" : "Disabled"}
                  </p>
                  <p>Theme: {form.watch("theme")}</p>
                  <p>
                    Features: {form.watch("features")?.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <DashboardCard title="Additional Features">
              <div className="space-y-6">
                <FormToggle
                  label="With Error"
                  description="This toggle has an error"
                  value={false}
                  error="This field is required"
                  leftLabel="Off"
                  rightLabel="On"
                />

                <FormToggle
                  label="Custom Size - Small"
                  value={true}
                  leftLabel="Off"
                  rightLabel="On"
                  size="sm"
                />

                <FormToggle
                  label="Custom Size - Large"
                  value={false}
                  leftLabel="Off"
                  rightLabel="On"
                  size="lg"
                />

                <FormToggle
                  label="No Labels"
                  value={true}
                  description="Toggle without left/right labels"
                />

                <FormToggle
                  label="Toggle with Long Description"
                  description="This is a very long description that explains what this toggle does in detail. It can span multiple lines and provides additional context for the user."
                  value={false}
                  leftLabel="Disable"
                  rightLabel="Enable"
                />

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Inline Toggle</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-save</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically save changes
                      </p>
                    </div>
                    <FormToggle
                      value={true}
                      onChange={(val) => console.log("Auto-save:", val)}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">
                    Inline Toggle with Right Label
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable dark mode</span>
                    <FormToggle
                      value={false}
                      onChange={(val) => console.log("Dark mode:", val)}
                      rightLabel="Dark"
                      leftLabel="Light"
                      size="sm"
                    />
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
