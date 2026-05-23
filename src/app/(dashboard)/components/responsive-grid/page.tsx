// app/responsive-grid-demo/page.tsx
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveGrid } from "@/components/responsive-grid/responsive-grid";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Heart,
  Camera,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
} from "lucide-react";

// Sample product data
const products = [
  {
    id: 1,
    name: "Laptop Pro",
    price: 1299,
    category: "Electronics",
    image: "💻",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smartphone X",
    price: 899,
    category: "Electronics",
    image: "📱",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 199,
    category: "Audio",
    image: "🎧",
    rating: 4.3,
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 299,
    category: "Wearables",
    image: "⌚",
    rating: 4.2,
  },
  {
    id: 5,
    name: "4K Camera",
    price: 499,
    category: "Photography",
    image: "📷",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Gaming Mouse",
    price: 59,
    category: "Accessories",
    image: "🖱️",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Mechanical Keyboard",
    price: 129,
    category: "Accessories",
    image: "⌨️",
    rating: 4.7,
  },
  {
    id: 8,
    name: "Tablet Pro",
    price: 649,
    category: "Electronics",
    image: "📟",
    rating: 4.5,
  },
  {
    id: 9,
    name: "Bluetooth Speaker",
    price: 89,
    category: "Audio",
    image: "🔊",
    rating: 4.1,
  },
  {
    id: 10,
    name: "Fitness Tracker",
    price: 79,
    category: "Wearables",
    image: "🏃",
    rating: 4.0,
  },
  {
    id: 11,
    name: "External SSD",
    price: 159,
    category: "Storage",
    image: "💾",
    rating: 4.6,
  },
  {
    id: 12,
    name: "USB Hub",
    price: 39,
    category: "Accessories",
    image: "🔌",
    rating: 4.3,
  },
];

// Sample icons for icon grid
const icons = [
  { icon: Package, name: "Package" },
  { icon: ShoppingCart, name: "Cart" },
  { icon: Users, name: "Users" },
  { icon: TrendingUp, name: "Trending" },
  { icon: DollarSign, name: "Dollar" },
  { icon: Star, name: "Star" },
  { icon: Heart, name: "Heart" },
  { icon: Camera, name: "Camera" },
  { icon: Smartphone, name: "Phone" },
  { icon: Laptop, name: "Laptop" },
  { icon: Watch, name: "Watch" },
  { icon: Headphones, name: "Headphones" },
];

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="mb-3 text-4xl">{product.image}</div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IconCard({ icon: Icon, name }: { icon: any; name: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border p-4 transition-all duration-200 hover:shadow-md">
      <Icon className="h-8 w-8 text-primary" />
      <span className="mt-2 text-sm">{name}</span>
    </div>
  );
}

export default function ResponsiveGridDemoPage() {
  const [items, setItems] = React.useState(products.slice(0, 9));
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const handleLoadMore = () => {
    if (loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const currentCount = items.length;
      if (currentCount < products.length) {
        setItems(products.slice(0, currentCount + 3));
      }
      if (currentCount + 3 >= products.length) {
        setHasMore(false);
      }
      setLoadingMore(false);
      toast.info("Loaded more items");
    }, 1000);
  };

  const handleItemClick = (index: number, item: any) => {
    toast.info(`Clicked item ${index + 1}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Responsive Grid Components</h1>
          <p className="text-muted-foreground mt-1">
            Auto-responsive grid with customizable breakpoints and layouts
          </p>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Product Grid</TabsTrigger>
            <TabsTrigger value="icons">Icon Grid</TabsTrigger>
            <TabsTrigger value="auto-fit">Auto-Fit</TabsTrigger>
            <TabsTrigger value="infinite">Infinite Scroll</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Product Grid */}
          <TabsContent value="products">
            <DashboardCard title="Product Grid">
              <ResponsiveGrid
                columns={{
                  default: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                  xl: 5,
                }}
                gap={4}
                animated
                onItemClick={handleItemClick}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ResponsiveGrid>
            </DashboardCard>
          </TabsContent>

          {/* Icon Grid */}
          <TabsContent value="icons">
            <DashboardCard title="Icon Grid">
              <ResponsiveGrid
                columns={{
                  default: 2,
                  sm: 3,
                  md: 4,
                  lg: 6,
                  xl: 8,
                }}
                gap={4}
                animated
              >
                {icons.map((icon, index) => (
                  <IconCard key={index} icon={icon.icon} name={icon.name} />
                ))}
              </ResponsiveGrid>
            </DashboardCard>
          </TabsContent>

          {/* Auto-Fit Grid */}
          <TabsContent value="auto-fit">
            <DashboardCard title="Auto-Fit Grid (Responsive width)">
              <div className="mb-4 text-sm text-muted-foreground">
                <p>Items automatically adjust based on container width</p>
                <p>Min item width: 200px, Max: 300px</p>
              </div>
              <ResponsiveGrid
                autoFit
                minItemWidth={200}
                maxItemWidth={300}
                gap={16}
                animated
              >
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ResponsiveGrid>
            </DashboardCard>
          </TabsContent>

          {/* Infinite Scroll */}
          <TabsContent value="infinite">
            <DashboardCard title="Infinite Scroll Grid">
              <ResponsiveGrid
                columns={{
                  default: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                }}
                gap={4}
                animated
                loading={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onItemClick={handleItemClick}
              >
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ResponsiveGrid>

              {!hasMore && items.length >= products.length && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  No more items to load
                </div>
              )}
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-6">
              <DashboardCard title="Loading State">
                <ResponsiveGrid
                  columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
                  loading
                >
                  {[]}
                </ResponsiveGrid>
              </DashboardCard>

              <DashboardCard title="Empty State">
                <ResponsiveGrid
                  columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
                  empty
                  emptyMessage="No products found in this category"
                >
                  {[]}
                </ResponsiveGrid>
              </DashboardCard>

              <DashboardCard title="Custom Gap (8px)">
                <ResponsiveGrid
                  columns={{ default: 2, md: 4 }}
                  gap={2}
                  animated
                >
                  {products.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ResponsiveGrid>
              </DashboardCard>

              <DashboardCard title="Large Gap (16px)">
                <ResponsiveGrid
                  columns={{ default: 2, md: 4 }}
                  gap={4}
                  animated
                >
                  {products.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ResponsiveGrid>
              </DashboardCard>

              <DashboardCard title="Without Animation">
                <ResponsiveGrid
                  columns={{ default: 2, md: 4 }}
                  gap={4}
                  animated={false}
                >
                  {products.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ResponsiveGrid>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
