// app/checkbox-group-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormCheckboxGroup } from "@/components/checkbox-group/form-checkbox-group";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Camera,
  Mail,
  Bell,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { FormCheckboxGroupField } from "@/components/form/form-checkbox-group-field";

const formSchema = z.object({
  categories: z.array(z.string()).min(1, "Please select at least one category"),
  notifications: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Options data
const categoryOptions = [
  {
    value: "electronics",
    label: "Electronics",
    description: "Gadgets and devices",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    value: "computers",
    label: "Computers",
    description: "Laptops and desktops",
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    value: "tablets",
    label: "Tablets",
    description: "Tablets and e-readers",
    icon: <Tablet className="h-4 w-4" />,
  },
  {
    value: "audio",
    label: "Audio",
    description: "Headphones and speakers",
    icon: <Headphones className="h-4 w-4" />,
  },
  {
    value: "wearables",
    label: "Wearables",
    description: "Smartwatches and fitness",
    icon: <Watch className="h-4 w-4" />,
  },
  {
    value: "cameras",
    label: "Cameras",
    description: "Cameras and accessories",
    icon: <Camera className="h-4 w-4" />,
  },
];

const notificationOptions = [
  {
    value: "email",
    label: "Email",
    description: "Receive email notifications",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    value: "push",
    label: "Push",
    description: "Push notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    value: "sms",
    label: "SMS",
    description: "Text message notifications",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

const featureOptions = [
  {
    value: "analytics",
    label: "Analytics",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    value: "users",
    label: "User Management",
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: "settings",
    label: "Advanced Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    value: "security",
    label: "Security",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    value: "performance",
    label: "Performance",
    icon: <Zap className="h-4 w-4" />,
  },
];

const ratingOptions = [
  { value: "1", label: "⭐ Poor" },
  { value: "2", label: "⭐⭐ Fair" },
  { value: "3", label: "⭐⭐⭐ Good" },
  { value: "4", label: "⭐⭐⭐⭐ Very Good" },
  { value: "5", label: "⭐⭐⭐⭐⭐ Excellent" },
];

export default function CheckboxGroupDemoPage() {
  const [categories, setCategories] = useState<string[]>([
    "electronics",
    "computers",
  ]);
  const [notifications, setNotifications] = useState<string[]>([
    "email",
    "push",
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: ["electronics", "computers"],
      notifications: ["email", "push"],
      features: ["analytics", "users"],
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
          <h1 className="text-3xl font-bold">Checkbox Group Components</h1>
          <p className="text-muted-foreground mt-1">
            Multi-select checkboxes with custom styling and variants
          </p>
        </div>

        <Tabs defaultValue="variants">
          <TabsList className="mb-6">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="space-y-6">
              <DashboardCard title="Default Variant">
                <FormCheckboxGroup
                  label="Select Categories"
                  description="Choose product categories you're interested in"
                  value={categories}
                  onChange={setCategories}
                  options={categoryOptions.slice(0, 4)}
                  variant="default"
                  layout="vertical"
                />
              </DashboardCard>

              <DashboardCard title="Card Variant">
                <FormCheckboxGroup
                  label="Product Categories"
                  description="Select your preferred categories"
                  value={categories}
                  onChange={setCategories}
                  options={categoryOptions}
                  variant="card"
                  layout="grid"
                  columns={2}
                  selectAll
                />
              </DashboardCard>

              <DashboardCard title="Button Variant">
                <FormCheckboxGroup
                  label="Features"
                  value={["analytics", "users"]}
                  onChange={(val) => console.log("Features:", val)}
                  options={featureOptions}
                  variant="button"
                  layout="horizontal"
                />
              </DashboardCard>

              <DashboardCard title="Modern Variant">
                <FormCheckboxGroup
                  label="Notification Preferences"
                  value={notifications}
                  onChange={setNotifications}
                  options={notificationOptions}
                  variant="modern"
                  layout="vertical"
                  selectAll
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Layouts */}
          <TabsContent value="layouts">
            <div className="space-y-6">
              <DashboardCard title="Vertical Layout">
                <FormCheckboxGroup
                  label="Ratings"
                  value={["4", "5"]}
                  options={ratingOptions}
                  layout="vertical"
                  variant="default"
                />
              </DashboardCard>

              <DashboardCard title="Horizontal Layout">
                <FormCheckboxGroup
                  label="Features"
                  value={["analytics"]}
                  options={featureOptions.slice(0, 3)}
                  layout="horizontal"
                  variant="button"
                />
              </DashboardCard>

              <DashboardCard title="Grid Layout (2 columns)">
                <FormCheckboxGroup
                  label="Select Interests"
                  value={["electronics", "computers"]}
                  options={categoryOptions}
                  layout="grid"
                  columns={2}
                  variant="card"
                  selectAll
                />
              </DashboardCard>

              <DashboardCard title="Grid Layout (3 columns)">
                <FormCheckboxGroup
                  label="All Categories"
                  value={["electronics", "audio"]}
                  options={categoryOptions}
                  layout="grid"
                  columns={3}
                  variant="modern"
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Checkbox Group with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormCheckboxGroupField
                    control={form.control}
                    name="categories"
                    label="Product Categories"
                    description="Select at least one category"
                    required
                    options={categoryOptions}
                    variant="card"
                    layout="grid"
                    columns={2}
                    selectAll
                    maxSelections={4}
                    minSelections={1}
                  />

                  <FormCheckboxGroupField
                    control={form.control}
                    name="notifications"
                    label="Notification Preferences"
                    description="Choose how you want to receive updates"
                    options={notificationOptions}
                    variant="modern"
                    layout="vertical"
                    selectAll
                  />

                  <FormCheckboxGroupField
                    control={form.control}
                    name="features"
                    label="Additional Features"
                    options={featureOptions}
                    variant="button"
                    layout="horizontal"
                    maxSelections={3}
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

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">
                  Current Form Values:
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    Categories: {form.watch("categories")?.join(", ") || "None"}
                  </p>
                  <p>
                    Notifications:{" "}
                    {form.watch("notifications")?.join(", ") || "None"}
                  </p>
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
                <FormCheckboxGroup
                  label="Disabled Group"
                  description="This checkbox group is disabled"
                  value={["option1"]}
                  disabled
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                  variant="card"
                />

                <FormCheckboxGroup
                  label="With Disabled Options"
                  value={["option1"]}
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2", disabled: true },
                    { value: "option3", label: "Option 3" },
                    { value: "option4", label: "Option 4", disabled: true },
                  ]}
                  variant="card"
                />

                <FormCheckboxGroup
                  label="With Error"
                  value={[]}
                  error="Please select at least one option"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                  ]}
                  variant="card"
                />

                <FormCheckboxGroup
                  label="Loading State"
                  loading
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                  ]}
                />

                <FormCheckboxGroup
                  label="With Selection Limits (Max 2)"
                  value={["analytics"]}
                  maxSelections={2}
                  options={featureOptions}
                  variant="card"
                  selectAll
                />

                <FormCheckboxGroup
                  label="With Selection Limits (Min 2)"
                  value={["analytics"]}
                  minSelections={2}
                  options={featureOptions}
                  variant="card"
                />

                <FormCheckboxGroup
                  label="Small Size"
                  size="sm"
                  value={["option1"]}
                  options={[
                    { value: "option1", label: "Small Option 1" },
                    { value: "option2", label: "Small Option 2" },
                    { value: "option3", label: "Small Option 3" },
                  ]}
                  variant="card"
                />

                <FormCheckboxGroup
                  label="Large Size"
                  size="lg"
                  value={["option1"]}
                  options={[
                    { value: "option1", label: "Large Option 1" },
                    { value: "option2", label: "Large Option 2" },
                    { value: "option3", label: "Large Option 3" },
                  ]}
                  variant="card"
                />

                <FormCheckboxGroup
                  label="Read Only"
                  readOnly
                  value={["option1", "option2"]}
                  options={[
                    { value: "option1", label: "Read Only Option 1" },
                    { value: "option2", label: "Read Only Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                  variant="card"
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
