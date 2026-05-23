// app/infinite-scroll-demo/page.tsx
"use client";

import { useState } from "react";
import { InfiniteScroll } from "@/components/infinite-scroll/infinite-scroll";
import { NotificationItem } from "@/components/infinite-scroll/notification-item";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { Bell, MessageSquare, Package } from "lucide-react";

interface Notification {
  id: number;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Generate mock data
const generateMockData = (page: number, pageSize: number): Notification[] => {
  const types: ("info" | "success" | "warning" | "error")[] = [
    "info",
    "success",
    "warning",
    "error",
  ];
  const titles = [
    "New order received",
    "Payment successful",
    "Low stock alert",
    "New user registered",
    "System update",
    "Security alert",
    "Maintenance scheduled",
    "Feature released",
  ];
  const messages = [
    "Customer #12345 has placed a new order for $299.99",
    "Your payment of $1,299.99 has been processed successfully",
    'Product "Wireless Mouse" is running low on stock (5 remaining)',
    "A new user has joined the platform",
    "System will be updated on Friday at 2 AM",
    "Unusual login detected from new device",
    "Scheduled maintenance in 2 hours",
    "New feature: Dark mode is now available",
  ];

  return Array.from({ length: pageSize }, (_, i) => ({
    id: (page - 1) * pageSize + i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    read: Math.random() > 0.7,
  }));
};

// Mock API call
const fetchNotifications = async (
  page: number
): Promise<{
  data: Notification[];
  hasMore: boolean;
  total: number;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const pageSize = 10;
  const totalItems = 50;
  const hasMore = page * pageSize < totalItems;

  const data = generateMockData(page, pageSize);

  return {
    data,
    hasMore,
    total: totalItems,
  };
};

// Product type for product demo
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

const fetchProducts = async (
  page: number
): Promise<{
  data: Product[];
  hasMore: boolean;
  total: number;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const pageSize = 12;
  const totalItems = 100;
  const hasMore = page * pageSize < totalItems;

  const categories = ["Electronics", "Accessories", "Gaming", "Laptops"];
  const data: Product[] = Array.from({ length: pageSize }, (_, i) => ({
    id: (page - 1) * pageSize + i + 1,
    name: `Product ${(page - 1) * pageSize + i + 1}`,
    price: Math.floor(Math.random() * 1500000) + 50000,
    category: categories[Math.floor(Math.random() * categories.length)],
  }));

  return { data, hasMore, total: totalItems };
};

export default function InfiniteScrollDemoPage() {
  const [readNotifications, setReadNotifications] = useState<Set<number>>(
    new Set()
  );

  const handleNotificationRead = (id: number) => {
    setReadNotifications((prev) => new Set([...prev, id]));
    toast.success("Notification marked as read");
  };

  const handleLoadMore = (page: number) => {
    console.log(`Loading page ${page}`);
  };

  const handleEnd = () => {
    console.log("Reached the end");
    toast.info("You have reached the end of notifications");
  };

  const handleError = (error: Error) => {
    console.error("Error loading more:", error);
    toast.error("Failed to load more data");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Infinite Scroll Demo</h1>
        <p className="text-muted-foreground mt-1">
          Seamless infinite scrolling with loading states and error handling
        </p>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList className="mb-6">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="virtual">
            <MessageSquare className="h-4 w-4 mr-2" />
            Virtual Scroll
          </TabsTrigger>
        </TabsList>

        {/* Notifications Example */}
        <TabsContent value="notifications">
          <DashboardCard
            title="Notifications"
            description="Real-time notifications with infinite scroll"
          >
            <InfiniteScroll
              fetchMore={fetchNotifications}
              renderItem={(notification: Notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={{
                    ...notification,
                    read: readNotifications.has(notification.id),
                  }}
                  onRead={handleNotificationRead}
                />
              )}
              threshold={200}
              debounceDelay={100}
              onLoadMore={handleLoadMore}
              onEnd={handleEnd}
              onError={handleError}
            />
          </DashboardCard>
        </TabsContent>

        {/* Products Grid Example */}
        <TabsContent value="products">
          <DashboardCard
            title="Products"
            description="Infinite scroll products grid"
          >
            <InfiniteScroll
              fetchMore={fetchProducts}
              renderItem={(product: Product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{product.id}
                    </div>
                  </div>
                </div>
              )}
              threshold={300}
              pageSize={12}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            />
          </DashboardCard>
        </TabsContent>

        {/* Virtual Scroll Example - Will be implemented later */}
        <TabsContent value="virtual">
          <DashboardCard
            title="Coming Soon"
            description="Virtual scroll with infinite loading"
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Virtual scroll with infinite loading coming soon...
              </p>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>

      {/* Info Panel */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Features Demonstrated:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Infinite scrolling with intersection observer</li>
              <li>Loading states and skeleton loaders</li>
              <li>Error handling with retry capability</li>
              <li>Customizable loading/error/end components</li>
              <li>Debounced load more calls</li>
            </ul>
          </div>
          <div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Configurable threshold for trigger</li>
              <li>Initial delay support</li>
              <li>Reset and refetch capabilities</li>
              <li>Responsive grid layouts</li>
              <li>Dark mode support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
