// app/heatmap-demo/page.tsx
"use client";

import * as React from "react";
import { HeatMap } from "@/components/heatmap/heatmap";
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
import { format, subDays, eachDayOfInterval } from "date-fns";

// Generate mock data
const generateMockData = (days: number = 365) => {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const daysArray = eachDayOfInterval({ start: startDate, end: endDate });

  return daysArray.map((date) => ({
    date: date.toISOString(),
    value: Math.floor(Math.random() * 100),
    metadata: {
      commits: Math.floor(Math.random() * 20),
      lines: Math.floor(Math.random() * 500),
    },
  }));
};

const activityData = generateMockData(365);

// Commits data (for GitHub-like heatmap)
const commitsData = activityData.map((d) => ({
  ...d,
  value: d.metadata?.commits || 0,
}));

// Revenue data
const revenueData = activityData.map((d) => ({
  ...d,
  value: Math.floor(Math.random() * 50000),
}));

export default function HeatmapDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HeatMap Components</h1>
          <p className="text-muted-foreground mt-1">
            Calendar heatmap for visualizing activity patterns
          </p>
        </div>

        <Tabs defaultValue="github">
          <TabsList className="mb-6">
            <TabsTrigger value="github">GitHub Style</TabsTrigger>
            <TabsTrigger value="colorSchemes">Color Schemes</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
          </TabsList>

          {/* GitHub Style */}
          <TabsContent value="github">
            <DashboardCard title="GitHub Contribution Heatmap">
              <HeatMap
                data={commitsData}
                title="Contribution Activity"
                description="Daily commits over the last year"
                colorScheme="green"
                showTooltip
                showLegend
                valueFormat={(val) => `${val} commits`}
                dateFormat={(date) => format(date, "EEEE, MMM d, yyyy")}
              />
            </DashboardCard>
          </TabsContent>

          {/* Color Schemes */}
          <TabsContent value="colorSchemes">
            <div className="grid gap-6">
              <DashboardCard title="Default Color Scheme">
                <HeatMap
                  data={activityData}
                  title="Default Theme"
                  colorScheme="default"
                  showLegend
                />
              </DashboardCard>

              <DashboardCard title="Green Color Scheme">
                <HeatMap
                  data={activityData}
                  title="Green Theme"
                  colorScheme="green"
                  showLegend
                />
              </DashboardCard>

              <DashboardCard title="Blue Color Scheme">
                <HeatMap
                  data={activityData}
                  title="Blue Theme"
                  colorScheme="blue"
                  showLegend
                />
              </DashboardCard>

              <DashboardCard title="Purple Color Scheme">
                <HeatMap
                  data={activityData}
                  title="Purple Theme"
                  colorScheme="purple"
                  showLegend
                />
              </DashboardCard>

              <DashboardCard title="Red Color Scheme">
                <HeatMap
                  data={activityData}
                  title="Red Theme"
                  colorScheme="red"
                  showLegend
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Default Variant">
                <HeatMap
                  data={activityData.slice(0, 180)}
                  title="Default Size"
                  variant="default"
                  showLegend
                />
              </DashboardCard>

              <DashboardCard title="Compact Variant">
                <HeatMap
                  data={activityData.slice(0, 180)}
                  title="Compact Size"
                  variant="compact"
                  showLegend
                />
              </DashboardCard>

              <DashboardCard title="Detailed Variant">
                <HeatMap
                  data={activityData.slice(0, 180)}
                  title="Detailed Size"
                  variant="detailed"
                  showLegend
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Interactive */}
          <TabsContent value="interactive">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Revenue Heatmap">
                <HeatMap
                  data={revenueData}
                  title="Daily Revenue"
                  description="Revenue in USD"
                  colorScheme="blue"
                  valueFormat={(val) => `$${val.toLocaleString()}`}
                  showTooltip
                  showLegend
                  onCellClick={(data) => console.log("Clicked:", data)}
                />
              </DashboardCard>

              <DashboardCard title="Custom Range & Colors">
                <HeatMap
                  data={activityData.slice(0, 90)}
                  title="Last 90 Days Activity"
                  minValue={0}
                  maxValue={50}
                  customColors={[
                    "#FEE2E2",
                    "#FECACA",
                    "#FCA5A5",
                    "#F87171",
                    "#EF4444",
                    "#DC2626",
                    "#B91C1C",
                  ]}
                  showLegend
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>HeatMap Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Color Schemes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default - Gray to Blue</li>
                  <li>• green - Gray to Green</li>
                  <li>• blue - Gray to Blue</li>
                  <li>• purple - Gray to Purple</li>
                  <li>• red - Gray to Red</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Variants</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default - Standard size</li>
                  <li>• compact - Smaller cells</li>
                  <li>• detailed - Larger cells</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Interactive tooltips</li>
                  <li>• Custom value ranges</li>
                  <li>• Metadata support</li>
                  <li>• Click & hover events</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
