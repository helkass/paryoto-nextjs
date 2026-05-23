// app/otp-input-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormOtpInputField } from "@/components/form/form-otp-input-field";
import { FormOtpInput } from "@/components/otp-input/form-otp-input";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  pin: z.string().length(4, "PIN must be 4 digits").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function OtpInputDemoPage() {
  const [otpValue, setOtpValue] = useState("");
  const [canResend, setCanResend] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      pin: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success(`Verification code: ${data.otp}`);
  };

  const handleResend = () => {
    setCanResend(false);
    toast.info("Resending verification code...");
    setTimeout(() => {
      setCanResend(true);
      toast.success("Code resent! Check your phone/email");
    }, 3000);
  };

  const handleOtpComplete = (code: string) => {
    console.log("OTP completed:", code);
    toast.success(`Code ${code} entered successfully`);
  };

  const validateOtp = (value: string): boolean | string => {
    if (value === "123456") {
      return "This is a test code, please use a different code";
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">OTP Input Components</h1>
          <p className="text-muted-foreground mt-1">
            One-time password input with auto-focus, paste support, and timer
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="configurations">Configurations</TabsTrigger>
            <TabsTrigger value="timer">With Timer</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic">
            <DashboardCard title="Basic OTP Input">
              <div className="space-y-8">
                <FormOtpInput
                  label="Verification Code"
                  description="Enter the 6-digit code sent to your phone"
                  numInputs={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  onComplete={handleOtpComplete}
                />

                <FormOtpInput
                  label="4-Digit PIN"
                  description="Enter your 4-digit PIN"
                  numInputs={4}
                  placeholder="0"
                />

                <FormOtpInput
                  label="Read-only OTP"
                  value="123456"
                  numInputs={6}
                  readOnly
                />

                <FormOtpInput label="Disabled OTP" numInputs={6} disabled />

                <FormOtpInput label="Loading State" numInputs={6} loading />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Configurations */}
          <TabsContent value="configurations">
            <DashboardCard title="OTP Configurations">
              <div className="space-y-8">
                <FormOtpInput
                  label="With Separator ( - )"
                  numInputs={6}
                  separator={<span className="mx-1">-</span>}
                />

                <FormOtpInput
                  label="With Custom Placeholder"
                  numInputs={6}
                  placeholder="_"
                />

                <FormOtpInput
                  label="Secure Mode (Masked)"
                  numInputs={6}
                  isSecure
                  maskCharacter="*"
                />

                <FormOtpInput
                  label="5-Digit Code"
                  numInputs={5}
                  placeholder="●"
                />

                <FormOtpInput
                  label="8-Digit Code"
                  numInputs={8}
                  placeholder="●"
                />

                <FormOtpInput
                  label="With Validation (cannot be 123456)"
                  numInputs={6}
                  validate={validateOtp}
                  onOtpSubmit={(code) => {
                    if (code === "123456") {
                      toast.error("Invalid test code");
                    } else {
                      toast.success("Valid code!");
                    }
                  }}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Timer */}
          <TabsContent value="timer">
            <DashboardCard title="OTP with Timer">
              <div className="space-y-8">
                <FormOtpInput
                  label="Verification Code"
                  description="Enter the 6-digit code sent to your email"
                  numInputs={6}
                  showTimer
                  timerDuration={60}
                  onTimerEnd={() =>
                    toast.info("Timer expired, please request new code")
                  }
                  onResend={handleResend}
                />

                <FormOtpInput
                  label="No Auto-focus"
                  numInputs={6}
                  autoFocus={false}
                  showTimer
                  timerDuration={30}
                />

                <FormOtpInput
                  label="Custom Resend Text"
                  numInputs={6}
                  showTimer
                  timerDuration={45}
                  resendText="Request New Code"
                  onResend={handleResend}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="OTP Input with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormOtpInputField
                    control={form.control}
                    name="otp"
                    label="Verification Code"
                    description="Enter the 6-digit verification code"
                    required
                    numInputs={6}
                    onComplete={(code) => console.log("Complete:", code)}
                  />

                  <FormOtpInputField
                    control={form.control}
                    name="pin"
                    label="PIN Code (Optional)"
                    description="Enter your 4-digit PIN"
                    numInputs={4}
                    isSecure
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Verify</Button>
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

              {/* Form Values */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Form Values</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>OTP Code:</span>
                    <span className="font-mono">
                      {form.watch("otp") || "_____"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PIN Code:</span>
                    <span className="font-mono">
                      {form.watch("pin") ? "****" : "____"}
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
