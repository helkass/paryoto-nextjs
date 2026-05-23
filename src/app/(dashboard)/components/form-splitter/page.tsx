// app/form-splitter-demo/page.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormSplitter } from "@/components/form-splitter/form-splitter";
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
  Save,
  RefreshCw,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

// Form schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().optional(),
});

const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  department: z.string().optional(),
  employeeId: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type CompanyInfoValues = z.infer<typeof companyInfoSchema>;

export default function FormSplitterDemoPage() {
  const [leftWidth, setLeftWidth] = React.useState(50);
  const [isVertical, setIsVertical] = React.useState(false);

  const personalForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const companyForm = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      position: "",
      department: "",
      employeeId: "",
    },
  });

  const handleSave = () => {
    const personalData = personalForm.getValues();
    const companyData = companyForm.getValues();

    console.log("Personal Info:", personalData);
    console.log("Company Info:", companyData);

    toast.success("Form data saved!");
  };

  const handleReset = () => {
    personalForm.reset();
    companyForm.reset();
    toast.info("Form has been reset");
  };

  const LeftForm = () => (
    <Form {...personalForm}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...personalForm.register("fullName")}
          />
          {personalForm.formState.errors.fullName && (
            <p className="text-xs text-destructive">
              {personalForm.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...personalForm.register("email")}
          />
          {personalForm.formState.errors.email && (
            <p className="text-xs text-destructive">
              {personalForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            placeholder="+62 812 3456 7890"
            {...personalForm.register("phone")}
          />
          {personalForm.formState.errors.phone && (
            <p className="text-xs text-destructive">
              {personalForm.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your address"
            className="resize-none"
            rows={3}
            {...personalForm.register("address")}
          />
        </div>
      </div>
    </Form>
  );

  const RightForm = () => (
    <Form {...companyForm}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            placeholder="Acme Inc."
            {...companyForm.register("companyName")}
          />
          {companyForm.formState.errors.companyName && (
            <p className="text-xs text-destructive">
              {companyForm.formState.errors.companyName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            placeholder="Software Engineer"
            {...companyForm.register("position")}
          />
          {companyForm.formState.errors.position && (
            <p className="text-xs text-destructive">
              {companyForm.formState.errors.position.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={companyForm.watch("department")}
            onValueChange={(value) => companyForm.setValue("department", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            placeholder="EMP-001"
            {...companyForm.register("employeeId")}
          />
        </div>
      </div>
    </Form>
  );

  const PreviewPanel = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Form Preview</CardTitle>
          <CardDescription>Review your information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="mb-2 text-sm font-medium">Personal Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{personalForm.watch("fullName") || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{personalForm.watch("email") || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{personalForm.watch("phone") || "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="mb-2 text-sm font-medium">Company Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span>{companyForm.watch("companyName") || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span>{companyForm.watch("position") || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span>{companyForm.watch("department") || "—"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Form Splitter Components</h1>
          <p className="text-muted-foreground mt-1">
            Two-column split forms with resizable panels
          </p>
        </div>

        <Tabs defaultValue="horizontal">
          <TabsList className="mb-6">
            <TabsTrigger value="horizontal">Horizontal Split</TabsTrigger>
            <TabsTrigger value="vertical">Vertical Split</TabsTrigger>
            <TabsTrigger value="preview">With Preview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Horizontal Split */}
          <TabsContent value="horizontal">
            <DashboardCard title="Horizontal Split Form">
              <div className="space-y-4">
                <FormSplitter
                  leftContent={LeftForm()}
                  rightContent={RightForm()}
                  leftLabel="Personal Information"
                  rightLabel="Company Information"
                  leftIcon={<User className="h-4 w-4" />}
                  rightIcon={<Building className="h-4 w-4" />}
                  defaultLeftWidth={50}
                  resizable
                  onWidthChange={(width) =>
                    console.log("Width changed:", width)
                  }
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save All
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Vertical Split */}
          <TabsContent value="vertical">
            <DashboardCard title="Vertical Split Form">
              <FormSplitter
                leftContent={LeftForm()}
                rightContent={RightForm()}
                leftLabel="Personal Information"
                rightLabel="Company Information"
                direction="vertical"
                defaultLeftWidth={40}
                minLeftWidth={30}
                maxLeftWidth={60}
                resizable
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save All
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Preview */}
          <TabsContent value="preview">
            <DashboardCard title="Form with Live Preview">
              <FormSplitter
                leftContent={LeftForm()}
                rightContent={PreviewPanel()}
                leftLabel="Edit Information"
                rightLabel="Live Preview"
                leftIcon={<Settings className="h-4 w-4" />}
                rightIcon={<Eye className="h-4 w-4" />}
                defaultLeftWidth={45}
                maxLeftWidth={55}
                minLeftWidth={35}
                resizable
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save All
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <DashboardCard title="Splitter Features">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">Non-resizable Splitter</h3>
                  <FormSplitter
                    leftContent={
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="text-muted-foreground">
                          Fixed Left Panel
                        </p>
                      </div>
                    }
                    rightContent={
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="text-muted-foreground">
                          Fixed Right Panel
                        </p>
                      </div>
                    }
                    resizable={false}
                    defaultLeftWidth={40}
                  />
                </div>

                <div>
                  <h3 className="mb-3 font-medium">With Custom Width Limits</h3>
                  <FormSplitter
                    leftContent={
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="text-muted-foreground">
                          Left Panel (Min 20%, Max 50%)
                        </p>
                      </div>
                    }
                    rightContent={
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="text-muted-foreground">Right Panel</p>
                      </div>
                    }
                    defaultLeftWidth={30}
                    minLeftWidth={20}
                    maxLeftWidth={50}
                    resizable
                  />
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Without Gutter</h3>
                  <FormSplitter
                    leftContent={
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="text-muted-foreground">Left Panel</p>
                      </div>
                    }
                    rightContent={
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="text-muted-foreground">Right Panel</p>
                      </div>
                    }
                    showGutter={false}
                    defaultLeftWidth={50}
                  />
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Loading State</h3>
                  <FormSplitter
                    leftContent={<div>Left Content</div>}
                    rightContent={<div>Right Content</div>}
                    loading
                  />
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Error State</h3>
                  <FormSplitter
                    leftContent={<div>Left Content</div>}
                    rightContent={<div>Right Content</div>}
                    error="Failed to load splitter content"
                  />
                </div>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
