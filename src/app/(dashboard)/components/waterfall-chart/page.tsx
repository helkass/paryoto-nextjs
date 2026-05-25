// app/waterfall-chart-demo/page.tsx
"use client";

import * as React from "react";
import { WaterfallChart } from "@/components/waterfall-chart/waterfall-chart";
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

// Financial data examples
const revenueData = [
  { label: "Starting Revenue", value: 1000000 },
  { label: "New Customers", value: 250000 },
  { label: "Upgrades", value: 150000 },
  { label: "Price Increase", value: 75000 },
  { label: "Churn", value: -120000 },
  { label: "Discounts", value: -50000 },
  { label: "Ending Revenue", value: 1305000, isTotal: true },
];

const profitData = [
  { label: "Gross Profit", value: 500000 },
  { label: "R&D", value: -150000 },
  { label: "Marketing", value: -100000 },
  { label: "Sales", value: -80000 },
  { label: "G&A", value: -70000 },
  { label: "Net Profit", value: 100000, isTotal: true },
];

const cashFlowData = [
  { label: "Operating Cash Flow", value: 300000 },
  { label: "Equipment Purchase", value: -100000 },
  { label: "Investment", value: 50000 },
  { label: "Loan Repayment", value: -50000 },
  { label: "Dividends", value: -30000 },
  { label: "Net Cash Flow", value: 170000, isTotal: true },
];

const monthlyData = [
  { label: "Jan", value: 50000 },
  { label: "Feb", value: 45000 },
  { label: "Mar", value: 55000 },
  { label: "Apr", value: 60000 },
  { label: "May", value: 65000 },
  { label: "Jun", value: 70000 },
  { label: "Jul", value: 75000 },
  { label: "Aug", value: 80000 },
  { label: "Sep", value: 85000 },
  { label: "Oct", value: 90000 },
  { label: "Nov", value: 95000 },
  { label: "Dec", value: 100000 },
  { label: "Total", value: 850000, isTotal: true },
];

export default function WaterfallChartDemoPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Waterfall Chart Components</h1>
          <p className="text-muted-foreground mt-1">
            Financial analysis and bridge visualization
          </p>
        </div>

        <Tabs defaultValue="revenue">
          <TabsList className="mb-6">
            <TabsTrigger value="revenue">Revenue Bridge</TabsTrigger>
            <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          </TabsList>

          {/* Revenue Bridge */}
          <TabsContent value="revenue">
            <DashboardCard title="Revenue Bridge Analysis">
              <WaterfallChart
                data={revenueData}
                width={900}
                height={500}
                showValues
                showLabels
                showConnectors
                showTooltip
                showLegend
                positiveColor="#10B981"
                negativeColor="#EF4444"
                totalColor="#3B82F6"
                valueFormat={formatCurrency}
                title="Revenue Reconciliation"
                description="From starting to ending revenue"
              />
            </DashboardCard>
          </TabsContent>

          {/* Profit Analysis */}
          <TabsContent value="profit">
            <DashboardCard title="Profit & Loss Waterfall">
              <WaterfallChart
                data={profitData}
                width={900}
                height={500}
                showValues
                showLabels
                showConnectors
                showTooltip
                showLegend
                positiveColor="#10B981"
                negativeColor="#EF4444"
                totalColor="#3B82F6"
                valueFormat={formatCurrency}
                title="Profit Bridge"
                description="From gross profit to net profit"
              />
            </DashboardCard>
          </TabsContent>

          {/* Cash Flow */}
          <TabsContent value="cashflow">
            <DashboardCard title="Cash Flow Analysis">
              <WaterfallChart
                data={cashFlowData}
                width={900}
                height={500}
                showValues
                showLabels
                showConnectors
                showTooltip
                showLegend
                positiveColor="#10B981"
                negativeColor="#EF4444"
                totalColor="#3B82F6"
                valueFormat={formatCurrency}
                title="Cash Flow Bridge"
                description="Changes in cash position"
              />
            </DashboardCard>
          </TabsContent>

          {/* Monthly Breakdown */}
          <TabsContent value="monthly">
            <DashboardCard title="Monthly Revenue Breakdown">
              <WaterfallChart
                data={monthlyData}
                width={900}
                height={500}
                showValues
                showLabels
                showConnectors
                showTooltip
                showLegend
                positiveColor="#10B981"
                negativeColor="#EF4444"
                totalColor="#3B82F6"
                valueFormat={formatCurrency}
                title="Monthly Revenue"
                description="Revenue accumulation throughout the year"
              />
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>WaterfallChart Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Visual Elements</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Positive/negative color coding</li>
                  <li>• Connector lines between bars</li>
                  <li>• Zero baseline reference</li>
                  <li>• Grid lines for scale</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Automatic total calculation</li>
                  <li>• Running totals in tooltips</li>
                  <li>• Custom color per category</li>
                  <li>• Metadata support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Interactivity</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Hover tooltips with details</li>
                  <li>• Click events on bars</li>
                  <li>• Smooth animations</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
