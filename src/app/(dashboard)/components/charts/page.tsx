"use client";

import { useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  AreaChart,
  ChartCard,
  MOCK_CHARTS,
} from "@/components/charts";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import {
  Grid,
  TrendingUp,
  Users,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";

export default function ChartsDemoPage() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Chart Components Demo</h1>
          <p className="text-muted-foreground mt-1">
            Reusable and scalable chart components with Recharts
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <Grid className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales">
            <TrendingUp className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Activity className="h-4 w-4 mr-2" />
            Comparison
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard
              title="Sales Trend"
              description="Monthly sales performance"
            >
              <LineChart
                data={MOCK_CHARTS.line}
                xAxisKey="name"
                series={[
                  { dataKey: "sales", name: "Sales", color: "var(--chart-1)" },
                  {
                    dataKey: "revenue",
                    name: "Revenue",
                    color: "var(--chart-2)",
                  },
                ]}
                height={350}
              />
            </ChartCard>

            <ChartCard
              title="Top Products"
              description="Product sales comparison"
            >
              <BarChart
                data={MOCK_CHARTS.bar}
                xAxisKey="name"
                series={[
                  { dataKey: "sales", name: "Sales", color: "var(--chart-3)" },
                ]}
                height={350}
              />
            </ChartCard>

            <ChartCard
              title="User Engagement"
              description="Weekly active users"
            >
              <AreaChart
                data={MOCK_CHARTS.area}
                xAxisKey="name"
                series={[
                  {
                    dataKey: "users",
                    name: "Active Users",
                    color: "var(--chart-4)",
                  },
                ]}
                height={350}
                fillOpacity={0.3}
              />
            </ChartCard>

            <ChartCard title="Revenue by Category">
              <PieChart
                data={MOCK_CHARTS.pie}
                dataKey="value"
                nameKey="name"
                height={350}
                showLabel
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <div className="space-y-6 mt-6">
            <ChartCard
              title="Sales Performance"
              description="Year-over-year sales comparison"
              onRefresh={handleRefresh}
            >
              <LineChart
                data={MOCK_CHARTS.sales}
                xAxisKey="month"
                series={[
                  {
                    dataKey: "thisYear",
                    name: "This Year",
                    color: "var(--chart-1)",
                  },
                  {
                    dataKey: "lastYear",
                    name: "Last Year",
                    color: "var(--chart-2)",
                  },
                  {
                    dataKey: "forecast",
                    name: "Forecast",
                    color: "var(--chart-3)",
                  },
                ]}
                height={400}
                loading={loading}
              />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Quarterly Revenue">
                <BarChart
                  data={MOCK_CHARTS.bar.slice(0, 4)}
                  xAxisKey="name"
                  series={[
                    {
                      dataKey: "revenue",
                      name: "Revenue",
                      color: "var(--chart-2)",
                    },
                  ]}
                  height={350}
                />
              </ChartCard>

              <ChartCard title="Revenue Distribution">
                <DonutChart
                  data={MOCK_CHARTS.revenue}
                  dataKey="value"
                  nameKey="name"
                  height={350}
                  showLabel
                />
              </ChartCard>
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="space-y-6 mt-6">
            <ChartCard
              title="User Growth"
              description="Quarterly user acquisition"
              onRefresh={handleRefresh}
            >
              <AreaChart
                data={MOCK_CHARTS.users}
                xAxisKey="quarter"
                series={[
                  {
                    dataKey: "newUsers",
                    name: "New Users",
                    color: "var(--chart-4)",
                  },
                  {
                    dataKey: "activeUsers",
                    name: "Active Users",
                    color: "var(--chart-5)",
                  },
                ]}
                height={400}
                loading={loading}
                stackId="1"
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard title="Market Share">
              <PieChart
                data={MOCK_CHARTS.pie}
                dataKey="value"
                nameKey="name"
                height={400}
                showLabel
                showLegend
              />
            </ChartCard>

            <ChartCard title="Revenue Distribution">
              <DonutChart
                data={MOCK_CHARTS.revenue}
                dataKey="value"
                nameKey="name"
                height={400}
                showLabel
                showLegend
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <div className="space-y-6 mt-6">
            <ChartCard title="Monthly Comparison">
              <BarChart
                data={MOCK_CHARTS.sales}
                xAxisKey="month"
                series={[
                  {
                    dataKey: "thisYear",
                    name: "This Year",
                    color: "var(--chart-1)",
                  },
                  {
                    dataKey: "lastYear",
                    name: "Last Year",
                    color: "var(--chart-2)",
                  },
                ]}
                height={400}
              />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Product Performance">
                <LineChart
                  data={MOCK_CHARTS.bar}
                  xAxisKey="name"
                  series={[
                    {
                      dataKey: "sales",
                      name: "Sales",
                      color: "var(--chart-3)",
                    },
                    {
                      dataKey: "revenue",
                      name: "Revenue",
                      color: "var(--chart-1)",
                    },
                  ]}
                  height={350}
                />
              </ChartCard>

              <ChartCard title="Growth Trend">
                <AreaChart
                  data={MOCK_CHARTS.users}
                  xAxisKey="quarter"
                  series={[
                    {
                      dataKey: "activeUsers",
                      name: "Active Users",
                      color: "var(--chart-5)",
                    },
                  ]}
                  height={350}
                  fillOpacity={0.4}
                />
              </ChartCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
