// app/sankey-demo/page.tsx
"use client";

import * as React from "react";
import { SankeyDiagram } from "@/components/sankey/sankey-diagram";
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

// Energy flow data
const energyData = {
  nodes: [
    { id: "Coal", name: "Coal" },
    { id: "Natural Gas", name: "Natural Gas" },
    { id: "Nuclear", name: "Nuclear" },
    { id: "Solar", name: "Solar" },
    { id: "Wind", name: "Wind" },
    { id: "Electricity", name: "Electricity" },
    { id: "Industry", name: "Industry" },
    { id: "Residential", name: "Residential" },
    { id: "Commercial", name: "Commercial" },
    { id: "Transport", name: "Transport" },
  ],
  links: [
    { source: "Coal", target: "Electricity", value: 40 },
    { source: "Natural Gas", target: "Electricity", value: 35 },
    { source: "Nuclear", target: "Electricity", value: 15 },
    { source: "Solar", target: "Electricity", value: 5 },
    { source: "Wind", target: "Electricity", value: 5 },
    { source: "Electricity", target: "Industry", value: 35 },
    { source: "Electricity", target: "Residential", value: 30 },
    { source: "Electricity", target: "Commercial", value: 25 },
    { source: "Electricity", target: "Transport", value: 10 },
  ],
};

// Budget allocation data
const budgetData = {
  nodes: [
    { id: "Total Budget", name: "Total Budget" },
    { id: "R&D", name: "R&D" },
    { id: "Marketing", name: "Marketing" },
    { id: "Sales", name: "Sales" },
    { id: "Operations", name: "Operations" },
    { id: "HR", name: "HR" },
    { id: "Software", name: "Software" },
    { id: "Hardware", name: "Hardware" },
    { id: "Digital", name: "Digital" },
    { id: "Traditional", name: "Traditional" },
  ],
  links: [
    { source: "Total Budget", target: "R&D", value: 300000 },
    { source: "Total Budget", target: "Marketing", value: 250000 },
    { source: "Total Budget", target: "Sales", value: 200000 },
    { source: "Total Budget", target: "Operations", value: 150000 },
    { source: "Total Budget", target: "HR", value: 100000 },
    { source: "R&D", target: "Software", value: 200000 },
    { source: "R&D", target: "Hardware", value: 100000 },
    { source: "Marketing", target: "Digital", value: 150000 },
    { source: "Marketing", target: "Traditional", value: 100000 },
  ],
};

// User journey data
const userJourneyData = {
  nodes: [
    { id: "Homepage", name: "Homepage" },
    { id: "Product Page", name: "Product Page" },
    { id: "Cart", name: "Cart" },
    { id: "Checkout", name: "Checkout" },
    { id: "Payment", name: "Payment" },
    { id: "Confirmation", name: "Confirmation" },
    { id: "Exit", name: "Exit" },
  ],
  links: [
    { source: "Homepage", target: "Product Page", value: 10000 },
    { source: "Product Page", target: "Cart", value: 3000 },
    { source: "Cart", target: "Checkout", value: 2000 },
    { source: "Checkout", target: "Payment", value: 1500 },
    { source: "Payment", target: "Confirmation", value: 1200 },
    { source: "Product Page", target: "Exit", value: 7000 },
    { source: "Cart", target: "Exit", value: 1000 },
    { source: "Checkout", target: "Exit", value: 500 },
  ],
};

// Supply chain data
const supplyChainData = {
  nodes: [
    { id: "Raw Materials", name: "Raw Materials" },
    { id: "Manufacturing", name: "Manufacturing" },
    { id: "Distribution", name: "Distribution" },
    { id: "Retail", name: "Retail" },
    { id: "Customer", name: "Customer" },
    { id: "Returns", name: "Returns" },
  ],
  links: [
    { source: "Raw Materials", target: "Manufacturing", value: 10000 },
    { source: "Manufacturing", target: "Distribution", value: 9500 },
    { source: "Distribution", target: "Retail", value: 9000 },
    { source: "Retail", target: "Customer", value: 8000 },
    { source: "Customer", target: "Returns", value: 500 },
  ],
};

export default function SankeyDemoPage() {
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
          <h1 className="text-3xl font-bold">Sankey Diagram Components</h1>
          <p className="text-muted-foreground mt-1">
            Flow visualization for energy, budget, user journey, and supply
            chain
          </p>
        </div>

        <Tabs defaultValue="energy">
          <TabsList className="mb-6">
            <TabsTrigger value="energy">Energy Flow</TabsTrigger>
            <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
            <TabsTrigger value="journey">User Journey</TabsTrigger>
            <TabsTrigger value="supply">Supply Chain</TabsTrigger>
          </TabsList>

          {/* Energy Flow */}
          <TabsContent value="energy">
            <DashboardCard title="Energy Flow Diagram">
              <SankeyDiagram
                data={energyData}
                width={900}
                height={500}
                variant="curved"
                colorScheme="rainbow"
                showLabels
                showValues
                showTooltip
                showLegend
                valueFormat={formatNumber}
                title="Energy Sources to Consumption"
                description="Flow of energy from various sources to end users"
              />
            </DashboardCard>
          </TabsContent>

          {/* Budget Allocation */}
          <TabsContent value="budget">
            <DashboardCard title="Budget Allocation Diagram">
              <SankeyDiagram
                data={budgetData}
                width={900}
                height={500}
                variant="curved"
                colorScheme="blue"
                showLabels
                showValues
                showTooltip
                showLegend
                valueFormat={formatCurrency}
                title="Budget Distribution"
                description="How budget is allocated across departments and projects"
              />
            </DashboardCard>
          </TabsContent>

          {/* User Journey */}
          <TabsContent value="journey">
            <DashboardCard title="User Journey Diagram">
              <SankeyDiagram
                data={userJourneyData}
                width={900}
                height={450}
                variant="curved"
                colorScheme="green"
                showLabels
                showValues
                showTooltip
                showLegend
                valueFormat={formatNumber}
                title="Customer Conversion Funnel"
                description="User flow from homepage to purchase"
              />
            </DashboardCard>
          </TabsContent>

          {/* Supply Chain */}
          <TabsContent value="supply">
            <DashboardCard title="Supply Chain Diagram">
              <SankeyDiagram
                data={supplyChainData}
                width={900}
                height={400}
                variant="curved"
                colorScheme="purple"
                showLabels
                showValues
                showTooltip
                showLegend
                valueFormat={formatNumber}
                title="Supply Chain Flow"
                description="Material flow from raw materials to customers"
              />
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>SankeyDiagram Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Visual Variants</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>default</strong> - Standard bezier curves
                  </li>
                  <li>
                    • <strong>curved</strong> - Enhanced curved paths
                  </li>
                  <li>
                    • <strong>straight</strong> - Straight line connections
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color Schemes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default, blue, green, purple, orange, rainbow</li>
                  <li>• Custom colors via nodeColors/linkColors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Interactive tooltips</li>
                  <li>• Node/link click events</li>
                  <li>• Automatic layout algorithm</li>
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
