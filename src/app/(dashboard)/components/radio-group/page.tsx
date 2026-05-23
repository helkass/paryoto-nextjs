// app/radio-group-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormRadioGroup } from "@/components/radio-group/form-radio-group";
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
  Sun,
  Moon,
  Monitor,
  CreditCard,
  Banknote,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  Building,
  MapPin,
} from "lucide-react";
import { FormRadioGroupField } from "@/components/form/form-radio-group-field";

const formSchema = z.object({
  theme: z.string().min(1, "Please select a theme"),
  payment: z.string().min(1, "Please select a payment method"),
  size: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Options data
const themeOptions = [
  {
    value: "light",
    label: "Light Mode",
    description: "Light color scheme",
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: "dark",
    label: "Dark Mode",
    description: "Dark color scheme",
    icon: <Moon className="h-4 w-4" />,
  },
  {
    value: "system",
    label: "System Default",
    description: "Follow system preference",
    icon: <Monitor className="h-4 w-4" />,
  },
];

const paymentOptions = [
  {
    value: "card",
    label: "Credit Card",
    description: "Pay with credit or debit card",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    value: "bank",
    label: "Bank Transfer",
    description: "Direct bank transfer",
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    value: "e-wallet",
    label: "E-Wallet",
    description: "Digital wallet payment",
    icon: <Receipt className="h-5 w-5" />,
  },
];

const sizeOptions = [
  { value: "small", label: "Small", description: "Small size option" },
  { value: "medium", label: "Medium", description: "Medium size option" },
  { value: "large", label: "Large", description: "Large size option" },
];

const statusOptions = [
  {
    value: "active",
    label: "Active",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  { value: "pending", label: "Pending", icon: <Clock className="h-4 w-4" /> },
  {
    value: "inactive",
    label: "Inactive",
    icon: <AlertCircle className="h-4 w-4" />,
  },
];

const locationOptions = [
  {
    value: "home",
    label: "Home",
    description: "Residential address",
    icon: <Home className="h-4 w-4" />,
  },
  {
    value: "office",
    label: "Office",
    description: "Business address",
    icon: <Building className="h-4 w-4" />,
  },
  {
    value: "other",
    label: "Other",
    description: "Alternative address",
    icon: <MapPin className="h-4 w-4" />,
  },
];

export default function RadioGroupDemoPage() {
  const [theme, setTheme] = useState("light");
  const [payment, setPayment] = useState("card");
  const [size, setSize] = useState("medium");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "light",
      payment: "card",
      size: "medium",
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
          <h1 className="text-3xl font-bold">Radio Group Components</h1>
          <p className="text-muted-foreground mt-1">
            Radio buttons with custom styling and multiple variants
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
                <FormRadioGroup
                  label="Choose Theme"
                  description="Select your preferred theme"
                  value={theme}
                  onChange={setTheme}
                  options={themeOptions}
                  variant="default"
                  layout="vertical"
                />
              </DashboardCard>

              <DashboardCard title="Card Variant">
                <FormRadioGroup
                  label="Payment Method"
                  description="Select your payment method"
                  value={payment}
                  onChange={setPayment}
                  options={paymentOptions}
                  variant="card"
                  layout="grid"
                  columns={3}
                />
              </DashboardCard>

              <DashboardCard title="Button Variant">
                <FormRadioGroup
                  label="Size Selection"
                  value={size}
                  onChange={setSize}
                  options={sizeOptions}
                  variant="button"
                  layout="horizontal"
                />
              </DashboardCard>

              <DashboardCard title="Modern Variant">
                <FormRadioGroup
                  label="Location Type"
                  value="home"
                  onChange={(val) => console.log("Location:", val)}
                  options={locationOptions}
                  variant="modern"
                  layout="vertical"
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Layouts */}
          <TabsContent value="layouts">
            <div className="space-y-6">
              <DashboardCard title="Vertical Layout">
                <FormRadioGroup
                  label="Status"
                  value="active"
                  options={statusOptions}
                  layout="vertical"
                  variant="default"
                />
              </DashboardCard>

              <DashboardCard title="Horizontal Layout">
                <FormRadioGroup
                  label="Alignment"
                  value="left"
                  options={[
                    { value: "left", label: "Left Align" },
                    { value: "center", label: "Center Align" },
                    { value: "right", label: "Right Align" },
                  ]}
                  layout="horizontal"
                  variant="button"
                />
              </DashboardCard>

              <DashboardCard title="Grid Layout (2 columns)">
                <FormRadioGroup
                  label="Features"
                  value="analytics"
                  options={[
                    {
                      value: "analytics",
                      label: "Analytics",
                      description: "View analytics dashboard",
                    },
                    {
                      value: "reports",
                      label: "Reports",
                      description: "Generate reports",
                    },
                    {
                      value: "settings",
                      label: "Settings",
                      description: "Configure settings",
                    },
                    {
                      value: "users",
                      label: "Users",
                      description: "Manage users",
                    },
                  ]}
                  layout="grid"
                  columns={2}
                  variant="card"
                />
              </DashboardCard>

              <DashboardCard title="Grid Layout (3 columns)">
                <FormRadioGroup
                  label="Categories"
                  value="electronics"
                  options={[
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                    { value: "books", label: "Books" },
                    { value: "home", label: "Home & Garden" },
                    { value: "sports", label: "Sports" },
                    { value: "toys", label: "Toys" },
                  ]}
                  layout="grid"
                  columns={3}
                  variant="button"
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Radio Group with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormRadioGroupField
                    control={form.control}
                    name="theme"
                    label="Theme Preference"
                    description="Choose your preferred theme"
                    required
                    options={themeOptions}
                    variant="card"
                    layout="vertical"
                  />

                  <FormRadioGroupField
                    control={form.control}
                    name="payment"
                    label="Payment Method"
                    description="Select your payment method"
                    required
                    options={paymentOptions}
                    variant="modern"
                    layout="grid"
                    columns={3}
                  />

                  <FormRadioGroupField
                    control={form.control}
                    name="size"
                    label="Size"
                    options={sizeOptions}
                    variant="button"
                    layout="horizontal"
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
                  <p>Theme: {form.watch("theme")}</p>
                  <p>Payment: {form.watch("payment")}</p>
                  <p>Size: {form.watch("size") || "Not selected"}</p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <DashboardCard title="Additional Features">
              <div className="space-y-6">
                <FormRadioGroup
                  label="Disabled Group"
                  description="This radio group is disabled"
                  value="option1"
                  disabled
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                  variant="card"
                />

                <FormRadioGroup
                  label="With Disabled Option"
                  value="option1"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2", disabled: true },
                    { value: "option3", label: "Option 3" },
                  ]}
                  variant="default"
                />

                <FormRadioGroup
                  label="With Error"
                  value=""
                  error="Please select an option"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                  ]}
                  variant="card"
                />

                <FormRadioGroup
                  label="Loading State"
                  loading
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                  ]}
                />

                <FormRadioGroup
                  label="Small Size"
                  size="sm"
                  value="small"
                  options={[
                    { value: "small", label: "Small Option" },
                    { value: "medium", label: "Medium Option" },
                    { value: "large", label: "Large Option" },
                  ]}
                  variant="card"
                />

                <FormRadioGroup
                  label="Large Size"
                  size="lg"
                  value="large"
                  options={[
                    { value: "small", label: "Small Option" },
                    { value: "medium", label: "Medium Option" },
                    { value: "large", label: "Large Option" },
                  ]}
                  variant="card"
                />

                <FormRadioGroup
                  label="Read Only"
                  readOnly
                  value="readonly"
                  options={[
                    { value: "readonly", label: "Read Only Option" },
                    { value: "other", label: "Other Option" },
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
