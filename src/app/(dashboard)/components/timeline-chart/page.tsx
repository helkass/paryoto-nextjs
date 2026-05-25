// app/timeline-chart-demo/page.tsx
"use client";

import * as React from "react";
import { TimelineChart } from "@/components/timeline-chart/timeline-chart";
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

// Project tasks
import type { TimelineTask } from "@/types/timeline-chart.types";

const projectTasks: TimelineTask[] = [
  {
    id: "1",
    name: "Research",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 15),
    progress: 100,
    assignee: "John",
    priority: "high",
  },
  {
    id: "2",
    name: "Design",
    startDate: new Date(2024, 0, 10),
    endDate: new Date(2024, 0, 25),
    progress: 80,
    dependencies: ["1"],
    assignee: "Jane",
    priority: "high",
  },
  {
    id: "3",
    name: "Development",
    startDate: new Date(2024, 0, 20),
    endDate: new Date(2024, 1, 15),
    progress: 45,
    dependencies: ["2"],
    assignee: "Bob",
    priority: "high",
  },
  {
    id: "4",
    name: "Testing",
    startDate: new Date(2024, 1, 10),
    endDate: new Date(2024, 1, 25),
    progress: 20,
    dependencies: ["3"],
    assignee: "Alice",
    priority: "medium",
  },
  {
    id: "5",
    name: "Deployment",
    startDate: new Date(2024, 1, 20),
    endDate: new Date(2024, 1, 28),
    progress: 0,
    dependencies: ["4"],
    assignee: "John",
    priority: "high",
  },
];

// Product roadmap
const roadmapTasks: TimelineTask[] = [
  {
    id: "1",
    name: "MVP Planning",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 31),
    progress: 100,
    priority: "high",
  },
  {
    id: "2",
    name: "Alpha Release",
    startDate: new Date(2024, 1, 1),
    endDate: new Date(2024, 2, 15),
    progress: 75,
    priority: "high",
  },
  {
    id: "3",
    name: "Beta Release",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 3, 30),
    progress: 40,
    priority: "medium",
  },
  {
    id: "4",
    name: "GA Release",
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2024, 5, 30),
    progress: 0,
    priority: "high",
  },
];

// Sprint planning
const sprintTasks = [
  {
    id: "1",
    name: "Sprint Planning",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 2),
    progress: 100,
    assignee: "Team",
  },
  {
    id: "2",
    name: "Development",
    startDate: new Date(2024, 0, 3),
    endDate: new Date(2024, 0, 12),
    progress: 90,
    dependencies: ["1"],
  },
  {
    id: "3",
    name: "Code Review",
    startDate: new Date(2024, 0, 12),
    endDate: new Date(2024, 0, 13),
    progress: 50,
    dependencies: ["2"],
  },
  {
    id: "4",
    name: "Testing",
    startDate: new Date(2024, 0, 13),
    endDate: new Date(2024, 0, 14),
    progress: 30,
    dependencies: ["3"],
  },
  {
    id: "5",
    name: "Sprint Review",
    startDate: new Date(2024, 0, 15),
    endDate: new Date(2024, 0, 15),
    progress: 0,
    dependencies: ["4"],
  },
];

// Event timeline
const eventTasks: TimelineTask[] = [
  {
    id: "1",
    name: "Venue Booking",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 2, 15),
    progress: 100,
    priority: "high",
  },
  {
    id: "2",
    name: "Speaker Confirmation",
    startDate: new Date(2024, 2, 10),
    endDate: new Date(2024, 3, 1),
    progress: 60,
    priority: "high",
  },
  {
    id: "3",
    name: "Ticket Sales",
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2024, 3, 30),
    progress: 40,
    priority: "medium",
  },
  {
    id: "4",
    name: "Marketing Campaign",
    startDate: new Date(2024, 2, 20),
    endDate: new Date(2024, 3, 15),
    progress: 30,
    dependencies: ["3"],
    priority: "medium",
  },
  {
    id: "5",
    name: "Event Day",
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2024, 4, 2),
    progress: 0,
    dependencies: ["1", "2"],
    priority: "high",
  },
];

export default function TimelineChartDemoPage() {
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

  const handleTaskClick = (task: any) => {
    toast.info(`Task: ${task.name} - Progress: ${task.progress}%`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Timeline Chart Components</h1>
          <p className="text-muted-foreground mt-1">
            Gantt-style timeline for project management and scheduling
          </p>
        </div>

        <Tabs defaultValue="project">
          <TabsList className="mb-6">
            <TabsTrigger value="project">Project Plan</TabsTrigger>
            <TabsTrigger value="roadmap">Product Roadmap</TabsTrigger>
            <TabsTrigger value="sprint">Sprint Timeline</TabsTrigger>
            <TabsTrigger value="event">Event Planning</TabsTrigger>
          </TabsList>

          {/* Project Plan */}
          <TabsContent value="project">
            <DashboardCard title="Project Timeline">
              <TimelineChart
                tasks={projectTasks}
                width={1100}
                height={400}
                viewMode="day"
                showWeekends
                showToday
                showProgress
                showTooltip
                showLegend
                showDependencies
                colorScheme="blue"
                valueFormat={formatDate}
                title="Software Development Project"
                description="Q1 2024 Development Timeline"
                onTaskClick={handleTaskClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Product Roadmap */}
          <TabsContent value="roadmap">
            <DashboardCard title="Product Roadmap">
              <TimelineChart
                tasks={roadmapTasks}
                width={1100}
                height={300}
                viewMode="month"
                showWeekends={false}
                showToday
                showProgress
                showTooltip
                showLegend
                colorScheme="green"
                valueFormat={formatDate}
                title="Product Development Roadmap"
                description="2024 Product Milestones"
                onTaskClick={handleTaskClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Sprint Timeline */}
          <TabsContent value="sprint">
            <DashboardCard title="Sprint Timeline">
              <TimelineChart
                tasks={sprintTasks}
                width={1100}
                height={350}
                viewMode="day"
                showWeekends
                showToday
                showProgress
                showTooltip
                showLegend
                showDependencies
                colorScheme="purple"
                valueFormat={formatDate}
                title="January Sprint 2024"
                description="Two-week sprint planning"
                onTaskClick={handleTaskClick}
              />
            </DashboardCard>
          </TabsContent>

          {/* Event Planning */}
          <TabsContent value="event">
            <DashboardCard title="Event Timeline">
              <TimelineChart
                tasks={eventTasks}
                width={1100}
                height={350}
                viewMode="week"
                showWeekends
                showToday
                showProgress
                showTooltip
                showLegend
                showDependencies
                colorScheme="orange"
                valueFormat={formatDate}
                title="Annual Conference 2024"
                description="Event planning timeline"
                onTaskClick={handleTaskClick}
              />
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>TimelineChart Features</CardTitle>
            <CardDescription>
              Available options and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">View Modes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    • <strong>day</strong> - Daily granularity
                  </li>
                  <li>
                    • <strong>week</strong> - Weekly view
                  </li>
                  <li>
                    • <strong>month</strong> - Monthly view
                  </li>
                  <li>
                    • <strong>quarter</strong> - Quarterly view
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Task dependencies</li>
                  <li>• Progress tracking</li>
                  <li>• Weekend highlighting</li>
                  <li>• Today marker</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Interactivity</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Zoom in/out</li>
                  <li>• Click tooltips</li>
                  <li>• Hover effects</li>
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
