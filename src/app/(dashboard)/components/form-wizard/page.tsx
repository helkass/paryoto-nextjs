// app/form-wizard-demo/page.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormWizard } from "@/components/form-wizard/form-wizard";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { User, Mail, Building } from "lucide-react";

// Step 1 Schema
const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
});

// Step 2 Schema
const step2Schema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
});

// Step 3 Schema
const step3Schema = z.object({
  newsletter: z.boolean().optional(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;

const steps = [
  {
    id: "personal",
    title: "Personal Info",
    description: "Your basic information",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "company",
    title: "Company Info",
    description: "Your company details",
    icon: <Building className="h-4 w-4" />,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Your preferences",
    icon: <Mail className="h-4 w-4" />,
  },
];

export default function FormWizardDemoPage() {
  const [step1Data, setStep1Data] = React.useState<Step1Values>({
    fullName: "",
    email: "",
  });
  const [step2Data, setStep2Data] = React.useState<Step2Values>({
    company: "",
    position: "",
  });
  const [step3Data, setStep3Data] = React.useState<Step3Values>({
    newsletter: false,
    terms: false,
  });

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: step1Data,
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: step2Data,
  });

  const step3Form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: step3Data,
  });

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 0:
        const isValid1 = await step1Form.trigger();
        if (isValid1) {
          setStep1Data(step1Form.getValues());
        }
        return isValid1;
      case 1:
        const isValid2 = await step2Form.trigger();
        if (isValid2) {
          setStep2Data(step2Form.getValues());
        }
        return isValid2;
      case 2:
        const isValid3 = await step3Form.trigger();
        if (isValid3) {
          setStep3Data(step3Form.getValues());
        }
        return isValid3;
      default:
        return true;
    }
  };

  const handleComplete = () => {
    const allData = { ...step1Data, ...step2Data, ...step3Data };
    console.log("Form completed:", allData);
    toast.success("Registration completed successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Form Wizard Components</h1>
          <p className="text-muted-foreground mt-1">
            Multi-step form with validation and progress tracking
          </p>
        </div>

        <Tabs defaultValue="default">
          <TabsList className="mb-6">
            <TabsTrigger value="default">Default Wizard</TabsTrigger>
            <TabsTrigger value="numbered">Numbered Steps</TabsTrigger>
            <TabsTrigger value="icons">Icons Only</TabsTrigger>
            <TabsTrigger value="progress">Progress Only</TabsTrigger>
          </TabsList>

          {/* Default Wizard */}
          <TabsContent value="default">
            <DashboardCard title="Multi-Step Registration Form">
              <FormWizard
                steps={steps}
                validateStep={validateStep}
                onComplete={handleComplete}
                variant="default"
                showNavigation
              >
                {({ step }) => (
                  <>
                    {step === 0 && (
                      <Form {...step1Form}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              placeholder="John Doe"
                              {...step1Form.register("fullName")}
                            />
                            {step1Form.formState.errors.fullName && (
                              <p className="text-xs text-destructive">
                                {step1Form.formState.errors.fullName.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              {...step1Form.register("email")}
                            />
                            {step1Form.formState.errors.email && (
                              <p className="text-xs text-destructive">
                                {step1Form.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </Form>
                    )}
                    {step === 1 && (
                      <Form {...step2Form}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name *</Label>
                            <Input
                              id="company"
                              placeholder="Acme Inc."
                              {...step2Form.register("company")}
                            />
                            {step2Form.formState.errors.company && (
                              <p className="text-xs text-destructive">
                                {step2Form.formState.errors.company.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Position *</Label>
                            <Input
                              id="position"
                              placeholder="Software Engineer"
                              {...step2Form.register("position")}
                            />
                            {step2Form.formState.errors.position && (
                              <p className="text-xs text-destructive">
                                {step2Form.formState.errors.position.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </Form>
                    )}
                    {step === 2 && (
                      <Form {...step3Form}>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="newsletter"
                              {...step3Form.register("newsletter")}
                              className="h-4 w-4 rounded border-input"
                            />
                            <Label htmlFor="newsletter">
                              Subscribe to newsletter
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="terms"
                              {...step3Form.register("terms")}
                              className="h-4 w-4 rounded border-input"
                            />
                            <Label htmlFor="terms" className="required">
                              I accept the terms and conditions *
                            </Label>
                          </div>
                          {step3Form.formState.errors.terms && (
                            <p className="text-xs text-destructive">
                              {step3Form.formState.errors.terms.message}
                            </p>
                          )}
                        </div>
                      </Form>
                    )}
                  </>
                )}
              </FormWizard>
            </DashboardCard>
          </TabsContent>

          {/* Numbered Steps */}
          <TabsContent value="numbered">
            <DashboardCard title="Numbered Steps Wizard">
              <FormWizard
                steps={steps}
                validateStep={validateStep}
                onComplete={() => toast.success("Completed!")}
                variant="numbered"
                orientation="vertical"
              >
                {({ step }) => (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-center text-muted-foreground">
                      Content for step {step + 1}: {steps[step].title}
                    </p>
                  </div>
                )}
              </FormWizard>
            </DashboardCard>
          </TabsContent>

          {/* Icons Only */}
          <TabsContent value="icons">
            <DashboardCard title="Icons Only Wizard">
              <FormWizard
                steps={steps}
                validateStep={validateStep}
                onComplete={() => toast.success("Completed!")}
                variant="icons"
              >
                {({ step }) => (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-center text-muted-foreground">
                      Current step: {steps[step].title}
                    </p>
                  </div>
                )}
              </FormWizard>
            </DashboardCard>
          </TabsContent>

          {/* Progress Only */}
          <TabsContent value="progress">
            <DashboardCard title="Progress Only Wizard">
              <FormWizard
                steps={steps}
                validateStep={validateStep}
                onComplete={() => toast.success("Completed!")}
                variant="progress"
                showProgress
                progressLabel={(current, total) =>
                  `Step ${current} of ${total}`
                }
              >
                {({ step }) => (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-center text-muted-foreground">
                      Content for step {step + 1}
                    </p>
                  </div>
                )}
              </FormWizard>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
