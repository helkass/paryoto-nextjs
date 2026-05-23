// app/banner-demo/page.tsx
"use client";

import * as React from "react";
import { Banner } from "@/components/banner/banner";
import { BannerProvider, useBanner } from "@/contexts/banner-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/cards/dashboard-card";
import { toast } from "sonner";

function BannerDemoContent() {
  const { showBanner, dismissAll } = useBanner();
  const [showLocalBanner, setShowLocalBanner] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Local Banner Example */}
      <DashboardCard title="Local Banner (Component)">
        <div className="space-y-4">
          <Button onClick={() => setShowLocalBanner(true)}>
            Show Local Banner
          </Button>

          {showLocalBanner && (
            <Banner
              message="This is a local banner that appears here"
              variant="info"
              dismissible
              onDismiss={() => setShowLocalBanner(false)}
            />
          )}
        </div>
      </DashboardCard>

      {/* Global Banner Examples */}
      <DashboardCard title="Global Banners (via Context)">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These banners will appear at the top of the page (fixed position)
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              onClick={() =>
                showBanner({
                  message: "This is a default announcement",
                  variant: "default",
                })
              }
            >
              Default Banner
            </Button>
            <Button
              variant="default"
              onClick={() =>
                showBanner({
                  message:
                    "New update available! Version 2.0.0 is ready to install.",
                  title: "Update Available",
                  variant: "info",
                  action: {
                    label: "Update Now",
                    onClick: () => {
                      toast.success("Update started");
                    },
                  },
                })
              }
            >
              Info Banner with Action
            </Button>
            <Button
              variant="default"
              onClick={() =>
                showBanner({
                  message: "Your changes have been saved successfully!",
                  variant: "success",
                  autoClose: true,
                  autoCloseDelay: 3000,
                })
              }
            >
              Success Banner (Auto-close)
            </Button>
            <Button
              variant="default"
              onClick={() =>
                showBanner({
                  message: "Please complete your profile setup to continue.",
                  variant: "warning",
                  action: {
                    label: "Complete Now",
                    onClick: () => {
                      toast.success("Redirecting...");
                    },
                  },
                })
              }
            >
              Warning Banner
            </Button>
            <Button
              variant="default"
              onClick={() =>
                showBanner({
                  message:
                    "Unable to connect to the server. Please check your connection.",
                  variant: "error",
                  action: {
                    label: "Retry",
                    onClick: () => {
                      toast.info("Retrying...");
                    },
                  },
                })
              }
            >
              Error Banner
            </Button>
          </div>
          <Button variant="outline" onClick={dismissAll} className="mt-2">
            Dismiss All Banners
          </Button>
        </div>
      </DashboardCard>

      {/* Demo Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Banner Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Variants:</span>
              <span>default, info, success, warning, error</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Positions:</span>
              <span>top, bottom, fixed-top, fixed-bottom</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-close:</span>
              <span>With configurable delay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actions:</span>
              <span>Custom action buttons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dismissible:</span>
              <span>Optional close button</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Animations:</span>
              <span>Smooth enter/exit animations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Quick snippets for common use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Success notification</p>
              <code className="text-xs bg-muted p-1 rounded">
                {`showBanner({
  message: "Saved!",
  variant: "success",
  autoClose: true
})`}
              </code>
            </div>
            <div>
              <p className="font-medium mb-1">Warning with action</p>
              <code className="text-xs bg-muted p-1 rounded">
                {`showBanner({
  title: "Update",
  message: "New version available",
  variant: "warning"
})`}
              </code>
            </div>
            <div>
              <p className="font-medium mb-1">With title</p>
              <code className="text-xs bg-muted p-1 rounded">
                {`showBanner({
  title: "Update",
  message: "New version available",
  variant: "info"
})`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BannerDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Banner Components</h1>
          <p className="text-muted-foreground mt-1">
            Announcement banners with multiple variants and global management
          </p>
        </div>

        <BannerProvider position="fixed-top" maxBanners={3}>
          <BannerDemoContent />
        </BannerProvider>
      </div>
    </div>
  );
}
