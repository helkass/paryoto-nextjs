// app/treemap-demo/page.tsx
"use client";

import * as React from "react";
import { TreeMap } from "@/components/treemap/treemap";
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

// Sample data - Market Share
const marketShareData = {
  name: "Market",
  children: [
    {
      name: "Technology",
      value: 35000,
      children: [
        { name: "Software", value: 15000, metadata: { growth: "+15%" } },
        { name: "Hardware", value: 12000, metadata: { growth: "+8%" } },
        { name: "Services", value: 8000, metadata: { growth: "+12%" } },
      ],
    },
    {
      name: "Healthcare",
      value: 28000,
      children: [
        { name: "Pharmaceuticals", value: 12000, metadata: { growth: "+10%" } },
        { name: "Medical Devices", value: 9000, metadata: { growth: "+7%" } },
        {
          name: "Healthcare Services",
          value: 7000,
          metadata: { growth: "+9%" },
        },
      ],
    },
    {
      name: "Finance",
      value: 25000,
      children: [
        { name: "Banking", value: 10000, metadata: { growth: "+5%" } },
        { name: "Insurance", value: 8000, metadata: { growth: "+6%" } },
        { name: "Investment", value: 7000, metadata: { growth: "+12%" } },
      ],
    },
    {
      name: "Retail",
      value: 20000,
      children: [
        { name: "E-commerce", value: 12000, metadata: { growth: "+20%" } },
        { name: "Physical Stores", value: 8000, metadata: { growth: "+2%" } },
      ],
    },
    {
      name: "Manufacturing",
      value: 18000,
      children: [
        { name: "Automotive", value: 8000, metadata: { growth: "+4%" } },
        { name: "Electronics", value: 6000, metadata: { growth: "+6%" } },
        { name: "Textiles", value: 4000, metadata: { growth: "+1%" } },
      ],
    },
  ],
};

// Budget allocation data
const budgetData = {
  name: "Budget",
  children: [
    {
      name: "Operations",
      value: 450000,
      children: [
        { name: "Facilities", value: 150000 },
        { name: "Equipment", value: 120000 },
        { name: "Utilities", value: 80000 },
        { name: "Maintenance", value: 100000 },
      ],
    },
    {
      name: "Salaries",
      value: 500000,
      children: [
        { name: "Engineering", value: 200000 },
        { name: "Sales", value: 150000 },
        { name: "Marketing", value: 80000 },
        { name: "Admin", value: 70000 },
      ],
    },
    {
      name: "Marketing",
      value: 200000,
      children: [
        { name: "Digital", value: 80000 },
        { name: "Traditional", value: 50000 },
        { name: "Events", value: 70000 },
      ],
    },
    {
      name: "R&D",
      value: 150000,
      children: [
        { name: "Research", value: 60000 },
        { name: "Development", value: 90000 },
      ],
    },
  ],
};

// Sales by region data
const salesData = {
  name: "Global Sales",
  children: [
    {
      name: "North America",
      value: 1250000,
      children: [
        { name: "USA", value: 900000 },
        { name: "Canada", value: 250000 },
        { name: "Mexico", value: 100000 },
      ],
    },
    {
      name: "Europe",
      value: 950000,
      children: [
        { name: "UK", value: 300000 },
        { name: "Germany", value: 280000 },
        { name: "France", value: 200000 },
        { name: "Others", value: 170000 },
      ],
    },
    {
      name: "Asia Pacific",
      value: 800000,
      children: [
        { name: "China", value: 350000 },
        { name: "Japan", value: 250000 },
        { name: "India", value: 150000 },
        { name: "Australia", value: 50000 },
      ],
    },
    {
      name: "Latin America",
      value: 300000,
      children: [
        { name: "Brazil", value: 150000 },
        { name: "Argentina", value: 80000 },
        { name: "Chile", value: 70000 },
      ],
    },
  ],
};

