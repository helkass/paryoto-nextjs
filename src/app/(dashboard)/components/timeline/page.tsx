"use client";

import { useState } from "react";
import { ActivityTimeline } from "@/components/activity-timeline/activity-timeline";
import { TimelineFilter } from "@/components/activity-timeline/timeline-filter";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import {
  UserPlus,
  ShoppingCart,
  CreditCard,
  Settings,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import type { TimelineEvent } from "@/types/activity-timeline.types";

// Mock data
const mockEvents = [
  {
    id: 1,
    title: "New user registered",
    description: "John Doe created a new account",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: "success" as const,
    icon: <UserPlus className="h-4 w-4" />,
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "",
    },
    metadata: {
      role: "Admin",
      department: "Engineering",
    },
    actions: [
      {
        label: "View Profile",
        icon: <Eye className="h-3 w-3" />,
        onClick: (event: TimelineEvent) =>
          toast.info(`Viewing ${event.user?.name}'s profile`),
      },
      {
        label: "Message",
        icon: <MessageSquare className="h-3 w-3" />,
        onClick: () => toast.info("Opening chat..."),
      },
    ],
  },
  {
    id: 2,
    title: "Order #12345 placed",
    description: "Customer purchased 3 items totaling $299.99",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: "primary" as const,
    icon: <ShoppingCart className="h-4 w-4" />,
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    metadata: {
      orderId: "#12345",
      amount: "$299.99",
      items: 3,
    },
    status: "completed" as const,
    actions: [
      {
        label: "View Order",
        icon: <Eye className="h-3 w-3" />,
        onClick: () => toast.info("Viewing order details"),
      },
    ],
  },
  {
    id: 3,
    title: "Payment received",
    description: "Payment of $1,299.99 received for invoice #INV-2024-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "success" as const,
    icon: <CreditCard className="h-4 w-4" />,
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
    },
    metadata: {
      invoiceId: "INV-2024-001",
      amount: "$1,299.99",
      method: "Credit Card",
    },
    status: "completed" as const,
  },
  {
    id: 4,
    title: "System update scheduled",
    description: "System maintenance scheduled for March 15, 2024 at 2:00 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    type: "warning" as const,
    icon: <Settings className="h-4 w-4" />,
    metadata: {
      scheduled: "March 15, 2024",
      duration: "2 hours",
    },
    status: "pending" as const,
  },
  {
    id: 5,
    title: "Failed login attempt",
    description: "Multiple failed login attempts detected",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: "error" as const,
    icon: <AlertCircle className="h-4 w-4" />,
    user: {
      name: "Unknown",
      email: "unknown@example.com",
    },
    metadata: {
      attempts: 5,
      ip: "192.168.1.1",
    },
    status: "failed" as const,
    actions: [
      {
        label: "Block IP",
        icon: <AlertCircle className="h-3 w-3" />,
        onClick: () => toast.error("IP address blocked"),
      },
    ],
  },
  {
    id: 6,
    title: "Report generated",
    description: "Monthly sales report generated successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    type: "info" as const,
    icon: <Download className="h-4 w-4" />,
    user: {
      name: "System",
      email: "system@example.com",
    },
    metadata: {
      reportId: "RPT-2024-002",
      format: "PDF",
    },
    status: "completed" as const,
    actions: [
      {
        label: "Download",
        icon: <Download className="h-3 w-3" />,
        onClick: () => toast.success("Download started"),
      },
    ],
  },
  {
    id: 7,
    title: "New comment on ticket #789",
    description: "Support ticket updated with new comment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    type: "primary" as const,
    icon: <MessageSquare className="h-4 w-4" />,
    user: {
      name: "Support Agent",
      email: "support@example.com",
    },
    metadata: {
      ticketId: "#789",
      priority: "High",
    },
    status: "in-progress" as const,
  },
];

const eventTypes = ["info", "success", "warning", "error", "primary"];

export default function TimelineDemoPage() {
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null
  );

  const handleSearch = (term: string) => {
    setSearch(term);
    applyFilters(term, selectedTypes, dateRange);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    applyFilters(search, types, dateRange);
  };

  const handleDateRangeChange = (range: { start: Date; end: Date } | null) => {
    setDateRange(range);
    applyFilters(search, selectedTypes, range);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedTypes([]);
    setDateRange(null);
    setFilteredEvents(mockEvents);
  };

  const applyFilters = (
    searchTerm: string,
    types: string[],
    range: { start: Date; end: Date } | null
  ) => {
    let filtered = [...mockEvents];

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (types.length > 0) {
      filtered = filtered.filter(
        (event) => event.type && types.includes(event.type)
      );
    }

    if (range) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= range.start && eventDate <= range.end;
      });
    }

    setFilteredEvents(filtered);
  };
  const handleEventClick = (event: TimelineEvent) => {
    toast.info(`Clicked: ${event.title}`);
  };

  const handleUserClick = (user: TimelineEvent["user"]) => {
    toast.info(`Viewing user: ${user?.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Activity Timeline</h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and events
          </p>
        </div>

        {/* Filters */}
        <TimelineFilter
          types={eventTypes}
          onSearchChange={handleSearch}
          onTypeChange={handleTypeChange}
          onDateRangeChange={handleDateRangeChange}
          onReset={handleReset}
          onFilterChange={(filters) =>
            applyFilters(filters.search, filters.types, filters.dateRange)
          }
        />

        {/* Timeline Variants */}
        <Tabs defaultValue="default">
          <TabsList className="mb-6">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="compact">Compact</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
          </TabsList>

          <TabsContent value="default">
            <DashboardCard
              title="Activity Timeline"
              description="Default timeline view"
            >
              <ActivityTimeline
                events={filteredEvents}
                variant="default"
                layout="vertical"
                showUser={true}
                showMetadata={false}
                showActions={true}
                groupByDate={true}
                onEventClick={handleEventClick}
                onUserClick={handleUserClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="compact">
            <DashboardCard
              title="Activity Timeline"
              description="Compact timeline view"
            >
              <ActivityTimeline
                events={filteredEvents.slice(0, 10)}
                variant="compact"
                showUser={false}
                showActions={true}
                onEventClick={handleEventClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="detailed">
            <DashboardCard
              title="Activity Timeline"
              description="Detailed timeline view"
            >
              <ActivityTimeline
                events={filteredEvents.slice(0, 5)}
                variant="detailed"
                showUser={true}
                showMetadata={true}
                showActions={true}
                onEventClick={handleEventClick}
                onUserClick={handleUserClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="modern">
            <DashboardCard
              title="Activity Timeline"
              description="Modern timeline view"
            >
              <ActivityTimeline
                events={filteredEvents.slice(0, 5)}
                variant="modern"
                showUser={true}
                showMetadata={true}
                showActions={true}
                onEventClick={handleEventClick}
                onUserClick={handleUserClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <DashboardCard title="Timeline Statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{mockEvents.length}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">
                {mockEvents.filter((e) => e.type === "success").length}
              </p>
              <p className="text-xs text-muted-foreground">Success Events</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{filteredEvents.length}</p>
              <p className="text-xs text-muted-foreground">Filtered Events</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground">Unique Users</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
