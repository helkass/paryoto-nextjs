// app/navbar-demo/page.tsx
"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  Bell,
  User,
  LogOut,
  Shield,
  Activity,
  BarChart3,
  MessageSquare,
  Star,
  Gift,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    title: "New message from John",
    description: "Hey, I saw your profile and...",
    icon: <MessageSquare className="h-4 w-4" />,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "2",
    title: "Your order has been shipped",
    description: "Order #12345 has been shipped",
    icon: <Gift className="h-4 w-4" />,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "3",
    title: "New feature available",
    description: "Check out our new dashboard",
    icon: <Star className="h-4 w-4" />,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "4",
    title: "System update",
    description: "System will be updated at 2 AM",
    icon: <Clock className="h-4 w-4" />,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

// User menu items
const userMenuItems = [
  {
    id: "profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
    href: "/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    href: "/settings",
  },
  { id: "divider-1", divider: true },
  {
    id: "logout",
    label: "Logout",
    icon: <LogOut className="h-4 w-4" />,
    onClick: () => toast.success("Logged out"),
  },
];

export default function NavbarDemoPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleNotificationClick = (notification: any) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    toast.info(`Clicked: ${notification.title}`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleMenuClick = (item: any) => {
    toast.info(`Menu clicked: ${item.label}`);
  };

  const handleUserMenuClick = (item: any) => {
    if (item.id !== "logout") {
      toast.info(`User menu: ${item.label}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar
        brand={{
          title: "Shadcn UI",
          logo: <div className="h-6 w-6 rounded bg-primary" />,
          href: "/",
        }}
        items={[
          {
            id: "dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            href: "/dashboard",
          },
          {
            id: "analytics",
            label: "Analytics",
            icon: <BarChart3 className="h-4 w-4" />,
            href: "/analytics",
          },
          {
            id: "users",
            label: "Users",
            icon: <Users className="h-4 w-4" />,
            href: "/users",
            badge: 12,
          },
          {
            id: "activity",
            label: "Activity",
            icon: <Activity className="h-4 w-4" />,
            href: "/activity",
          },
          {
            id: "settings",
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
            href: "/settings",
          },
          {
            id: "help",
            label: "Help",
            icon: <HelpCircle className="h-4 w-4" />,
            href: "/help",
          },
        ]}
        user={{
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://github.com/shadcn.png",
          menuItems: userMenuItems as any[],
        }}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllAsRead}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search..."
        showThemeToggle={true}
        sticky={true}
        onMenuClick={handleMenuClick}
        onUserMenuClick={handleUserMenuClick}
        actions={
          <Button variant="default" size="sm">
            Upgrade
          </Button>
        }
      />

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Navbar Demo</h1>
            <p className="text-muted-foreground mt-1">
              A fully featured navigation bar with search, notifications, user
              menu, and mobile responsiveness
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Search Query</CardTitle>
                <CardDescription>Current search term</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="rounded bg-muted px-2 py-1">
                  {searchQuery || "No search yet"}
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Unread notifications count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter((n) => !n.read).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Click the sun/moon icon to toggle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Theme toggle is available in the navbar
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Card {i}</CardTitle>
                  <CardDescription>
                    This is a sample card content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
