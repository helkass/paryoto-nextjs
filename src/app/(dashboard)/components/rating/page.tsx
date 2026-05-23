// app/rating-demo/page.tsx - Bagian Basic yang diperbaiki
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormRatingField } from "@/components/form/form-rating-field";
import { FormRating } from "@/components/rating/form-rating";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import {
  SASS_FEEDBACK_LABELS,
  PRODUCT_FEEDBACK_LABELS,
} from "@/lib/rating-labels";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  productRating: z.number().min(1, "Please provide a rating"),
  serviceRating: z.number().optional(),
  overallRating: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RatingDemoPage() {
  const [productRating, setProductRating] = useState(0);
  const [halfRating, setHalfRating] = useState(3.5);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productRating: 0,
      serviceRating: 0,
      overallRating: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success(`Rating submitted: ${data.productRating} stars`);
  };

  const customFeedback = (value: number, max: number) => {
    if (value === 0) return "";
    if (value <= 2) return "Needs improvement";
    if (value <= 4) return "Pretty good!";
    return "Excellent! Thank you!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rating Components</h1>
          <p className="text-muted-foreground mt-1">
            Star rating with half-star support and feedback
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic">
            <DashboardCard title="Basic Rating">
              <div className="space-y-8">
                <FormRating
                  label="Product Rating"
                  description="Rate this product"
                  value={productRating}
                  onChange={setProductRating}
                  max={5}
                  showValue
                  showFeedback
                />

                <FormRating
                  label="Half-star Rating"
                  description="Click on the left/right side of a star for half rating"
                  value={halfRating}
                  onChange={setHalfRating}
                  max={5}
                  allowHalf
                  showValue
                  showFeedback
                />

                <FormRating
                  label="Read-only Rating"
                  description="This rating is read-only"
                  value={4}
                  readOnly
                  showValue
                />

                <FormRating
                  label="Disabled Rating"
                  value={3}
                  disabled
                  showValue
                />

                <FormRating label="Loading State" loading showValue />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <DashboardCard title="Rating Variants">
              <div className="space-y-8">
                <FormRating
                  label="Heart Icon"
                  description="Heart-shaped rating"
                  icon="heart"
                  value={4}
                  showValue
                />

                <FormRating
                  label="Circle Icon"
                  description="Circle-shaped rating"
                  icon="circle"
                  value={3}
                  showValue
                />

                <FormRating label="Small Size" size="sm" value={4} showValue />

                <FormRating label="Large Size" size="lg" value={4} showValue />

                <FormRating
                  label="Custom Colors"
                  activeColor="#EF4444"
                  inactiveColor="#FCA5A5"
                  hoverColor="#DC2626"
                  value={3}
                  showValue
                />

                <FormRating label="10 Stars" max={10} value={7} showValue />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Rating with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormRatingField
                    control={form.control}
                    name="productRating"
                    label="Product Rating"
                    description="Rate the product quality"
                    required
                    max={5}
                    allowHalf
                    showFeedback
                    feedbackLabels={PRODUCT_FEEDBACK_LABELS}
                  />

                  <FormRatingField
                    control={form.control}
                    name="serviceRating"
                    label="Service Rating"
                    description="Rate the customer service"
                    max={5}
                    showFeedback
                    feedbackLabels={SASS_FEEDBACK_LABELS}
                  />

                  <FormRatingField
                    control={form.control}
                    name="overallRating"
                    label="Overall Experience"
                    description="Your overall rating"
                    max={5}
                    showFeedback
                    customFeedback={customFeedback}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Submit Rating</Button>
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
                <h4 className="text-sm font-medium mb-2">Rating Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">
                      {form.watch("productRating") || 0} / 5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">
                      {form.watch("serviceRating") || 0} / 5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall:</span>
                    <span className="font-medium">
                      {form.watch("overallRating") || 0} / 5
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
