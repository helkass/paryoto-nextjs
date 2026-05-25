// app/bullet-chart-demo/page.tsx
"use client";

import * as React from "react";
import { BulletChart } from "@/components/bullet-chart/bullet-chart";
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

const salesData = {
  title: "Monthly Sales",
  value: 850000,
  target: 1000000,
  min: 0,
  max: 1200000,
  ranges: {
    poor: 400000,
    average: 700000,
    good: 900000,
    excellent: 1000000,
  },
  metadata: { region: "Asia Pacific", quarter: "Q4" },
};

const revenueData = {
  title: "Annual Revenue",
  value: 45.2,
  target: 50,
  min: 0,
  max: 60,
  ranges: {
    poor: 20,
    average: 35,
    good: 45,
    excellent: 50,
  },
  metadata: { currency: "USD", unit: "millions" },
};

const satisfactionData = {
  title: "Customer Satisfaction",
  value: 88,
  target: 85,
  min: 0,
  max: 100,
  ranges: {
    poor: 50,
    average: 70,
    good: 80,
    excellent: 90,
  },
};

const performanceData = [
  { title: "Sales Target", value: 78, target: 100, metadata: { qty: "units" } },
  { title: "Profit Margin", value: 24, target: 25, metadata: { pct: "%" } },
  { title: "Market Share", value: 32, target: 30, metadata: { pct: "%" } },
  { title: "User Growth", value: 18, target: 20, metadata: { pct: "%" } },
];

export default function BulletChartDemoPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bullet Chart Components</h1>
          <p className="text-muted-foreground mt-1">
            Performance vs target visualization
          </p>
        </div>

        <Tabs defaultValue="horizontal">
          <TabsList className="mb-6">
            <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
            <TabsTrigger value="vertical">Vertical</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="colors">Color Schemes</TabsTrigger>
          </TabsList>

          {/* Horizontal */}
          <TabsContent value="horizontal">
            <div className="grid gap-6">
              <DashboardCard title="Sales Performance">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={100}
                  orientation="horizontal"
                  showValue
                  showTarget
                  showRanges
                  showTitle
                  showTooltip
                  showComparison
                  colorScheme="blue"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Revenue Target">
                <BulletChart
                  data={revenueData}
                  width={600}
                  height={100}
                  orientation="horizontal"
                  showValue
                  showTarget
                  showRanges
                  showTitle
                  showTooltip
                  showComparison
                  colorScheme="green"
                  valueFormat={(val) => `$${val}M`}
                />
              </DashboardCard>

              <DashboardCard title="Customer Satisfaction">
                <BulletChart
                  data={satisfactionData}
                  width={600}
                  height={100}
                  orientation="horizontal"
                  showValue
                  showTarget
                  showRanges
                  showTitle
                  showTooltip
                  showComparison
                  colorScheme="purple"
                  valueFormat={formatPercentage}
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Vertical */}
          <TabsContent value="vertical">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Sales (Vertical)">
                <BulletChart
                  data={salesData}
                  width={300}
                  height={400}
                  orientation="vertical"
                  showValue
                  showTarget
                  showRanges
                  showTitle
                  showTooltip
                  showComparison
                  colorScheme="blue"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Revenue (Vertical)">
                <BulletChart
                  data={revenueData}
                  width={300}
                  height={400}
                  orientation="vertical"
                  showValue
                  showTarget
                  showRanges
                  showTitle
                  showTooltip
                  showComparison
                  colorScheme="green"
                  valueFormat={(val) => `$${val}M`}
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Grid View */}
          <TabsContent value="grid">
            <DashboardCard title="KPI Dashboard">
              <div className="grid gap-6 md:grid-cols-2">
                {performanceData.map((item) => (
                  <BulletChart
                    key={item.title}
                    data={{
                      title: item.title,
                      value: item.value,
                      target: item.target,
                      min: 0,
                      max: 100,
                      metadata: item.metadata,
                    }}
                    width={350}
                    height={80}
                    orientation="horizontal"
                    showValue
                    showTarget
                    showRanges
                    showTitle
                    showComparison
                    colorScheme="default"
                    valueFormat={formatNumber}
                  />
                ))}
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Color Schemes */}
          <TabsContent value="colors">
            <div className="grid gap-6">
              <DashboardCard title="Default Theme">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={80}
                  orientation="horizontal"
                  colorScheme="default"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Blue Theme">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={80}
                  orientation="horizontal"
                  colorScheme="blue"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Green Theme">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={80}
                  orientation="horizontal"
                  colorScheme="green"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Purple Theme">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={80}
                  orientation="horizontal"
                  colorScheme="purple"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Orange Theme">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={80}
                  orientation="horizontal"
                  colorScheme="orange"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Red Theme">
                <BulletChart
                  data={salesData}
                  width={600}
                  height={80}
                  orientation="horizontal"
                  colorScheme="red"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>BulletChart Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Orientation</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>horizontal</strong> - Left to right
                  </li>
                  <li>
                    • <strong>vertical</strong> - Bottom to top
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color Schemes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default, blue, green, purple, orange, red</li>
                  <li>• Custom colors via customColors prop</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Interactive tooltips</li>
                  <li>• Achievement status</li>
                  <li>• Custom range thresholds</li>
                  <li>• Smooth animations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
