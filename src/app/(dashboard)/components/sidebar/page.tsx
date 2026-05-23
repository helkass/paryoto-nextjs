// app/sidebar-demo/page.tsx
"use client";

import * as React from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Mail,
  Calendar,
  HelpCircle,
  LogOut,
  Menu,
  Package,
  Truck,
  UserCircle,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarItem } from "@/types/sidebar.types";

const menuItems: SidebarItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    id: "users",
    title: "Users",
    icon: <Users className="h-5 w-5" />,
    children: [
      {
        id: "all-users",
        title: "All Users",
        href: "/users",
        icon: <UserCircle className="h-4 w-4" />,
      },
      {
        id: "add-user",
        title: "Add User",
        href: "/users/add",
        icon: <UserCircle className="h-4 w-4" />,
      },
      {
        id: "roles",
        title: "Roles & Permissions",
        href: "/users/roles",
        icon: <UserCircle className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    icon: <Package className="h-5 w-5" />,
    badge: 12,
    badgeColor: "primary",
    children: [
      {
        id: "all-products",
        title: "All Products",
        href: "/products",
        icon: <Package className="h-4 w-4" />,
      },
      {
        id: "add-product",
        title: "Add Product",
        href: "/products/add",
        icon: <Package className="h-4 w-4" />,
      },
      {
        id: "categories",
        title: "Categories",
        href: "/products/categories",
        icon: <Package className="h-4 w-4" />,
      },
      {
        id: "inventory",
        title: "Inventory",
        href: "/products/inventory",
        icon: <Package className="h-4 w-4" />,
        badge: 3,
        badgeColor: "warning",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    badge: 8,
    badgeColor: "success",
    children: [
      {
        id: "all-orders",
        title: "All Orders",
        href: "/orders",
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        id: "pending",
        title: "Pending",
        href: "/orders/pending",
        icon: <ShoppingCart className="h-4 w-4" />,
        badge: 5,
      },
      {
        id: "processing",
        title: "Processing",
        href: "/orders/processing",
        icon: <ShoppingCart className="h-4 w-4" />,
        badge: 2,
      },
      {
        id: "shipped",
        title: "Shipped",
        href: "/orders/shipped",
        icon: <Truck className="h-4 w-4" />,
        badge: 1,
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      {
        id: "reports",
        title: "Reports",
        href: "/analytics/reports",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        id: "sales",
        title: "Sales Analytics",
        href: "/analytics/sales",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        id: "users-stats",
        title: "User Statistics",
        href: "/analytics/users",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "communications",
    title: "Communications",
    icon: <Mail className="h-5 w-5" />,
    children: [
      {
        id: "messages",
        title: "Messages",
        href: "/messages",
        icon: <Mail className="h-4 w-4" />,
        badge: 3,
      },
      {
        id: "notifications",
        title: "Notifications",
        href: "/notifications",
        icon: <Bell className="h-4 w-4" />,
        badge: 7,
        badgeColor: "danger",
      },
      {
        id: "calendar",
        title: "Calendar",
        href: "/calendar",
        icon: <Calendar className="h-4 w-4" />,
      },
    ],
  },
  { id: "divider-1", divider: true },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    children: [
      {
        id: "profile",
        title: "Profile",
        href: "/settings/profile",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        id: "account",
        title: "Account",
        href: "/settings/account",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        id: "security",
        title: "Security",
        href: "/settings/security",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "help",
    title: "Help & Support",
    icon: <HelpCircle className="h-5 w-5" />,
    children: [
      {
        id: "faq",
        title: "FAQ",
        href: "/help/faq",
        icon: <HelpCircle className="h-4 w-4" />,
      },
      {
        id: "contact",
        title: "Contact Support",
        href: "/help/contact",
        icon: <HelpCircle className="h-4 w-4" />,
      },
    ],
  },
];

export default function SidebarDemoPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { theme, setTheme } = useTheme();

  const SidebarHeader = ({ isOpen }: { isOpen: boolean }) => (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">S</span>
      </div>
      {isOpen && (
        <div>
          <h1 className="font-semibold">Shadcn UI</h1>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      )}
    </div>
  );

  const SidebarFooter = ({ isOpen }: { isOpen: boolean }) => (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        {isOpen && (
          <span className="ml-2">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-red-500 hover:text-red-600"
      >
        <LogOut className="h-4 w-4" />
        {isOpen && <span className="ml-2">Logout</span>}
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Sidebar */}
      <Sidebar
        items={menuItems}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        variant="default"
        collapsible
        hoverExpand
        defaultOpenItems={["users", "products"]}
        header={<SidebarHeader isOpen={isSidebarOpen} />}
        footer={<SidebarFooter isOpen={isSidebarOpen} />}
        onItemClick={(item) => console.log("Clicked:", item.title)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Revenue",
                  value: "$45,231.89",
                  change: "+20.1%",
                  icon: <BarChart3 className="h-4 w-4" />,
                },
                {
                  title: "Total Users",
                  value: "2,350",
                  change: "+180",
                  icon: <Users className="h-4 w-4" />,
                },
                {
                  title: "Total Orders",
                  value: "1,423",
                  change: "+10%",
                  icon: <ShoppingCart className="h-4 w-4" />,
                },
                {
                  title: "Products",
                  value: "238",
                  change: "+12",
                  icon: <Package className="h-4 w-4" />,
                },
              ].map((stat) => (
                <div key={stat.title} className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {stat.title}
                    </span>
                    <span className="rounded-lg bg-muted p-2">{stat.icon}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="ml-2 text-sm text-green-500">
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-card">
              <div className="border-b p-4">
                <h2 className="font-semibold">Recent Activity</h2>
              </div>
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
