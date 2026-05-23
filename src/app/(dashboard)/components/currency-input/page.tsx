// app/currency-input-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormCurrencyInputField } from "@/components/form/form-currency-input-field";
import { FormCurrencyInput } from "@/components/currency-input/form-currency-input";
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
  price: z.number().min(0, "Price must be positive"),
  budget: z.number().optional(),
  salary: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CurrencyInputDemoPage() {
  const [price, setPrice] = useState<number | null>(1500000);
  const [budget, setBudget] = useState<number | null>(50000000);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 1500000,
      budget: 50000000,
      salary: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success(`Price: ${data.price?.toLocaleString("id-ID")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Currency Input Components</h1>
          <p className="text-muted-foreground mt-1">
            Currency input with automatic formatting for IDR, USD, and more
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="configurations">Configurations</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic">
            <DashboardCard title="Basic Currency Input">
              <div className="space-y-6">
                <FormCurrencyInput
                  label="Price (IDR)"
                  description="Enter product price in Indonesian Rupiah"
                  value={price ?? undefined}
                  onChange={setPrice}
                  currency="IDR"
                  placeholder="0"
                />

                <FormCurrencyInput
                  label="Budget (USD)"
                  description="Enter budget in US Dollar"
                  value={budget ?? undefined}
                  onChange={setBudget}
                  currency="USD"
                  decimals={2}
                  placeholder="0.00"
                />

                <FormCurrencyInput
                  label="Read-only"
                  value={25000000}
                  currency="IDR"
                  readOnly
                />

                <FormCurrencyInput
                  label="Disabled"
                  value={1000000}
                  currency="IDR"
                  disabled
                />

                <FormCurrencyInput
                  label="Loading State"
                  loading
                  currency="IDR"
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Configurations */}
          <TabsContent value="configurations">
            <DashboardCard title="Currency Input Configurations">
              <div className="space-y-6">
                <FormCurrencyInput
                  label="With Decimals (2 decimals)"
                  currency="IDR"
                  decimals={2}
                  placeholder="0.00"
                />

                <FormCurrencyInput
                  label="Without Decimals"
                  currency="IDR"
                  decimals={0}
                  placeholder="0"
                />

                <FormCurrencyInput
                  label="Custom Prefix"
                  prefix="$ "
                  suffix=" USD"
                  placeholder="0"
                />

                <FormCurrencyInput
                  label="Custom Separators"
                  decimalSeparator="."
                  groupSeparator=","
                  prefix="$"
                  placeholder="0"
                />

                <FormCurrencyInput
                  label="With Max Value (10,000,000)"
                  currency="IDR"
                  max={10000000}
                  placeholder="Max 10,000,000"
                />

                <FormCurrencyInput
                  label="Allow Negative Values"
                  currency="IDR"
                  allowNegative
                  placeholder="Enter negative values allowed"
                />

                <FormCurrencyInput
                  label="Euro Currency"
                  currency="EUR"
                  decimals={2}
                  placeholder="0.00"
                />

                <FormCurrencyInput
                  label="Japanese Yen (No Decimals)"
                  currency="JPY"
                  decimals={0}
                  placeholder="0"
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Currency Input with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormCurrencyInputField
                    control={form.control}
                    name="price"
                    label="Product Price"
                    description="Enter the product price"
                    required
                    currency="IDR"
                    placeholder="0"
                  />

                  <FormCurrencyInputField
                    control={form.control}
                    name="budget"
                    label="Monthly Budget"
                    description="Your monthly budget"
                    currency="IDR"
                    decimals={0}
                    placeholder="0"
                  />

                  <FormCurrencyInputField
                    control={form.control}
                    name="salary"
                    label="Salary (USD)"
                    description="Your monthly salary in USD"
                    currency="USD"
                    decimals={2}
                    placeholder="0.00"
                  />

                  <div className="flex gap-2 pt-4">
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

              {/* Summary */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Form Values</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-mono">
                      {form.watch("price")?.toLocaleString("id-ID") || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="font-mono">
                      {form.watch("budget")?.toLocaleString("id-ID") || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salary (USD):</span>
                    <span className="font-mono">
                      {form.watch("salary")?.toLocaleString("en-US") || 0}
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
