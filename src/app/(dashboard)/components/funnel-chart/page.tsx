// app/funnel-chart-demo/page.tsx
"use client";

import * as React from "react";
import { FunnelChart } from "@/components/funnel-chart/funnel-chart";
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

// Sales pipeline data
const salesPipeline = [
  {
    id: "leads",
    name: "Leads",
    value: 10000,
    metadata: { source: "Website, Referral" },
  },
  {
    id: "qualified",
    name: "Qualified",
    value: 6500,
    metadata: { conversion: "65%" },
  },
  {
    id: "proposal",
    name: "Proposal",
    value: 4200,
    metadata: { conversion: "65%" },
  },
  {
    id: "negotiation",
    name: "Negotiation",
    value: 2800,
    metadata: { conversion: "67%" },
  },
  {
    id: "closed",
    name: "Closed Won",
    value: 1800,
    metadata: { conversion: "64%" },
  },
];

// Recruitment funnel
const recruitmentFunnel = [
  { id: "applications", name: "Applications", value: 5000 },
  { id: "screening", name: "Screening", value: 2500 },
  { id: "interview", name: "Interview", value: 800 },
  { id: "technical", name: "Technical Test", value: 400 },
  { id: "offer", name: "Offer", value: 200 },
  { id: "hired", name: "Hired", value: 150 },
];

// Marketing funnel
const marketingFunnel = [
  { id: "impressions", name: "Impressions", value: 100000 },
  { id: "clicks", name: "Clicks", value: 25000 },
  { id: "visits", name: "Visits", value: 18000 },
  { id: "signups", name: "Signups", value: 5000 },
  { id: "conversions", name: "Conversions", value: 2000 },
];

// E-commerce funnel
const ecommerceFunnel = [
  { id: "visitors", name: "Visitors", value: 50000 },
  { id: "views", name: "Product Views", value: 30000 },
  { id: "cart", name: "Add to Cart", value: 15000 },
  { id: "checkout", name: "Checkout", value: 8000 },
  { id: "purchase", name: "Purchase", value: 5000 },
];

export default function FunnelChartDemoPage() {
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

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleStageClick = (stage: any, index: number) => {
    toast.info(`Clicked: ${stage.name} - ${formatNumber(stage.value)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Funnel Chart Components</h1>
          <p className="text-muted-foreground mt-1">
            Visualize sales pipeline and conversion funnels
          </p>
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            <TabsTrigger value="sales">Sales Pipeline</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
          </TabsList>

          {/* Sales Pipeline */}
          <TabsContent value="sales">
            <DashboardCard title="Sales Pipeline Funnel">
              <FunnelChart
                data={salesPipeline}
                width={700}
                height={500}
                variant="default"
                colorScheme="blue"
                showLabels
                showValues
                showPercentages
                showTooltip
                title="Sales Pipeline"
                description="From leads to closed deals"
                valueFormat={formatNumber}
                onStageClick={handleStageClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Recruitment Funnel */}
          <TabsContent value="recruitment">
            <DashboardCard title="Recruitment Funnel">
              <FunnelChart
                data={recruitmentFunnel}
                width={700}
                height={600}
                variant="default"
                colorScheme="green"
                showLabels
                showValues
                showPercentages
                showTooltip
                title="Hiring Pipeline"
                description="From applications to hired candidates"
                valueFormat={formatNumber}
                onStageClick={handleStageClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Marketing Funnel */}
          <TabsContent value="marketing">
            <DashboardCard title="Marketing Funnel">
              <FunnelChart
                data={marketingFunnel}
                width={700}
                height={500}
                variant="default"
                colorScheme="purple"
                showLabels
                showValues
                showPercentages
                showTooltip
                title="Marketing Pipeline"
                description="From impressions to conversions"
                valueFormat={formatNumber}
                onStageClick={handleStageClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* E-commerce Funnel */}
          <TabsContent value="ecommerce">
            <DashboardCard title="E-commerce Funnel">
              <FunnelChart
                data={ecommerceFunnel}
                width={700}
                height={500}
                variant="default"
                colorScheme="orange"
                showLabels
                showValues
                showPercentages
                showTooltip
                title="Shopping Pipeline"
                description="From visitors to purchases"
                valueFormat={formatNumber}
                onStageClick={handleStageClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6">
              <DashboardCard title="Default Funnel">
                <FunnelChart
                  data={salesPipeline}
                  width={700}
                  height={400}
                  variant="default"
                  colorScheme="blue"
                  showLabels
                  showValues
                  showPercentages
                  title="Default - Standard funnel shape"
                  valueFormat={formatNumber}
                />
              </DashboardCard>

              <DashboardCard title="Pyramid Funnel">
                <FunnelChart
                  data={salesPipeline}
                  width={700}
                  height={400}
                  variant="pyramid"
                  colorScheme="green"
                  showLabels
                  showValues
                  showPercentages
                  title="Pyramid - Centered funnel"
                  valueFormat={formatNumber}
                />
              </DashboardCard>

              <DashboardCard title="Inverted Funnel">
                <FunnelChart
                  data={salesPipeline}
                  width={700}
                  height={400}
                  variant="inverted"
                  colorScheme="purple"
                  showLabels
                  showValues
                  showPercentages
                  title="Inverted - Reverse funnel"
                  valueFormat={formatNumber}
                />
              </DashboardCard>

              <DashboardCard title="Curved Funnel">
                <FunnelChart
                  data={salesPipeline}
                  width={700}
                  height={400}
                  variant="curved"
                  colorScheme="orange"
                  showLabels
                  showValues
                  showPercentages
                  title="Curved - Smooth connections"
                  valueFormat={formatNumber}
                />
              </DashboardCard>

              <DashboardCard title="Without Percentages">
                <FunnelChart
                  data={salesPipeline}
                  width={700}
                  height={400}
                  variant="default"
                  colorScheme="red"
                  showLabels
                  showValues
                  showPercentages={false}
                  title="Clean view - No percentages"
                  valueFormat={formatNumber}
                />
              </DashboardCard>

              <DashboardCard title="Without Values">
                <FunnelChart
                  data={salesPipeline}
                  width={700}
                  height={400}
                  variant="default"
                  colorScheme="blue"
                  showLabels
                  showValues={false}
                  showPercentages
                  title="Focus on stage names only"
                  valueFormat={formatNumber}
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>FunnelChart Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Variants</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>default</strong> - Standard funnel
                  </li>
                  <li>
                    • <strong>pyramid</strong> - Centered pyramid
                  </li>
                  <li>
                    • <strong>inverted</strong> - Reverse funnel
                  </li>
                  <li>
                    • <strong>curved</strong> - Smooth connectors
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color Schemes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default, blue, green, purple, red, orange</li>
                  <li>• Custom colors via customColors prop</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Interactive tooltips</li>
                  <li>• Conversion rates display</li>
                  <li>• Click & hover events</li>
                  <li>• Custom formatting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
