import type { ChartDataPoint } from "./chart";

// Line Chart Data
export const MOCK_LINE_DATA: ChartDataPoint[] = [
  { name: "Jan", sales: 4000, revenue: 2400, profit: 1600 },
  { name: "Feb", sales: 3000, revenue: 1398, profit: 1602 },
  { name: "Mar", sales: 5000, revenue: 3800, profit: 1200 },
  { name: "Apr", sales: 2780, revenue: 3908, profit: 1128 },
  { name: "May", sales: 1890, revenue: 4800, profit: 2910 },
  { name: "Jun", sales: 2390, revenue: 3800, profit: 1410 },
  { name: "Jul", sales: 3490, revenue: 4300, profit: 810 },
];

// Bar Chart Data
export const MOCK_BAR_DATA: ChartDataPoint[] = [
  { name: "Product A", sales: 4000, revenue: 2400 },
  { name: "Product B", sales: 3000, revenue: 1398 },
  { name: "Product C", sales: 2000, revenue: 9800 },
  { name: "Product D", sales: 2780, revenue: 3908 },
  { name: "Product E", sales: 1890, revenue: 4800 },
];

// Pie Chart Data
export const MOCK_PIE_DATA: ChartDataPoint[] = [
  { name: "Technology", value: 400, color: "var(--chart-1)" },
  { name: "Healthcare", value: 300, color: "var(--chart-2)" },
  { name: "Finance", value: 300, color: "var(--chart-3)" },
  { name: "Education", value: 200, color: "var(--chart-4)" },
  { name: "Retail", value: 150, color: "var(--chart-5)" },
];

// Area Chart Data
export const MOCK_AREA_DATA: ChartDataPoint[] = [
  { name: "Week 1", users: 400, engagement: 240 },
  { name: "Week 2", users: 600, engagement: 380 },
  { name: "Week 3", users: 800, engagement: 520 },
  { name: "Week 4", users: 700, engagement: 480 },
  { name: "Week 5", users: 900, engagement: 680 },
  { name: "Week 6", users: 1100, engagement: 820 },
];

// Composed Chart Data
export const MOCK_COMPOSED_DATA: ChartDataPoint[] = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
];

// Sales Performance Data (Monthly)
export const MOCK_SALES_PERFORMANCE: ChartDataPoint[] = [
  { month: "January", thisYear: 65000, lastYear: 45000, forecast: 70000 },
  { month: "February", thisYear: 59000, lastYear: 52000, forecast: 62000 },
  { month: "March", thisYear: 80000, lastYear: 58000, forecast: 75000 },
  { month: "April", thisYear: 81000, lastYear: 63000, forecast: 78000 },
  { month: "May", thisYear: 56000, lastYear: 54000, forecast: 60000 },
  { month: "June", thisYear: 55000, lastYear: 49000, forecast: 58000 },
];

// User Growth Data
export const MOCK_USER_GROWTH: ChartDataPoint[] = [
  { quarter: "Q1 2023", newUsers: 1240, activeUsers: 3400 },
  { quarter: "Q2 2023", newUsers: 1560, activeUsers: 4100 },
  { quarter: "Q3 2023", newUsers: 1890, activeUsers: 4800 },
  { quarter: "Q4 2023", newUsers: 2100, activeUsers: 5600 },
  { quarter: "Q1 2024", newUsers: 2340, activeUsers: 6200 },
  { quarter: "Q2 2024", newUsers: 2780, activeUsers: 7100 },
];

// Revenue Distribution (Donut Chart)
export const MOCK_REVENUE_DISTRIBUTION: ChartDataPoint[] = [
  { name: "Direct Sales", value: 55, color: "var(--chart-1)" },
  { name: "Partners", value: 25, color: "var(--chart-2)" },
  { name: "Marketplace", value: 15, color: "var(--chart-3)" },
  { name: "Affiliates", value: 5, color: "var(--chart-4)" },
];

// Export all mock data
export const MOCK_CHARTS = {
  line: MOCK_LINE_DATA,
  bar: MOCK_BAR_DATA,
  pie: MOCK_PIE_DATA,
  area: MOCK_AREA_DATA,
  composed: MOCK_COMPOSED_DATA,
  sales: MOCK_SALES_PERFORMANCE,
  users: MOCK_USER_GROWTH,
  revenue: MOCK_REVENUE_DISTRIBUTION,
};
