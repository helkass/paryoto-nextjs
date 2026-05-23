// app/button-loader-demo/page.tsx
"use client";

import * as React from "react";
import { ButtonLoader } from "@/components/button-loader/button-loader";
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
  Save,
  Mail,
  Trash2,
  Download,
  Upload,
  Send,
  RefreshCw,
  Loader2,
} from "lucide-react";

// Simulate async action
const simulateAsyncAction = async (
  actionName: string,
  duration: number = 2000
) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
  toast.success(`${actionName} completed successfully!`);
};

export default function ButtonLoaderDemoPage() {
  const [loadingStates, setLoadingStates] = React.useState({
    save: false,
    delete: false,
    custom: false,
    icon: false,
  });

  const handleAsyncClick = async (
    action: keyof typeof loadingStates,
    actionName: string
  ) => {
    setLoadingStates((prev) => ({ ...prev, [action]: true }));
    await simulateAsyncAction(actionName, 2000);
    setLoadingStates((prev) => ({ ...prev, [action]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Button Loader Components</h1>
          <p className="text-muted-foreground mt-1">
            Buttons with loading states, multiple variants, and positions
          </p>
        </div>

        <Tabs defaultValue="variants">
          <TabsList className="mb-6">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="positions">Loader Positions</TabsTrigger>
            <TabsTrigger value="sizes">Sizes & Types</TabsTrigger>
            <TabsTrigger value="async">Async Actions</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Variants */}
          <TabsContent value="variants">
            <DashboardCard title="Button Variants">
              <div className="flex flex-wrap gap-4">
                <ButtonLoader variant="default" loading>
                  Default
                </ButtonLoader>
                <ButtonLoader variant="secondary" loading>
                  Secondary
                </ButtonLoader>
                <ButtonLoader variant="destructive" loading>
                  Destructive
                </ButtonLoader>
                <ButtonLoader variant="outline" loading>
                  Outline
                </ButtonLoader>
                <ButtonLoader variant="ghost" loading>
                  Ghost
                </ButtonLoader>
                <ButtonLoader variant="link" loading>
                  Link
                </ButtonLoader>
              </div>
            </DashboardCard>

            <DashboardCard title="Button Variants (With Text)">
              <div className="flex flex-wrap gap-4">
                <ButtonLoader variant="default" loading loaderText="Saving...">
                  Save
                </ButtonLoader>
                <ButtonLoader
                  variant="secondary"
                  loading
                  loaderText="Loading..."
                >
                  Load
                </ButtonLoader>
                <ButtonLoader
                  variant="destructive"
                  loading
                  loaderText="Deleting..."
                >
                  Delete
                </ButtonLoader>
                <ButtonLoader
                  variant="outline"
                  loading
                  loaderText="Processing..."
                >
                  Process
                </ButtonLoader>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Loader Positions */}
          <TabsContent value="positions">
            <DashboardCard title="Loader Positions">
              <div className="grid gap-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium">Left (Default)</h3>
                  <ButtonLoader loading loaderPosition="left">
                    Save Changes
                  </ButtonLoader>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium">Right</h3>
                  <ButtonLoader loading loaderPosition="right">
                    Save Changes
                  </ButtonLoader>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium">Replace Text</h3>
                  <ButtonLoader
                    loading
                    loaderPosition="replace"
                    loaderText="Saving..."
                  >
                    Save Changes
                  </ButtonLoader>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Sizes & Types */}
          <TabsContent value="sizes">
            <DashboardCard title="Button Sizes">
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLoader size="sm" loading>
                  Small
                </ButtonLoader>
                <ButtonLoader size="default" loading>
                  Default
                </ButtonLoader>
                <ButtonLoader size="lg" loading>
                  Large
                </ButtonLoader>
                <ButtonLoader size="icon" loading>
                  <Save />
                </ButtonLoader>
              </div>
            </DashboardCard>

            <DashboardCard title="Spinner Types">
              <div className="flex flex-wrap gap-4">
                <ButtonLoader loading spinnerType="border">
                  Border
                </ButtonLoader>
                <ButtonLoader loading spinnerType="grow">
                  Grow
                </ButtonLoader>
                <ButtonLoader loading spinnerType="dots">
                  Dots
                </ButtonLoader>
              </div>
            </DashboardCard>

            <DashboardCard title="Loader Sizes">
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLoader loading loaderSize="sm">
                  Small
                </ButtonLoader>
                <ButtonLoader loading loaderSize="md">
                  Medium
                </ButtonLoader>
                <ButtonLoader loading loaderSize="lg">
                  Large
                </ButtonLoader>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Async Actions */}
          <TabsContent value="async">
            <DashboardCard title="Async Actions">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Save Action</h3>
                  <ButtonLoader
                    loading={loadingStates.save}
                    onClick={() => handleAsyncClick("save", "Save")}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Data
                  </ButtonLoader>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Delete Action</h3>
                  <ButtonLoader
                    variant="destructive"
                    loading={loadingStates.delete}
                    onClick={() => handleAsyncClick("delete", "Delete")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Item
                  </ButtonLoader>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Custom Text</h3>
                  <ButtonLoader
                    loading={loadingStates.custom}
                    loaderPosition="replace"
                    loaderText="Processing..."
                    onClick={() => handleAsyncClick("custom", "Custom action")}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Process Payment
                  </ButtonLoader>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">With Icon</h3>
                  <ButtonLoader
                    loading={loadingStates.icon}
                    icon={<Mail className="h-4 w-4" />}
                    iconPosition="right"
                    onClick={() => handleAsyncClick("icon", "Send email")}
                  >
                    Send Email
                  </ButtonLoader>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Form Actions">
                <div className="space-y-4">
                  <ButtonLoader
                    fullWidth
                    loading
                    loaderPosition="replace"
                    loaderText="Logging in..."
                  >
                    Sign In
                  </ButtonLoader>
                  <ButtonLoader variant="outline" fullWidth>
                    Create Account
                  </ButtonLoader>
                </div>
              </DashboardCard>

              <DashboardCard title="Icon Buttons">
                <div className="flex flex-wrap gap-4">
                  <ButtonLoader size="icon" loading>
                    <RefreshCw />
                  </ButtonLoader>
                  <ButtonLoader size="icon" variant="outline" loading>
                    <Download />
                  </ButtonLoader>
                  <ButtonLoader size="icon" variant="secondary" loading>
                    <Upload />
                  </ButtonLoader>
                </div>
              </DashboardCard>

              <DashboardCard title="Full Width Buttons">
                <div className="space-y-3">
                  <ButtonLoader
                    fullWidth
                    loading
                    loaderPosition="replace"
                    loaderText="Saving..."
                  >
                    Save Settings
                  </ButtonLoader>
                  <ButtonLoader fullWidth variant="outline">
                    Cancel
                  </ButtonLoader>
                </div>
              </DashboardCard>

              <DashboardCard title="Disabled While Loading">
                <div className="space-y-3">
                  <ButtonLoader
                    loading={loadingStates.save}
                    preventMultipleClicks
                    onClick={() => handleAsyncClick("save", "Save")}
                  >
                    Click me (disabled while loading)
                  </ButtonLoader>
                  <p className="text-xs text-muted-foreground">
                    Button is disabled while loading to prevent multiple
                    submissions
                  </p>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>ButtonLoader Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Variants</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>default</strong> - Primary button style
                  </li>
                  <li>
                    • <strong>secondary</strong> - Secondary button style
                  </li>
                  <li>
                    • <strong>destructive</strong> - Danger/delete actions
                  </li>
                  <li>
                    • <strong>outline</strong> - Outlined border style
                  </li>
                  <li>
                    • <strong>ghost</strong> - Ghost/transparent style
                  </li>
                  <li>
                    • <strong>link</strong> - Link style
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Loader Positions</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>left</strong> - Spinner on the left side
                  </li>
                  <li>
                    • <strong>right</strong> - Spinner on the right side
                  </li>
                  <li>
                    • <strong>replace</strong> - Replace button text with
                    spinner
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Spinner Types</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>border</strong> - Rotating border spinner
                  </li>
                  <li>
                    • <strong>grow</strong> - Pulsing grow animation
                  </li>
                  <li>
                    • <strong>dots</strong> - Animated bouncing dots
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sizes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>sm</strong> - Small button
                  </li>
                  <li>
                    • <strong>default</strong> - Default size
                  </li>
                  <li>
                    • <strong>lg</strong> - Large button
                  </li>
                  <li>
                    • <strong>icon</strong> - Icon-only button
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
