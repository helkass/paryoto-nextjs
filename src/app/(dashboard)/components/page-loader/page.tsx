// app/page-loader-demo/page.tsx
"use client";

import * as React from "react";
import { PageLoader } from "@/components/page-loader/page-loader";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function PageLoaderDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInlineLoading, setIsInlineLoading] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);

  const simulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Content loaded successfully!");
    }, 3000);
  };

  const simulateProgressLoad = () => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          toast.success("Progress completed!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const simulateInlineLoad = () => {
    setIsInlineLoading(true);
    setTimeout(() => {
      setIsInlineLoading(false);
      toast.success("Inline content loaded!");
    }, 2000);
  };

  const simulateSkeletonLoad = () => {
    setIsSkeletonLoading(true);
    setTimeout(() => {
      setIsSkeletonLoading(false);
      toast.success("Skeleton loading completed!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Page Loader Components</h1>
          <p className="text-muted-foreground mt-1">
            Full page loaders with multiple variants and animations
          </p>
        </div>

        <Tabs defaultValue="spinner">
          <TabsList className="mb-6">
            <TabsTrigger value="spinner">Spinner Loader</TabsTrigger>
            <TabsTrigger value="progress">Progress Loader</TabsTrigger>
            <TabsTrigger value="skeleton">Skeleton Loader</TabsTrigger>
            <TabsTrigger value="inline">Inline Loader</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Spinner Loader */}
          <TabsContent value="spinner">
            <PageLoader
              loading={isLoading}
              variant="spinner"
              text="Loading content..."
              subtext="Please wait"
            >
              <DashboardCard title="Spinner Loader Demo">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Click the button below to simulate a 3-second load with a
                    spinner loader.
                  </p>
                  <Button onClick={simulateLoad}>Simulate Load</Button>
                </div>
              </DashboardCard>
            </PageLoader>
          </TabsContent>

          {/* Progress Loader */}
          <TabsContent value="progress">
            <PageLoader
              loading={isLoading}
              variant="progress"
              progress={progress}
              showProgress
              text="Loading..."
            >
              <DashboardCard title="Progress Loader Demo">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Click the button below to simulate a progress loading with
                    percentage.
                  </p>
                  <Button onClick={simulateProgressLoad}>
                    Simulate Progress Load
                  </Button>
                </div>
              </DashboardCard>
            </PageLoader>
          </TabsContent>

          {/* Skeleton Loader */}
          <TabsContent value="skeleton">
            <PageLoader loading={isSkeletonLoading} variant="skeleton">
              <DashboardCard title="Skeleton Loader Demo">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Click the button below to see skeleton loading effect.
                  </p>
                  <Button onClick={simulateSkeletonLoad}>
                    Simulate Skeleton Load
                  </Button>

                  {/* Content that will be shown when not loading */}
                  <div className="mt-6 space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold">Dashboard Stats</h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-muted/30 p-3">
                          <p className="text-2xl font-bold">$45,231</p>
                          <p className="text-sm text-muted-foreground">
                            Revenue
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3">
                          <p className="text-2xl font-bold">2,350</p>
                          <p className="text-sm text-muted-foreground">Users</p>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3">
                          <p className="text-2xl font-bold">1,423</p>
                          <p className="text-sm text-muted-foreground">
                            Orders
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </PageLoader>
          </TabsContent>

          {/* Inline Loader */}
          <TabsContent value="inline">
            <DashboardCard title="Inline Loader Demo">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Inline loader that overlays only the card content, not the
                  whole page.
                </p>
                <Button onClick={simulateInlineLoad}>
                  Simulate Inline Load
                </Button>

                <PageLoader
                  loading={isInlineLoading}
                  variant="spinner"
                  fullScreen={false}
                  text="Updating content..."
                  size="sm"
                >
                  <div className="mt-6 rounded-lg border p-6">
                    <h3 className="font-semibold">Content Panel</h3>
                    <p className="mt-2 text-muted-foreground">
                      This content will be covered by a loading overlay when the
                      button is clicked. The overlay only covers this section,
                      not the entire page.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <div className="h-10 w-20 rounded bg-muted/50" />
                      <div className="h-10 w-20 rounded bg-muted/50" />
                      <div className="h-10 w-20 rounded bg-muted/50" />
                    </div>
                  </div>
                </PageLoader>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-6">
              <DashboardCard title="Loader Sizes">
                <div className="flex flex-wrap items-end gap-8">
                  <div className="text-center">
                    <PageLoader
                      loading
                      variant="spinner"
                      size="sm"
                      fullScreen={false}
                      overlay={false}
                    />
                    <p className="mt-2 text-sm">Small</p>
                  </div>
                  <div className="text-center">
                    <PageLoader
                      loading
                      variant="spinner"
                      size="md"
                      fullScreen={false}
                      overlay={false}
                    />
                    <p className="mt-2 text-sm">Medium</p>
                  </div>
                  <div className="text-center">
                    <PageLoader
                      loading
                      variant="spinner"
                      size="lg"
                      fullScreen={false}
                      overlay={false}
                    />
                    <p className="mt-2 text-sm">Large</p>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard title="Custom Text">
                <PageLoader
                  loading
                  variant="spinner"
                  text="Please wait while we load your data..."
                  subtext="This may take a few seconds"
                  fullScreen={false}
                  overlay={false}
                >
                  <div className="h-32" />
                </PageLoader>
              </DashboardCard>

              <DashboardCard title="No Overlay">
                <PageLoader
                  loading
                  variant="spinner"
                  overlay={false}
                  fullScreen={false}
                >
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      Content behind loader (no overlay)
                    </p>
                  </div>
                </PageLoader>
              </DashboardCard>

              <DashboardCard title="With Blur Effect">
                <PageLoader loading variant="spinner" blur fullScreen={false}>
                  <div className="flex h-32 items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">
                      This content is blurred behind the loader
                    </p>
                  </div>
                </PageLoader>
              </DashboardCard>

              <DashboardCard title="Custom Loader">
                <PageLoader
                  loading
                  variant="custom"
                  customLoader={
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium">
                        Custom Loading Animation
                      </p>
                    </div>
                  }
                  fullScreen={false}
                  overlay={false}
                >
                  <div className="h-32" />
                </PageLoader>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>PageLoader Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Variants</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>spinner</strong> - Rotating spinner animation
                  </li>
                  <li>
                    • <strong>progress</strong> - Progress bar with percentage
                  </li>
                  <li>
                    • <strong>skeleton</strong> - Content skeleton loader
                  </li>
                  <li>
                    • <strong>custom</strong> - Custom loader component
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Options</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>fullScreen</strong> - Full page or inline overlay
                  </li>
                  <li>
                    • <strong>overlay</strong> - Background overlay opacity
                  </li>
                  <li>
                    • <strong>blur</strong> - Backdrop blur effect
                  </li>
                  <li>
                    • <strong>delay</strong> - Delay before showing loader
                  </li>
                  <li>
                    • <strong>minimumDuration</strong> - Minimum display time
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sizes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>sm</strong> - Small (32px)
                  </li>
                  <li>
                    • <strong>md</strong> - Medium (48px)
                  </li>
                  <li>
                    • <strong>lg</strong> - Large (64px)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Callbacks</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>onLoad</strong> - When loader appears
                  </li>
                  <li>
                    • <strong>onComplete</strong> - When loader disappears
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
