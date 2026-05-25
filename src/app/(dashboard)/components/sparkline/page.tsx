// app/sparkline-demo/page.tsx
"use client";

import * as React from "react";
import { Sparkline } from "@/components/sparkline/sparkline";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data
const uptrendData = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const downtrendData = [55, 50, 45, 40, 35, 30, 25, 20, 15, 10];
const volatileData = [20, 45, 25, 50, 30, 55, 35, 60, 40, 65];
const stableData = [30, 32, 31, 33, 30, 34, 32, 31, 33, 30];

const tableData = [
  { name: "Revenue", value: "$45,231", trend: uptrendData, change: "+12.5%" },
  { name: "Users", value: "2,350", trend: uptrendData, change: "+8.2%" },
  { name: "Orders", value: "1,423", trend: volatileData, change: "+5.1%" },
  {
    name: "Bounce Rate",
    value: "42.5%",
    trend: downtrendData,
    change: "-3.2%",
  },
  { name: "Conversion", value: "3.24%", trend: uptrendData, change: "+0.8%" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SparklineDemoPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sparkline Components</h1>
          <p className="text-muted-foreground mt-1">
            Mini charts for tables and dashboards
          </p>
        </div>

        <Tabs defaultValue="variants">
          <TabsList className="mb-6">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="table">Table Usage</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Line Chart">
                <div className="space-y-4">
                  <Sparkline
                    data={uptrendData}
                    variant="line"
                    width={300}
                    height={60}
                    showArea
                    showPoints
                    showTooltip
                    showTrend
                  />
                  <p className="text-sm text-muted-foreground">
                    Line chart with area fill
                  </p>
                </div>
              </DashboardCard>

              <DashboardCard title="Area Chart">
                <div className="space-y-4">
                  <Sparkline
                    data={volatileData}
                    variant="area"
                    width={300}
                    height={60}
                    showArea
                    showPoints
                    showTooltip
                    showTrend
                  />
                  <p className="text-sm text-muted-foreground">
                    Area chart with full fill
                  </p>
                </div>
              </DashboardCard>

              <DashboardCard title="Bar Chart">
                <div className="space-y-4">
                  <Sparkline
                    data={uptrendData}
                    variant="bar"
                    width={300}
                    height={60}
                    showPoints
                    showTooltip
                    showTrend
                  />
                  <p className="text-sm text-muted-foreground">
                    Horizontal bars
                  </p>
                </div>
              </DashboardCard>

              <DashboardCard title="Column Chart">
                <div className="space-y-4">
                  <Sparkline
                    data={uptrendData}
                    variant="column"
                    width={300}
                    height={60}
                    showPoints
                    showTooltip
                    showTrend
                  />
                  <p className="text-sm text-muted-foreground">
                    Vertical columns
                  </p>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Colors */}
          <TabsContent value="colors">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Default Color">
                <Sparkline
                  data={uptrendData}
                  variant="area"
                  width={300}
                  height={60}
                  color="default"
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Primary Color">
                <Sparkline
                  data={uptrendData}
                  variant="area"
                  width={300}
                  height={60}
                  color="primary"
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Success Color">
                <Sparkline
                  data={uptrendData}
                  variant="area"
                  width={300}
                  height={60}
                  color="success"
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Warning Color">
                <Sparkline
                  data={volatileData}
                  variant="area"
                  width={300}
                  height={60}
                  color="warning"
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Danger Color">
                <Sparkline
                  data={downtrendData}
                  variant="area"
                  width={300}
                  height={60}
                  color="danger"
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Custom Color">
                <Sparkline
                  data={uptrendData}
                  variant="area"
                  width={300}
                  height={60}
                  customColor="#8B5CF6"
                  showTrend
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Table Usage */}
          <TabsContent value="table">
            <DashboardCard title="Sparklines in Table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Trend (7 days)</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>
                        <Sparkline
                          data={row.trend}
                          variant="area"
                          width={120}
                          height={40}
                          showArea
                          showTooltip
                        />
                      </TableCell>
                      <TableCell
                        className={
                          row.change.startsWith("+")
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {row.change}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-6">
              <DashboardCard title="With Points & Tooltip">
                <Sparkline
                  data={uptrendData}
                  variant="line"
                  width={300}
                  height={60}
                  showPoints
                  showTooltip
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Without Points">
                <Sparkline
                  data={uptrendData}
                  variant="line"
                  width={300}
                  height={60}
                  showArea
                  showTooltip
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Without Area">
                <Sparkline
                  data={uptrendData}
                  variant="line"
                  width={300}
                  height={60}
                  showArea={false}
                  showPoints
                  showTooltip
                  showTrend
                />
              </DashboardCard>

              <DashboardCard title="Without Trend">
                <Sparkline
                  data={uptrendData}
                  variant="area"
                  width={300}
                  height={60}
                  showArea
                  showPoints
                  showTooltip
                  showTrend={false}
                />
              </DashboardCard>

              <DashboardCard title="With Min/Max Labels">
                <Sparkline
                  data={volatileData}
                  variant="line"
                  width={300}
                  height={60}
                  showArea
                  showPoints
                  showTooltip
                  showMinMax
                  valueFormat={(val) => val.toFixed(0)}
                />
              </DashboardCard>

              <DashboardCard title="Custom Formatter">
                <Sparkline
                  data={[1000, 1500, 1200, 1800, 2000, 1700, 2200]}
                  variant="area"
                  width={300}
                  height={60}
                  showArea
                  showPoints
                  showTooltip
                  showTrend
                  valueFormat={(val) => formatCurrency(val)}
                  tooltipFormatter={(val) => `Revenue: ${formatCurrency(val)}`}
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sparkline Features</CardTitle>
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
                    • <strong>line</strong> - Line chart
                  </li>
                  <li>
                    • <strong>area</strong> - Area chart
                  </li>
                  <li>
                    • <strong>bar</strong> - Horizontal bars
                  </li>
                  <li>
                    • <strong>column</strong> - Vertical columns
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Colors</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default, primary, success, warning, danger</li>
                  <li>• Custom colors via customColor prop</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Interactive tooltips</li>
                  <li>• Trend indicators</li>
                  <li>• Min/max labels</li>
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
