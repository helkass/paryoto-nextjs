// app/datacard-demo/page.tsx
"use client";

import { DataCard } from "@/components/cards/data-card";
import { StatsCard } from "@/components/cards/stats-card";
import { PremiumMetricCard } from "@/components/cards/premium-metric-card";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Activity,
  Eye,
  MousePointer,
  CreditCard,
  UserPlus,
  Package,
  Zap,
  Clock,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const chartData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 600 },
  { name: "Wed", value: 500 },
  { name: "Thu", value: 700 },
  { name: "Fri", value: 800 },
  { name: "Sat", value: 650 },
  { name: "Sun", value: 900 },
];

const sparklineData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];

export default function DataCardDemoPage() {
  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Data refreshed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Data Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time metrics and insights
          </p>
        </div>

        {/* Premium Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumMetricCard
            title="Total Revenue"
            value={4523189}
            formatValue={(val) => `$${val.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 20.1, isPositive: true }}
            comparison={{
              value: 12.5,
              label: "vs last month",
              isPositive: true,
            }}
            target={5000000}
            targetLabel="Annual Target"
            subtitle="From all revenue sources"
            onClick={() => toast.info("View revenue details")}
          />

          <PremiumMetricCard
            title="Active Users"
            value={2350}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
            comparison={{
              value: 8.3,
              label: "vs last month",
              isPositive: true,
            }}
            subtitle="Last 30 days"
            onClick={() => toast.info("View user details")}
          />

          <PremiumMetricCard
            title="Conversion Rate"
            value={3.24}
            formatValue={(val) => `${val}%`}
            icon={<Zap className="h-6 w-6" />}
            trend={{ value: 2, isPositive: false }}
            comparison={{ value: 0.5, label: "vs target", isPositive: false }}
            target={4.5}
            targetLabel="Target Rate"
            onClick={() => toast.info("View conversion details")}
          />

          <PremiumMetricCard
            title="Avg. Session"
            value={2.34}
            formatValue={(val) => `${val}m`}
            icon={<Clock className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
            subtitle="Minutes per session"
            onClick={() => toast.info("View session details")}
          />
        </div>

        {/* Stats Grid */}
        <StatsCard
          stats={[
            {
              label: "Page Views",
              value: "89.3K",
              icon: <Eye className="h-5 w-5" />,
              trend: { value: 18, isPositive: true },
            },
            {
              label: "Bounce Rate",
              value: "42.5%",
              icon: <MousePointer className="h-5 w-5" />,
              trend: { value: 3, isPositive: false },
            },
            {
              label: "New Users",
              value: "+1,234",
              icon: <UserPlus className="h-5 w-5" />,
              trend: { value: 15, isPositive: true },
            },
            {
              label: "Transactions",
              value: "1,423",
              icon: <CreditCard className="h-5 w-5" />,
              trend: { value: 10, isPositive: true },
            },
          ]}
          columns={4}
          variant="glass"
        />

        {/* Cards with Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataCard
            title="Revenue Overview"
            value="$12,345"
            subtitle="Weekly revenue trend"
            icon={<BarChart3 className="h-5 w-5" />}
            chart={
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                  <YAxis stroke="currentColor" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            }
            period={{
              label: "Period",
              options: ["Daily", "Weekly", "Monthly", "Yearly"],
              value: "Weekly",
              onChange: (value) => toast.info(`Period changed to ${value}`),
            }}
            trend={{ value: 15, isPositive: true, label: "vs last week" }}
            onRefresh={handleRefresh}
            onViewMore={() => toast.info("View detailed revenue report")}
            accent={{ color: "var(--primary)", position: "top" }}
            variant="glass"
          />

          <DataCard
            title="User Growth"
            value="2,350"
            subtitle="New users this month"
            icon={<Users className="h-5 w-5" />}
            sparklineData={sparklineData}
            trend={{ value: 12, isPositive: true }}
            badge={{ text: "RECORD HIGH", variant: "success" }}
            progress={{
              value: 78,
              label: "Monthly goal",
              max: 3000,
              showLabel: true,
            }}
            onViewMore={() => toast.info("View user growth details")}
            accent={{ color: "var(--success)", position: "top" }}
          />
        </div>

        {/* Cards with Different Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataCard
            title="Total Orders"
            value="1,423"
            icon={<ShoppingCart className="h-5 w-5" />}
            trend={{ value: 10, isPositive: true }}
            badge={{ text: "+10%", variant: "success" }}
            variant="gradient"
            onClick={() => toast.info("View orders")}
          />

          <DataCard
            title="Response Time"
            value="1.2s"
            icon={<Activity className="h-5 w-5" />}
            trend={{ value: 0.3, isPositive: true }}
            subtitle="Average API response"
            variant="bordered"
            accent={{ color: "var(--warning)", position: "left" }}
          />

          <DataCard
            title="Active Projects"
            value="12"
            icon={<Package className="h-5 w-5" />}
            progress={{ value: 75, label: "Completion rate" }}
            footer={
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed: 9</span>
                <span className="text-muted-foreground">In Progress: 3</span>
              </div>
            }
            variant="glass"
          />
        </div>

        {/* Large Feature Card */}
        <DataCard
          title="Performance Overview"
          value="Excellent"
          icon={<TrendingUp className="h-6 w-6" />}
          variant="gradient"
          accent={{ color: "var(--primary)", position: "top" }}
          className="col-span-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-muted-foreground mt-1">Uptime</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur">
              <p className="text-2xl font-bold">1.2s</p>
              <p className="text-xs text-muted-foreground mt-1">
                Response Time
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur">
              <p className="text-2xl font-bold">98%</p>
              <p className="text-xs text-muted-foreground mt-1">Satisfaction</p>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
