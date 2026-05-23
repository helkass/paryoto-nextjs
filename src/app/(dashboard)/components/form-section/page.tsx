// app/form-section-demo/page.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSection } from "@/components/form-section/form-section";
import { FormSectionGroup } from "@/components/form-section/form-section-group";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import {
  User,
  Building,
  Settings,
  Bell,
  Shield,
  Mail,
  Phone,
  Save,
  RefreshCw,
} from "lucide-react";

const formSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),

  // Company Info
  companyName: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  department: z.string().optional(),

  // Preferences
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  language: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function FormSectionDemoPage() {
  const [isPersonalOpen, setIsPersonalOpen] = React.useState(true);
  const [isCompanyOpen, setIsCompanyOpen] = React.useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      position: "",
      department: "",
      emailNotifications: true,
      pushNotifications: false,
      language: "en",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    form.reset();
    toast.info("Form has been reset");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Form Section Components</h1>
          <p className="text-muted-foreground mt-1">
            Collapsible form sections for better organization
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Sections</TabsTrigger>
            <TabsTrigger value="grouped">Grouped Sections</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          {/* Basic Sections */}
          <TabsContent value="basic">
            <DashboardCard title="Basic Collapsible Sections">
              <div className="space-y-4">
                <FormSection
                  title="Personal Information"
                  description="Your basic personal details"
                  icon={<User className="h-4 w-4" />}
                  defaultOpen={true}
                >
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input placeholder="John Doe" className="mt-1" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Company Information"
                  description="Your company details"
                  icon={<Building className="h-4 w-4" />}
                  defaultOpen={false}
                >
                  <div className="space-y-3">
                    <div>
                      <Label>Company Name</Label>
                      <Input placeholder="Acme Inc." className="mt-1" />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input placeholder="Software Engineer" className="mt-1" />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Preferences"
                  description="Your application preferences"
                  icon={<Settings className="h-4 w-4" />}
                  defaultOpen={false}
                  badge={{ text: "Optional", variant: "info" }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Email Notifications</Label>
                      <Switch />
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="id">Indonesian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </FormSection>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Grouped Sections */}
          <TabsContent value="grouped">
            <DashboardCard title="Grouped Form Sections">
              <FormSectionGroup
                sections={[
                  {
                    title: "Account Settings",
                    description: "Manage your account preferences",
                    icon: <Settings className="h-4 w-4" />,
                    children: (
                      <div className="space-y-3">
                        <div>
                          <Label>Username</Label>
                          <Input placeholder="johndoe" className="mt-1" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Notification Preferences",
                    description: "Choose how you want to be notified",
                    icon: <Bell className="h-4 w-4" />,
                    children: (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Email Notifications</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Push Notifications</Label>
                          <Switch />
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Security Settings",
                    description: "Manage your security preferences",
                    icon: <Shield className="h-4 w-4" />,
                    badge: { text: "Recommended", variant: "success" },
                    children: (
                      <div className="space-y-3">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Enable 2FA" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="disabled">Disabled</SelectItem>
                              <SelectItem value="enabled">Enabled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ),
                  },
                ]}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Settings</h3>
                </div>
              </FormSectionGroup>
            </DashboardCard>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <DashboardCard title="Section Variants">
              <div className="space-y-4">
                <FormSection
                  title="Default Variant"
                  description="Rounded corners with border"
                  variant="default"
                >
                  <p className="text-sm text-muted-foreground">
                    Default card style with border and rounded corners.
                  </p>
                </FormSection>

                <FormSection
                  title="Card Variant"
                  description="Card style with shadow"
                  variant="card"
                >
                  <p className="text-sm text-muted-foreground">
                    Card style with shadow and larger border radius.
                  </p>
                </FormSection>

                <FormSection
                  title="Borderless Variant"
                  description="No border, transparent background"
                  variant="borderless"
                  showDivider={false}
                >
                  <p className="text-sm text-muted-foreground">
                    Borderless style with transparent background.
                  </p>
                </FormSection>

                <FormSection
                  title="With Required Field"
                  description="This section contains required fields"
                  required
                  badge={{ text: "Required", variant: "danger" }}
                >
                  <p className="text-sm text-muted-foreground">
                    This section has required fields marked with *.
                  </p>
                </FormSection>

                <FormSection
                  title="Disabled Section"
                  description="This section is disabled"
                  disabled
                >
                  <p className="text-sm text-muted-foreground">
                    This content is not editable.
                  </p>
                </FormSection>

                <FormSection title="Loading Section" loading>
                  <div>Loading content...</div>
                </FormSection>

                <FormSection
                  title="Error Section"
                  error="Failed to load section content"
                >
                  <div>This content will not be shown due to error.</div>
                </FormSection>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Form Section with React Hook Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormSection
                    title="Personal Information"
                    description="Enter your personal details"
                    icon={<User className="h-4 w-4" />}
                    isOpen={isPersonalOpen}
                    onOpenChange={setIsPersonalOpen}
                    required
                    actions={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPersonalOpen(!isPersonalOpen)}
                      >
                        {isPersonalOpen ? "Collapse" : "Expand"}
                      </Button>
                    }
                  >
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          className="mt-1"
                          {...form.register("fullName")}
                        />
                        {form.formState.errors.fullName && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="mt-1"
                          {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="+62 812 3456 7890"
                          className="mt-1"
                          {...form.register("phone")}
                        />
                        {form.formState.errors.phone && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Company Information"
                    description="Enter your company details"
                    icon={<Building className="h-4 w-4" />}
                    isOpen={isCompanyOpen}
                    onOpenChange={setIsCompanyOpen}
                  >
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Acme Inc."
                          className="mt-1"
                          {...form.register("companyName")}
                        />
                        {form.formState.errors.companyName && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.companyName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="position">Position *</Label>
                        <Input
                          id="position"
                          placeholder="Software Engineer"
                          className="mt-1"
                          {...form.register("position")}
                        />
                        {form.formState.errors.position && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.position.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="Engineering"
                          className="mt-1"
                          {...form.register("department")}
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Preferences"
                    description="Set your preferences"
                    icon={<Settings className="h-4 w-4" />}
                    isOpen={isPreferencesOpen}
                    onOpenChange={setIsPreferencesOpen}
                    badge={{ text: "Optional", variant: "info" }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">
                          Email Notifications
                        </Label>
                        <Switch
                          id="emailNotifications"
                          checked={form.watch("emailNotifications")}
                          onCheckedChange={(checked) =>
                            form.setValue("emailNotifications", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications">
                          Push Notifications
                        </Label>
                        <Switch
                          id="pushNotifications"
                          checked={form.watch("pushNotifications")}
                          onCheckedChange={(checked) =>
                            form.setValue("pushNotifications", checked)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={form.watch("language")}
                          onValueChange={(value) =>
                            form.setValue("language", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                            <SelectItem value="ja">日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </FormSection>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Form Summary */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Form Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Personal Info:
                    </span>
                    <span className="font-mono">
                      {form.watch("fullName") || "Not filled"} •{" "}
                      {form.watch("email") || "Not filled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-mono">
                      {form.watch("companyName") || "Not filled"} •{" "}
                      {form.watch("position") || "Not filled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preferences:</span>
                    <span className="font-mono">
                      Email: {form.watch("emailNotifications") ? "On" : "Off"} •
                      Push: {form.watch("pushNotifications") ? "On" : "Off"}
                    </span>
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
