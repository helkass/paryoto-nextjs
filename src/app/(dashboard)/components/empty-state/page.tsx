// app/empty-state-demo/page.tsx
"use client";

import * as React from "react";
import { EmptyState } from "@/components/empty-state/empty-state";
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
  Inbox,
  Search,
  FolderOpen,
  AlertCircle,
  WifiOff,
  Plus,
  RefreshCw,
  Upload,
  Settings,
  Mail,
  Users,
  ShoppingCart,
  Package,
} from "lucide-react";

export default function EmptyStateDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Empty State Components</h1>
          <p className="text-muted-foreground mt-1">
            Beautiful empty states for no data, search results, and errors
          </p>
        </div>

        <Tabs defaultValue="variants">
          <TabsList className="mb-6">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6 md:grid-cols-3">
              <DashboardCard title="Default Variant">
                <EmptyState
                  title="No data available"
                  description="There are no items to display at this time."
                  icon={<FolderOpen className="h-4 w-4" />}
                  action={{
                    label: "Add Item",
                    onClick: () => toast.success("Add item clicked"),
                    icon: <Plus className="h-4 w-4" />,
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Card Variant">
                <EmptyState
                  title="No results found"
                  description="Try adjusting your search or filter to find what you're looking for."
                  icon={<Search className="h-4 w-4" />}
                  variant="card"
                  action={{
                    label: "Clear Filters",
                    onClick: () => toast.success("Filters cleared"),
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Minimal Variant">
                <EmptyState
                  title="Empty inbox"
                  description="When you receive messages, they will appear here."
                  icon={<Inbox className="h-4 w-4" />}
                  variant="minimal"
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Sizes */}
          <TabsContent value="sizes">
            <div className="grid gap-6 md:grid-cols-3">
              <DashboardCard title="Small Size">
                <EmptyState
                  title="Small empty state"
                  description="Compact size for side panels"
                  icon={<Package className="h-4 w-4" />}
                  size="sm"
                  action={{
                    label: "Create",
                    onClick: () => toast.success("Created"),
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Medium Size (Default)">
                <EmptyState
                  title="Medium empty state"
                  description="Standard size for main content areas"
                  icon={<FolderOpen className="h-4 w-4" />}
                  size="md"
                  action={{
                    label: "Get Started",
                    onClick: () => toast.success("Started"),
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Large Size">
                <EmptyState
                  title="Large empty state"
                  description="Prominent size for landing pages"
                  icon={<FolderOpen className="h-4 w-4" />}
                  size="lg"
                  action={{
                    label: "Learn More",
                    onClick: () => toast.success("Learn more clicked"),
                  }}
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Scenarios */}
          <TabsContent value="scenarios">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="No Search Results">
                <EmptyState
                  title="No results found"
                  description="We couldn't find any matches for your search."
                  icon={<Search className="h-4 w-4" />}
                  showIllustration
                  action={{
                    label: "Clear Search",
                    onClick: () => toast.success("Search cleared"),
                  }}
                  secondaryAction={{
                    label: "Advanced Search",
                    onClick: () => toast.success("Advanced search opened"),
                  }}
                />
              </DashboardCard>

              <DashboardCard title="No Data">
                <EmptyState
                  title="No data yet"
                  description="Start by adding your first item."
                  icon={<FolderOpen className="h-4 w-4" />}
                  action={{
                    label: "Add Data",
                    onClick: () => toast.success("Add data clicked"),
                    icon: <Plus className="h-4 w-4" />,
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Error State">
                <EmptyState
                  title="Something went wrong"
                  description="Failed to load data. Please try again."
                  icon={<AlertCircle className="h-4 w-4" />}
                  action={{
                    label: "Retry",
                    onClick: () => toast.success("Retrying..."),
                    icon: <RefreshCw className="h-4 w-4" />,
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Network Error">
                <EmptyState
                  title="No Internet Connection"
                  description="Please check your network settings and try again."
                  icon={<WifiOff className="h-4 w-4" />}
                  action={{
                    label: "Retry Connection",
                    onClick: () => toast.success("Retrying connection..."),
                  }}
                />
              </DashboardCard>

              <DashboardCard title="Empty Cart">
                <EmptyState
                  title="Your cart is empty"
                  description="Add items to your cart to continue shopping."
                  icon={<ShoppingCart className="h-4 w-4" />}
                  action={{
                    label: "Start Shopping",
                    onClick: () => toast.success("Navigating to shop"),
                  }}
                />
              </DashboardCard>

              <DashboardCard title="No Notifications">
                <EmptyState
                  title="No notifications"
                  description="When you receive notifications, they will appear here."
                  icon={<Mail className="h-4 w-4" />}
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Custom */}
          <TabsContent value="custom">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="With Custom Icon & Two Actions">
                <EmptyState
                  title="Team Members"
                  description="Invite your team members to collaborate"
                  icon={<Users className="h-4 w-4" />}
                  action={{
                    label: "Invite Member",
                    onClick: () => toast.success("Invite dialog opened"),
                    icon: <Plus className="h-4 w-4" />,
                  }}
                  secondaryAction={{
                    label: "Import from CSV",
                    onClick: () => toast.success("Import dialog opened"),
                    icon: <Upload className="h-4 w-4" />,
                  }}
                />
              </DashboardCard>

              <DashboardCard title="With Illustration">
                <EmptyState
                  title="No items found"
                  description="Try creating a new item to get started"
                  showIllustration
                  action={{
                    label: "Create New",
                    onClick: () => toast.success("Create new clicked"),
                    icon: <Plus className="h-4 w-4" />,
                  }}
                />
              </DashboardCard>

              <DashboardCard title="With Custom Content">
                <EmptyState
                  title="Custom Setup Required"
                  description="Complete the setup to start using this feature"
                  icon={<Settings className="h-4 w-4" />}
                  action={{
                    label: "Open Settings",
                    onClick: () => toast.success("Settings opened"),
                  }}
                >
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Quick tip: Configure your preferences first</p>
                  </div>
                </EmptyState>
              </DashboardCard>

              <DashboardCard title="With Ghost Action">
                <EmptyState
                  title="No favorites yet"
                  description="Save your favorite items for quick access"
                  icon={<Package className="h-4 w-4" />}
                  action={{
                    label: "Browse Items",
                    onClick: () => toast.success("Browse clicked"),
                    variant: "ghost",
                  }}
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>EmptyState Features</CardTitle>
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
                    • <strong>default</strong> - Transparent background
                  </li>
                  <li>
                    • <strong>card</strong> - Card style with border
                  </li>
                  <li>
                    • <strong>minimal</strong> - Compact without borders
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sizes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>sm</strong> - Small (compact)
                  </li>
                  <li>
                    • <strong>md</strong> - Medium (default)
                  </li>
                  <li>
                    • <strong>lg</strong> - Large (prominent)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Actions</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>action</strong> - Primary action button
                  </li>
                  <li>
                    • <strong>secondaryAction</strong> - Secondary action button
                  </li>
                  <li>
                    • <strong>children</strong> - Custom content
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Display</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>icon</strong> - Custom icon component
                  </li>
                  <li>
                    • <strong>showIllustration</strong> - Built-in illustrations
                  </li>
                  <li>
                    • <strong>title/description</strong> - Text content
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