// Product categories data
const productData = {
  name: "Products",
  children: [
    {
      name: "Electronics",
      value: 500000,
      children: [
        { name: "Smartphones", value: 200000 },
        { name: "Laptops", value: 150000 },
        { name: "Tablets", value: 80000 },
        { name: "Accessories", value: 70000 },
      ],
    },
    {
      name: "Clothing",
      value: 350000,
      children: [
        { name: "Men", value: 150000 },
        { name: "Women", value: 140000 },
        { name: "Kids", value: 60000 },
      ],
    },
    {
      name: "Home & Living",
      value: 280000,
      children: [
        { name: "Furniture", value: 120000 },
        { name: "Decor", value: 80000 },
        { name: "Kitchen", value: 80000 },
      ],
    },
    {
      name: "Sports",
      value: 200000,
      children: [
        { name: "Outdoor", value: 80000 },
        { name: "Fitness", value: 70000 },
        { name: "Team Sports", value: 50000 },
      ],
    },
  ],
};

export default function TreeMapDemoPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  const handleCellClick = (node: any, path: string[]) => {
    toast.info(
      `Clicked: ${path.join(" > ")} - Value: ${node.value?.toLocaleString()}`
    );
  };

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
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">TreeMap Components</h1>
          <p className="text-muted-foreground mt-1">
            Hierarchical data visualization with treemap layouts
          </p>
        </div>

        <Tabs defaultValue="market">
          <TabsList className="mb-6">
            <TabsTrigger value="market">Market Share</TabsTrigger>
            <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
            <TabsTrigger value="sales">Sales by Region</TabsTrigger>
            <TabsTrigger value="variants">Layout Variants</TabsTrigger>
          </TabsList>

          {/* Market Share */}
          <TabsContent value="market">
            <DashboardCard title="Market Share by Industry">
              <TreeMap
                data={marketShareData}
                width={900}
                height={500}
                variant="squarified"
                colorScheme="blue"
                showLabels
                showValues
                showTooltip
                showLegend
                title="Global Market Share"
                description="Distribution of market share across industries"
                valueFormat={formatNumber}
                onCellClick={handleCellClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Budget Allocation */}
          <TabsContent value="budget">
            <DashboardCard title="Budget Allocation">
              <TreeMap
                data={budgetData}
                width={900}
                height={500}
                variant="squarified"
                colorScheme="green"
                showLabels
                showValues
                showTooltip
                showLegend
                title="Annual Budget Breakdown"
                description="How budget is allocated across departments"
                valueFormat={formatCurrency}
                onCellClick={handleCellClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Sales by Region */}
          <TabsContent value="sales">
            <DashboardCard title="Sales by Region">
              <TreeMap
                data={salesData}
                width={900}
                height={500}
                variant="squarified"
                colorScheme="purple"
                showLabels
                showValues
                showTooltip
                showLegend
                title="Global Sales Distribution"
                description="Sales performance by region and country"
                valueFormat={formatCurrency}
                onCellClick={handleCellClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Layout Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6">
              <DashboardCard title="Squarified Layout (Default)">
                <TreeMap
                  data={productData}
                  width={900}
                  height={400}
                  variant="squarified"
                  colorScheme="default"
                  showLabels
                  showValues
                  title="Squarified - Best aspect ratios"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Slice Layout (Horizontal Strips)">
                <TreeMap
                  data={productData}
                  width={900}
                  height={400}
                  variant="slice"
                  colorScheme="blue"
                  showLabels
                  showValues
                  title="Slice - Horizontal strips"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Dice Layout (Vertical Strips)">
                <TreeMap
                  data={productData}
                  width={900}
                  height={400}
                  variant="dice"
                  colorScheme="green"
                  showLabels
                  showValues
                  title="Dice - Vertical strips"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>

              <DashboardCard title="Slice-Dice Layout (Alternating)">
                <TreeMap
                  data={productData}
                  width={900}
                  height={400}
                  variant="slice-dice"
                  colorScheme="purple"
                  showLabels
                  showValues
                  title="Slice-Dice - Alternating orientation"
                  valueFormat={formatCurrency}
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>TreeMap Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Layout Algorithms</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>squarified</strong> - Best aspect ratios
                  </li>
                  <li>
                    • <strong>slice</strong> - Horizontal strips
                  </li>
                  <li>
                    • <strong>dice</strong> - Vertical strips
                  </li>
                  <li>
                    • <strong>slice-dice</strong> - Alternating
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color Schemes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default - Blue gradient</li>
                  <li>• green - Green gradient</li>
                  <li>• blue - Blue gradient</li>
                  <li>• purple - Purple gradient</li>
                  <li>• red - Red gradient</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Interactive tooltips</li>
                  <li>• Click & hover events</li>
                  <li>• Custom color mapping</li>
                  <li>• Metadata support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
