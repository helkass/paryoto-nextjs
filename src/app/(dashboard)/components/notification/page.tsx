// app/notification-demo/page.tsx
"use client";

import { useState } from "react";
import { NotificationList } from "@/components/notification/notification-list";
import { NotificationBell } from "@/components/notification/notification-bell";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Notification } from "@/types/notification.types";

// Mock data
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New message from John Doe",
    message:
      "Hey! I wanted to follow up on our conversation about the project...",
    type: "primary",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    read: false,
    priority: "high",
    actions: [
      { label: "Reply", onClick: () => {} },
      { label: "Mark as read", onClick: () => {} },
    ],
    metadata: {
      from: "john@example.com",
      project: "Dashboard Redesign",
    },
  },
  {
    id: 2,
    title: "Payment received",
    message: "You have received a payment of $1,299.99",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    priority: "medium",
    actions: [{ label: "View Details", onClick: () => {} }],
    metadata: {
      invoiceId: "INV-2024-001",
      amount: "$1,299.99",
    },
  },
  {
    id: 3,
    title: "System update scheduled",
    message: "System maintenance scheduled for March 15, 2024 at 2:00 AM",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    priority: "medium",
    actions: [
      { label: "View Details", onClick: () => {} },
      { label: "Remind me", onClick: () => {} },
    ],
  },
  {
    id: 4,
    title: "Server error detected",
    message: "High CPU usage detected on production server",
    type: "error",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: false,
    priority: "high",
    actions: [
      {
        label: "Investigate",
        onClick: () => {},
        variant: "destructive" as const,
      },
      { label: "Dismiss", onClick: () => {} },
    ],
    metadata: {
      server: "prod-web-01",
      cpu: "95%",
    },
  },
  {
    id: 5,
    title: "Weekly report ready",
    message: "Your weekly sales report is ready for download",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    priority: "low",
    actions: [{ label: "Download", onClick: () => {} }],
  },
  {
    id: 6,
    title: "New team member",
    message: "Sarah Johnson has joined your team",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
  },
  {
    id: 7,
    title: "Project deadline approaching",
    message: "Dashboard project deadline is in 3 days",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    read: false,
    priority: "high",
    actions: [
      { label: "Extend deadline", onClick: () => {} },
      { label: "View project", onClick: () => {} },
    ],
  },
];

export default function NotificationDemoPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDismiss = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification dismissed");
  };

  const handleDismissAll = () => {
    setNotifications([]);
    toast.info("All notifications dismissed");
  };

  const handleNotificationClick = (notification: Notification) => {
    toast.info(`Clicked: ${notification.title}`);
  };

  const handleActionClick = (notification: Notification, action: string) => {
    toast.success(`Action: ${action} on ${notification.title}`);
  };

  const handleAddNotification = () => {
    const newNotification: Notification = {
      id: Date.now(),
      title: "New notification",
      message: "This is a test notification",
      type: "info",
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    toast.success("New notification added");
  };

  const handleViewAll = () => {
    toast.info("Viewing all notifications");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Bell */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications Center</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your notifications
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onViewAll={handleViewAll}
            />
            <Button onClick={handleAddNotification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Test Notification
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card border">
            <p className="text-2xl font-bold">{notifications.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <p className="text-2xl font-bold text-primary">{unreadCount}</p>
            <p className="text-xs text-muted-foreground">Unread</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <p className="text-2xl font-bold text-green-500">
              {notifications.filter((n) => n.type === "success").length}
            </p>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <p className="text-2xl font-bold text-yellow-500">
              {
                notifications.filter(
                  (n) => n.type === "warning" || n.type === "error"
                ).length
              }
            </p>
            <p className="text-xs text-muted-foreground">Alerts</p>
          </div>
        </div>

        {/* Notification List Variants */}
        <Tabs defaultValue="default">
          <TabsList className="mb-6">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="compact">Compact</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
          </TabsList>

          <TabsContent value="default">
            <DashboardCard
              title="Notifications"
              description="Default notification list view"
            >
              <NotificationList
                notifications={notifications}
                variant="default"
                showTimestamp={true}
                showActions={true}
                showDismiss={true}
                groupByDate={true}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDismiss={handleDismiss}
                onDismissAll={handleDismissAll}
                onNotificationClick={handleNotificationClick}
                onActionClick={handleActionClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="compact">
            <DashboardCard
              title="Notifications"
              description="Compact notification list view"
            >
              <NotificationList
                notifications={notifications.slice(0, 10)}
                variant="compact"
                showTimestamp={true}
                showActions={false}
                showDismiss={true}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
                onNotificationClick={handleNotificationClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="card">
            <DashboardCard
              title="Notifications"
              description="Card notification list view"
            >
              <NotificationList
                notifications={notifications.slice(0, 5)}
                variant="card"
                showTimestamp={true}
                showActions={true}
                showDismiss={true}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
                onNotificationClick={handleNotificationClick}
                onActionClick={handleActionClick}
                animated={true}
              />
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Filter Demo */}
        <DashboardCard title="With Filters">
          <NotificationList
            notifications={notifications}
            variant="compact"
            filter={{
              types: ["success", "warning"],
              read: false,
            }}
            showTimestamp={true}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
            animated={true}
          />
        </DashboardCard>

        {/* Auto Archive Demo */}
        <DashboardCard title="Auto Archive (5 seconds)">
          <NotificationList
            notifications={notifications.slice(0, 3)}
            variant="default"
            autoArchive={true}
            autoArchiveDelay={5000}
            showActions={true}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
            animated={true}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Notifications will be automatically marked as read after 5 seconds
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
