// app/datagrid-demo/page.tsx
"use client";

import { DataGrid } from "@/components/datagrid/data-grid";
import { ProductCard } from "@/components/datagrid/product-card";
import { useDataGrid } from "@/hooks/useDataGrid";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  rating?: number;
  image?: string;
}

interface FetchProductsParams {
  search?: string;
  category?: string;
  status?: string;
  page: number;
  limit: number;
}

// Mock fetch function dengan delay untuk demo
const fetchProducts = async (params: FetchProductsParams) => {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate mock data
  const categories = [
    "Electronics",
    "Accessories",
    "Storage",
    "Gaming",
    "Laptops",
    "Mobile",
  ];
  const statuses: ("active" | "inactive" | "draft")[] = [
    "active",
    "active",
    "active",
    "inactive",
    "draft",
  ];

  const mockData: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1} - ${
      ["Premium", "Pro", "Max", "Lite", "Plus"][i % 5]
    }`,
    category: categories[i % categories.length],
    price: Math.floor(Math.random() * 15000000) + 50000,
    stock: Math.floor(Math.random() * 500),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    rating: Number((Math.random() * 4 + 1).toFixed(1)),
    image: undefined, // Bisa ditambahkan URL gambar jika ada
  }));

  // Apply filters
  let filteredData = [...mockData];

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredData = filteredData.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
  }

  if (params.category && params.category !== "all") {
    filteredData = filteredData.filter((p) => p.category === params.category);
  }

  if (params.status && params.status !== "all") {
    filteredData = filteredData.filter((p) => p.status === params.status);
  }

  // Apply pagination
  const start = (params.page - 1) * params.limit;
  const end = start + params.limit;
  const paginatedData = filteredData.slice(start, end);

  return {
    data: paginatedData,
    total: filteredData.length,
  };
};

export default function DataGridDemoPage() {
  const { data, total, loading, error, pagination, search, filters } =
    useDataGrid<Product>({
      queryKey: ["products-grid"],
      fetchFn: fetchProducts,
      initialPageSize: 12,
      enableSearch: true,
    });

  const handleViewProduct = (product: Product) => {
    toast.info(`Viewing ${product.name}`, {
      description: `Category: ${product.category} | Price: ${formatPrice(
        product.price
      )}`,
    });
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`Added to cart`, {
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleWishlist = (product: Product) => {
    toast.success(`Added to wishlist`, {
      description: `${product.name} has been added to your wishlist`,
    });
  };

  const handleSelectionChange = (selectedItems: Product[]) => {
    console.log("Selected items:", selectedItems);
    if (selectedItems.length > 0) {
      toast.info(`Selected ${selectedItems.length} items`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Custom filters component
  const filtersComponent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Filter Products</h4>
        <button
          onClick={filters.reset}
          className="text-xs text-primary hover:underline"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Category</label>
          <Select
            value={filters.values.category || "all"}
            onValueChange={(value) =>
              filters.onFilterChange(
                "category",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Storage">Storage</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Laptops">Laptops</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Status</label>
          <Select
            value={filters.values.status || "all"}
            onValueChange={(value) =>
              filters.onFilterChange(
                "status",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.values.category || filters.values.status) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.values.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
              Category: {filters.values.category}
              <button
                onClick={() => filters.onFilterChange("category", undefined)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </span>
          )}
          {filters.values.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
              Status: {filters.values.status}
              <button
                onClick={() => filters.onFilterChange("status", undefined)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Loading state dengan skeleton yang lebih baik
  if (loading && data.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <DashboardCard title="Product Grid" description="Loading products...">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-square mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <DashboardCard
        title="Product Catalog"
        description="Browse and manage your products"
      >
        <DataGrid
          data={data}
          renderCard={(product: Product) => (
            <ProductCard
              product={product}
              variant="default"
              onView={handleViewProduct}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
            />
          )}
          loading={loading}
          error={error || undefined}
          pagination={pagination}
          filtering={{
            enabled: true,
            searchPlaceholder: "Search products by name or category...",
            onSearch: search.onSearch,
            filters: filtersComponent,
          }}
          selection={{
            enabled: true,
            onSelectionChange: handleSelectionChange,
            getItemId: (item) => item.id,
          }}
          gridConfig={{
            columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 4, "2xl": 6 },
            gap: 16,
            cardMinWidth: 250,
            cardMaxWidth: 350,
          }}
          emptyMessage="No products found"
          emptyIcon={<Package className="h-12 w-12 text-muted-foreground" />}
        />

        {/* Info Panel */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-2 text-sm">System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Total Products:</span>
              <p className="font-medium">{total}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Current Page:</span>
              <p className="font-medium">
                {pagination.currentPage} / {pagination.totalPages}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Page Size:</span>
              <p className="font-medium">{pagination.pageSize} items</p>
            </div>
            <div>
              <span className="text-muted-foreground">Showing:</span>
              <p className="font-medium">
                {(pagination.currentPage - 1) * pagination.pageSize + 1} -{" "}
                {Math.min(pagination.currentPage * pagination.pageSize, total)}
              </p>
            </div>
          </div>

          {(search.term ||
            filters.values.category ||
            filters.values.status) && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-muted-foreground text-xs">
                Active Filters:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {search.term && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                    Search: {search.term}
                  </span>
                )}
                {filters.values.category && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                    Category: {filters.values.category}
                  </span>
                )}
                {filters.values.status && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                    Status: {filters.values.status}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
