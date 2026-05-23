// app/datatable-demo/page.tsx
"use client";

import { DataTable } from "@/components/datatable/data-table";
import {
  textColumn,
  numberColumn,
  currencyColumn,
  dateColumn,
  statusColumn,
  selectionColumn,
  actionColumn,
} from "@/lib/table-columns";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DashboardCard } from "@/components/cards/dashboard-card";

// Mock data type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
}

// Mock data
const mockData: Product[] = [
  {
    id: 1,
    name: "Laptop Pro",
    category: "Electronics",
    price: 15000000,
    stock: 45,
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    category: "Accessories",
    price: 250000,
    stock: 120,
    status: "active",
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 850000,
    stock: 30,
    status: "active",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: 4,
    name: 'Monitor 24"',
    category: "Electronics",
    price: 2800000,
    stock: 15,
    status: "draft",
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: 5,
    name: "USB Cable",
    category: "Accessories",
    price: 50000,
    stock: 500,
    status: "inactive",
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: 6,
    name: "Webcam HD",
    category: "Electronics",
    price: 750000,
    stock: 25,
    status: "active",
    createdAt: "2024-02-20T00:00:00Z",
  },
  {
    id: 7,
    name: "Headset Gaming",
    category: "Accessories",
    price: 450000,
    stock: 60,
    status: "active",
    createdAt: "2024-02-25T00:00:00Z",
  },
  {
    id: 8,
    name: "External HDD 1TB",
    category: "Storage",
    price: 1200000,
    stock: 40,
    status: "draft",
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: 9,
    name: "SSD 512GB",
    category: "Storage",
    price: 950000,
    stock: 35,
    status: "active",
    createdAt: "2024-03-05T00:00:00Z",
  },
  {
    id: 10,
    name: "Power Bank 20000mAh",
    category: "Accessories",
    price: 350000,
    stock: 80,
    status: "inactive",
    createdAt: "2024-03-10T00:00:00Z",
  },
];

export default function DataTableDemoPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Ubah ke 10 untuk lebih nyaman

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mockData.length / pageSize);

  const statusConfig = {
    active: { label: "Active", variant: "default" as const },
    inactive: { label: "Inactive", variant: "secondary" as const },
    draft: { label: "Draft", variant: "outline" as const },
  };

  const columns: ColumnDef<Product>[] = [
    selectionColumn<Product>(),
    textColumn("name", "Product Name", {
      sortable: true,
      filterable: true,
      width: 180,
      minWidth: 150,
    }),
    textColumn("category", "Category", {
      sortable: true,
      filterable: true,
      width: 120,
      minWidth: 100,
    }),
    currencyColumn("price", "Price", {
      sortable: true,
      width: 150,
    }),
    numberColumn("stock", "Stock", {
      sortable: true,
      width: 100,
    }),
    statusColumn("status", "Status", statusConfig, {
      sortable: true,
      width: 110,
    }),
    dateColumn("createdAt", "Created Date", {
      sortable: true,
      width: 130,
    }),
    actionColumn((row: Product) => [
      {
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => toast.info(`Viewing ${row.name}`),
      },
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => toast.info(`Editing ${row.name}`),
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => toast.error(`Deleted ${row.name}`),
        variant: "destructive" as const,
      },
    ]),
  ];

  const handleSelectionChange = (selectedRows: Product[]) => {
    console.log("Selected rows:", selectedRows);
    toast.success(`Selected ${selectedRows.length} items`);
  };

  const handleExport = () => {
    console.log("Exporting data:", mockData);
    toast.success("Export started");
  };

  return (
    <DashboardCard
      title="DataTable Component Demo"
      description="High-performance data table with sorting, filtering, pagination, and selection"
      fullWidth
    >
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={false}
        pagination={{
          currentPage,
          pageSize,
          totalPages,
          totalItems: mockData.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
        sorting={{ enabled: true }}
        filtering={{ enabled: true }}
        selection={{
          enabled: true,
          onSelectionChange: handleSelectionChange,
        }}
        export={{
          enabled: true,
          onExport: handleExport,
        }}
        actions={{
          onRowClick: (row) => console.log("Row clicked:", row),
        }}
        emptyMessage="No products found"
      />

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Current State:</h3>
        <div className="text-sm space-y-1">
          <p>
            Page: {currentPage} of {totalPages}
          </p>
          <p>Page Size: {pageSize}</p>
          <p>Total Items: {mockData.length}</p>
          <p>
            Showing: {startIndex + 1} to {Math.min(endIndex, mockData.length)}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
