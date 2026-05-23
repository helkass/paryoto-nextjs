// app/stepper-demo/page.tsx
"use client";

import * as React from "react";
import { Stepper } from "@/components/stepper/stepper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CheckCircle,
  Settings,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";

const steps = [
  {
    id: "personal",
    title: "Personal Info",
    description: "Your basic information",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "contact",
    title: "Contact Details",
    description: "How to reach you",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "address",
    title: "Address",
    description: "Your location",
    icon: <MapPin className="h-4 w-4" />,
    optional: true,
  },
  {
    id: "payment",
    title: "Payment",
    description: "Payment information",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "confirm",
    title: "Confirm",
    description: "Review your information",
    icon: <CheckCircle className="h-4 w-4" />,
  },
];

const longSteps = [
  {
    id: "1",
    title: "Step with very long title that might need truncation",
    description:
      "This is a long description that explains what this step is about",
  },
  {
    id: "2",
    title: "Second Step",
    description: "This is the second step description",
  },
  {
    id: "3",
    title: "Third Step",
    description: "This is the third step description",
  },
];

export default function StepperDemoPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardName: "",
  });

  const handleNext = () => {
    toast.success(`Moving to step ${activeStep + 2}`);
  };

  const handlePrevious = () => {
    toast.info(`Back to step ${activeStep}`);
  };

  const handleComplete = () => {
    console.log("Form completed:", formData);
    toast.success("Registration completed successfully!");
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.fullName) {
          toast.error("Please enter your full name");
          return false;
        }
        if (!formData.email) {
          toast.error("Please enter your email");
          return false;
        }
        return true;
      case 1:
        if (!formData.phone) {
          toast.error("Please enter your phone number");
          return false;
        }
        return true;
      case 3:
        if (!formData.cardNumber) {
          toast.error("Please enter card number");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+62 812 3456 7890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="Name on card"
                value={formData.cardName}
                onChange={(e) =>
                  setFormData({ ...formData, cardName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" type="password" placeholder="123" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold">Review Your Information</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span>{formData.fullName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{formData.email || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{formData.phone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span>{formData.address || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Number:</span>
                  <span>
                    {formData.cardNumber
                      ? "**** **** **** " + formData.cardNumber.slice(-4)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Stepper Components</h1>
          <p className="text-muted-foreground mt-1">
            Multi-step wizard with progress tracking and validation
          </p>
        </div>

        <Tabs defaultValue="default">
          <TabsList className="mb-6">
            <TabsTrigger value="default">Default Stepper</TabsTrigger>
            <TabsTrigger value="numbered">Numbered Steps</TabsTrigger>
            <TabsTrigger value="icons">Icons Only</TabsTrigger>
            <TabsTrigger value="vertical">Vertical</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Default Stepper */}
          <TabsContent value="default">
            <DashboardCard title="Registration Wizard">
              <Stepper
                steps={steps}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                orientation="horizontal"
                variant="default"
                validateStep={validateStep}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onComplete={handleComplete}
                showStepNumbers
              />
              <div className="mt-6">{renderStepContent()}</div>
            </DashboardCard>
          </TabsContent>
          {/* Numbered Steps */}
          <TabsContent value="numbered">
            <DashboardCard title="Numbered Steps">
              <Stepper
                steps={steps.slice(0, 4)}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                variant="numbered"
                showStepNumbers
              />
              <div className="p-4 text-center text-muted-foreground">
                Content for step {activeStep + 1}
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Icons Only */}
          <TabsContent value="icons">
            <DashboardCard title="Icons Only">
              <Stepper
                steps={steps}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                variant="icons"
                showStepNumbers={false}
              />
              <div className="p-4 text-center text-muted-foreground">
                Current step: {steps[activeStep].title}
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Vertical */}
          {/* Vertical */}
          <TabsContent value="vertical">
            <DashboardCard title="Vertical Stepper">
              <Stepper
                steps={steps.slice(0, 4)}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                orientation="vertical"
                variant="default"
              />
              <div className="p-4 text-center text-muted-foreground">
                Content for step {activeStep + 1}
              </div>
            </DashboardCard>
          </TabsContent>
          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-6">
              <DashboardCard title="With Progress Variant">
                <Stepper
                  steps={steps}
                  activeStep={activeStep}
                  variant="progress"
                  showNavigation={false}
                />
              </DashboardCard>

              <DashboardCard title="Disabled Step Click">
                <Stepper
                  steps={steps.slice(0, 4)}
                  activeStep={activeStep}
                  allowStepClick={false}
                />
                <div className="p-4 text-center text-muted-foreground">
                  You cannot click on step indicators
                </div>
              </DashboardCard>

              <DashboardCard title="Without Connector">
                <Stepper
                  steps={steps.slice(0, 4)}
                  activeStep={activeStep}
                  showConnector={false}
                />
                <div className="p-4 text-center text-muted-foreground">
                  No connecting lines between steps
                </div>
              </DashboardCard>

              <DashboardCard title="Truncated Labels">
                <Stepper steps={longSteps} activeStep={0} truncateLabels />
                <div className="p-4 text-center text-muted-foreground">
                  Long labels are truncated
                </div>
              </DashboardCard>

              <DashboardCard title="Small Size">
                <Stepper
                  steps={steps.slice(0, 4)}
                  activeStep={activeStep}
                  size="sm"
                />
                <div className="p-4 text-center text-muted-foreground">
                  Compact stepper
                </div>
              </DashboardCard>

              <DashboardCard title="Large Size">
                <Stepper
                  steps={steps.slice(0, 4)}
                  activeStep={activeStep}
                  size="lg"
                />
                <div className="p-4 text-center text-muted-foreground">
                  Large stepper
                </div>
              </DashboardCard>

              <Card>
                <CardHeader>
                  <CardTitle>Stepper Features</CardTitle>
                  <CardDescription>
                    Available options and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variants:</span>
                      <span>default, numbered, icons, progress</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Orientations:
                      </span>
                      <span>horizontal, vertical</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sizes:</span>
                      <span>sm, md, lg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Validation:</span>
                      <span>per-step validation before proceeding</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Navigation:</span>
                      <span>Next, Back, Complete buttons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
