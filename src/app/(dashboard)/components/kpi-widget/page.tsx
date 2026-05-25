// app/kpi-widget-demo/page.tsx
"use client";

import * as React from "react";
import { KpiWidget } from "@/components/kpi-widget/kpi-widget";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";
import { toast } from "sonner";

// Sample sparkline data
const revenueData = [45, 52, 48, 60, 55, 70, 65, 80, 75, 90, 85, 95];
const userData = [120, 135, 130, 150, 145, 160, 155, 170, 165, 180, 175, 190];
const orderData = [80, 85, 82, 95, 90, 105, 100, 115, 110, 125, 120, 130];
const conversionData = [
  2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.6, 2.9, 2.8, 3.1, 3.0, 3.2,
];

export default function KpiWidgetDemoPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const handleRefresh = () => {
    toast.success("Data refreshed");
  };

  const handleInfo = () => {
    toast.info("More information about this metric");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">KPI Widget Components</h1>
          <p className="text-muted-foreground mt-1">
            Key performance indicators with sparklines and trends
          </p>
        </div>

        <Tabs defaultValue="default">
          <TabsList className="mb-6">
            <TabsTrigger value="default">Default Widgets</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Default Widgets */}
          <TabsContent value="default">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiWidget
                title="Revenue"
                value={125000}
                previousValue={100000}
                sparklineData={revenueData}
                sparklineVariant="area"
                trend="up"
                trendValue={25}
                trendLabel="vs last month"
                valueFormat={formatCurrency}
                icon={<DollarSign className="h-4 w-4" />}
                onRefresh={handleRefresh}
                onInfo={handleInfo}
                tooltip="Total revenue including all sources"
              />

              <KpiWidget
                title="Active Users"
                value={2350}
                previousValue={2100}
                sparklineData={userData}
                sparklineVariant="line"
                trend="up"
                trendValue={12}
                trendLabel="vs last month"
                valueFormat={formatNumber}
                icon={<Users className="h-4 w-4" />}
                variant="primary"
              />

              <KpiWidget
                title="Total Orders"
                value={1423}
                previousValue={1350}
                sparklineData={orderData}
                sparklineVariant="bar"
                trend="up"
                trendValue={5.4}
                trendLabel="vs last month"
                valueFormat={formatNumber}
                icon={<ShoppingCart className="h-4 w-4" />}
                variant="success"
              />

              <KpiWidget
                title="Conversion Rate"
                value={3.24}
                previousValue={2.98}
                sparklineData={conversionData}
                sparklineVariant="area"
                trend="up"
                trendValue={8.7}
                trendLabel="vs last month"
                valueFormat={formatPercentage}
                icon={<TrendingUp className="h-4 w-4" />}
                variant="info"
                suffix="%"
              />
            </div>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <KpiWidget
                title="Default"
                value={1000}
                sparklineData={revenueData}
                icon={<Activity className="h-4 w-4" />}
                variant="default"
              />

              <KpiWidget
                title="Primary"
                value={1000}
                sparklineData={revenueData}
                icon={<Activity className="h-4 w-4" />}
                variant="primary"
              />

              <KpiWidget
                title="Success"
                value={1000}
                sparklineData={revenueData}
                icon={<Activity className="h-4 w-4" />}
                variant="success"
              />

              <KpiWidget
                title="Warning"
                value={1000}
                sparklineData={revenueData}
                icon={<Activity className="h-4 w-4" />}
                variant="warning"
              />

              <KpiWidget
                title="Danger"
                value={1000}
                sparklineData={revenueData}
                icon={<Activity className="h-4 w-4" />}
                variant="danger"
              />

              <KpiWidget
                title="Info"
                value={1000}
                sparklineData={revenueData}
                icon={<Activity className="h-4 w-4" />}
                variant="info"
              />
            </div>
          </TabsContent>

          {/* Sizes */}
          <TabsContent value="sizes">
            <div className="grid gap-4 md:grid-cols-3">
              <KpiWidget
                title="Small Widget"
                value={1000}
                sparklineData={revenueData}
                size="sm"
                icon={<Activity className="h-4 w-4" />}
              />

              <KpiWidget
                title="Medium Widget"
                value={1000}
                sparklineData={revenueData}
                size="md"
                icon={<Activity className="h-4 w-4" />}
              />

              <KpiWidget
                title="Large Widget"
                value={1000}
                sparklineData={revenueData}
                size="lg"
                icon={<Activity className="h-4 w-4" />}
              />
            </div>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-4 md:grid-cols-2">
              <KpiWidget
                title="With Target"
                value={75}
                target={100}
                showTarget
                suffix="%"
                icon={<Target className="h-4 w-4" />}
              />

              <KpiWidget
                title="With Comparison"
                value={125000}
                previousValue={100000}
                showComparison
                showChange
                valueFormat={formatCurrency}
                icon={<DollarSign className="h-4 w-4" />}
              />

              <KpiWidget
                title="Custom Colors"
                value={1000}
                sparklineData={revenueData}
                sparklineColor="#8B5CF6"
                icon={<Activity className="h-4 w-4" />}
                customColors={{
                  background: "#8B5CF6",
                  text: "#FFFFFF",
                  accent: "#FFFFFF",
                }}
              />

              <KpiWidget
                title="No Sparkline"
                value={1000}
                showSparkline={false}
                icon={<Activity className="h-4 w-4" />}
              />

              <KpiWidget
                title="No Trend"
                value={1000}
                showTrend={false}
                icon={<Activity className="h-4 w-4" />}
              />

              <KpiWidget
                title="Clickable"
                value={1000}
                clickable
                onClick={() => toast.info("Widget clicked!")}
                icon={<Activity className="h-4 w-4" />}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Dashboard Layout Example */}
        <DashboardCard title="Dashboard Layout Example">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiWidget
              title="Revenue"
              value={125000}
              previousValue={100000}
              sparklineData={revenueData}
              valueFormat={formatCurrency}
              icon={<DollarSign className="h-4 w-4" />}
              variant="primary"
            />
            <KpiWidget
              title="Users"
              value={2350}
              previousValue={2100}
              sparklineData={userData}
              valueFormat={formatNumber}
              icon={<Users className="h-4 w-4" />}
              variant="success"
            />
            <KpiWidget
              title="Orders"
              value={1423}
              previousValue={1350}
              sparklineData={orderData}
              valueFormat={formatNumber}
              icon={<ShoppingCart className="h-4 w-4" />}
              variant="info"
            />
            <KpiWidget
              title="Conversion"
              value={3.24}
              previousValue={2.98}
              sparklineData={conversionData}
              valueFormat={formatPercentage}
              icon={<TrendingUp className="h-4 w-4" />}
              variant="warning"
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
