import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import { DashboardCard } from "@/components/cards/dashboard-card";
import TodoList from "@/components/TodoList";

const Homepage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <DashboardCard title="Sales Overview" description="Last 7 days">
        <AppBarChart />
      </DashboardCard>
      <DashboardCard>
        <CardList title="Latest Transactions" />
      </DashboardCard>
      <DashboardCard>
        <AppPieChart />
      </DashboardCard>
      <DashboardCard>
        <TodoList />
      </DashboardCard>
      <DashboardCard>
        <AppAreaChart />
      </DashboardCard>
      <DashboardCard>
        <CardList title="Popular Content" />
      </DashboardCard>
    </div>
  );
};

export default Homepage;
