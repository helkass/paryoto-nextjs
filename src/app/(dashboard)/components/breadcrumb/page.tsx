// app/breadcrumb-demo/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Home,
  Users,
  Settings,
  Activity,
  Star,
  ChevronRight,
} from "lucide-react";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

// Custom breadcrumb with context
function DynamicBreadcrumbDemo() {
  const { items, push, pop, reset } = useBreadcrumb();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => push({ label: "Custom Page", href: "/custom" })}
        >
          Add Custom Page
        </Button>
        <Button size="sm" variant="outline" onClick={pop}>
          Remove Last
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground mb-2">
          Current Breadcrumb Items:
        </p>
        <div className="space-y-1">
          {items.map((item, idx) => (
            <div key={idx} className="text-sm">
              {idx + 1}. {item.label} {item.href && `(${item.href})`}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No custom items added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Nested routes demo component
function NestedRoutesDemo() {
  const router = useRouter();

  const routes = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/users", label: "Users" },
    { path: "/dashboard/users/profile", label: "Profile" },
    { path: "/dashboard/settings", label: "Settings" },
    { path: "/dashboard/settings/account", label: "Account" },
    { path: "/dashboard/analytics", label: "Analytics" },
    { path: "/dashboard/analytics/reports", label: "Reports" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {routes.map((route) => (
          <Button
            key={route.path}
            size="sm"
            variant="outline"
            onClick={() => router.push(route.path)}
          >
            {route.label}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">
          Current path will be reflected in the breadcrumb above
        </p>
      </div>
    </div>
  );
}

export default function BreadcrumbDemoPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Breadcrumb at the top */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            showHome
            homeLabel="Home"
            separator={<ChevronRight className="h-4 w-4" />}
            maxItems={5}
            truncateLabels
            customMapping={{
              users: "User Management",
              profile: "User Profile",
              settings: "Configuration",
              account: "Account Settings",
              analytics: "Data Analytics",
              reports: "Reports & Analytics",
            }}
            onItemClick={(item, index) => {
              console.log("Clicked:", item, index);
            }}
          />
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Breadcrumb Components</h1>
          <p className="text-muted-foreground mt-1">
            Dynamic breadcrumb navigation with custom mapping and styling
          </p>
        </div>

        <Tabs defaultValue="dynamic">
          <TabsList className="mb-6">
            <TabsTrigger value="dynamic">Dynamic Breadcrumb</TabsTrigger>
            <TabsTrigger value="custom">Custom Items</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="nested">Nested Routes</TabsTrigger>
          </TabsList>

          {/* Dynamic Breadcrumb */}
          <TabsContent value="dynamic">
            <DashboardCard title="Dynamic Breadcrumb">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Current URL Path</h3>
                  <code className="rounded bg-muted px-3 py-2 text-sm">
                    /
                    {typeof window !== "undefined"
                      ? window.location.pathname.slice(1)
                      : "..."}
                  </code>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Breadcrumb automatically generates from the current URL path
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    With Different Separator
                  </h3>
                  <Breadcrumb
                    separator={<ChevronRight className="h-4 w-4" />}
                    className="mb-4"
                  />
                  <Breadcrumb separator={<span className="text-lg">→</span>} />
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Custom Items */}
          <TabsContent value="custom">
            <DashboardCard title="Custom Breadcrumb Items">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Static Items</h3>
                  <Breadcrumb
                    items={[
                      {
                        label: "Home",
                        href: "/",
                        icon: <Home className="h-4 w-4" />,
                      },
                      { label: "Products", href: "/products" },
                      { label: "Electronics", href: "/products/electronics" },
                      { label: "Laptops", isCurrent: true },
                    ]}
                    separator={<ChevronRight className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">With Icons</h3>
                  <Breadcrumb
                    items={[
                      {
                        label: "Home",
                        href: "/",
                        icon: <Home className="h-4 w-4" />,
                      },
                      {
                        label: "Users",
                        href: "/users",
                        icon: <Users className="h-4 w-4" />,
                      },
                      {
                        label: "Settings",
                        href: "/settings",
                        icon: <Settings className="h-4 w-4" />,
                      },
                      {
                        label: "Profile",
                        icon: <Activity className="h-4 w-4" />,
                        isCurrent: true,
                      },
                    ]}
                    separator={<ChevronRight className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    With Max Items (3)
                  </h3>
                  <Breadcrumb
                    items={[
                      { label: "Home", href: "/" },
                      { label: "Category 1", href: "/category-1" },
                      { label: "Category 2", href: "/category-2" },
                      { label: "Category 3", href: "/category-3" },
                      { label: "Category 4", href: "/category-4" },
                      { label: "Current Page", isCurrent: true },
                    ]}
                    maxItems={3}
                    separator={<ChevronRight className="h-4 w-4" />}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Middle items are truncated with "..."
                  </p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6">
              <DashboardCard title="Breadcrumb Variants">
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Default</h3>
                    <Breadcrumb
                      items={[
                        { label: "Home", href: "/" },
                        { label: "Products", href: "/products" },
                        { label: "Details", isCurrent: true },
                      ]}
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      With Custom Separator (•)
                    </h3>
                    <Breadcrumb
                      items={[
                        { label: "Home", href: "/" },
                        { label: "Products", href: "/products" },
                        { label: "Details", isCurrent: true },
                      ]}
                      separator={<span className="text-lg">•</span>}
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      With Arrow Separator
                    </h3>
                    <Breadcrumb
                      items={[
                        { label: "Home", href: "/" },
                        { label: "Products", href: "/products" },
                        { label: "Details", isCurrent: true },
                      ]}
                      separator={<ChevronRight className="h-4 w-4" />}
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Without Home</h3>
                    <Breadcrumb
                      items={[
                        { label: "Products", href: "/products" },
                        { label: "Electronics", href: "/products/electronics" },
                        { label: "Laptops", isCurrent: true },
                      ]}
                      showHome={false}
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      Custom Home Icon
                    </h3>
                    <Breadcrumb
                      homeIcon={<Star className="h-4 w-4" />}
                      homeLabel="Dashboard"
                    />
                  </div>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Nested Routes */}
          <TabsContent value="nested">
            <DashboardCard title="Nested Routes Demo">
              <div className="space-y-6">
                <NestedRoutesDemo />

                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="text-sm font-medium mb-2">
                    Custom Route Mapping
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• "users" → "User Management"</p>
                    <p>• "profile" → "User Profile"</p>
                    <p>• "settings" → "Configuration"</p>
                    <p>• "account" → "Account Settings"</p>
                    <p>• "analytics" → "Data Analytics"</p>
                    <p>• "reports" → "Reports & Analytics"</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Breadcrumb</CardTitle>
              <CardDescription>
                Automatically generates from URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The breadcrumb automatically parses the current URL path and
                generates navigation items. It supports custom label mapping for
                specific path segments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Breadcrumb</CardTitle>
              <CardDescription>Custom static breadcrumb items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You can also provide static breadcrumb items manually using the
                items prop. This is useful for pages with complex navigation
                structures.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Breadcrumb Provider Demo */}
      <div className="container mx-auto p-6 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Breadcrumb Provider (Context API)</CardTitle>
            <CardDescription>
              Programmatically control breadcrumb items using context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreadcrumbProvider>
              <div className="space-y-4">
                <Breadcrumb showHome />
                <DynamicBreadcrumbDemo />
              </div>
            </BreadcrumbProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
