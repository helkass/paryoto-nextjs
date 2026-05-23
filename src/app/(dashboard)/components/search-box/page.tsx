// app/search-box-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSearchBoxField } from "@/components/form/form-search-box-field";
import { FormSearchBox } from "@/components/search-box/form-search-box";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";
import { Package } from "lucide-react";
import { SearchSuggestion } from "@/types/search-box.types";

const formSchema = z.object({
  search: z.string().optional(),
  productSearch: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Static suggestions
const staticSuggestions: SearchSuggestion[] = [
  {
    id: 1,
    label: "Laptop Pro",
    description: "High-performance laptop",
    category: "Electronics",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: 2,
    label: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    category: "Accessories",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: 3,
    label: "Mechanical Keyboard",
    description: "RGB mechanical keyboard",
    category: "Accessories",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: 4,
    label: "4K Monitor",
    description: "27-inch 4K display",
    category: "Electronics",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: 5,
    label: "USB-C Hub",
    description: "7-in-1 multiport adapter",
    category: "Accessories",
    icon: <Package className="h-4 w-4" />,
  },
];

// Mock async fetch function
const fetchProductSuggestions = async (
  query: string
): Promise<SearchSuggestion[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const products = [
    {
      id: 1,
      label: "Laptop Pro X",
      description: "Latest model with M3 chip",
      category: "Electronics",
    },
    {
      id: 2,
      label: "Laptop Air",
      description: "Ultra-thin lightweight laptop",
      category: "Electronics",
    },
    {
      id: 3,
      label: "Gaming Laptop",
      description: "High-performance gaming laptop",
      category: "Electronics",
    },
    {
      id: 4,
      label: "Wireless Mouse Pro",
      description: "Precision tracking mouse",
      category: "Accessories",
    },
    {
      id: 5,
      label: "Bluetooth Keyboard",
      description: "Wireless mechanical keyboard",
      category: "Accessories",
    },
    {
      id: 6,
      label: "USB-C Monitor",
      description: "4K USB-C monitor with charging",
      category: "Electronics",
    },
  ];

  return products
    .filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    .map((p) => ({
      id: p.id,
      label: p.label,
      description: p.description,
      category: p.category,
      icon: <Package className="h-4 w-4" />,
    }));
};

export default function SearchBoxDemoPage() {
  const [searchValue, setSearchValue] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      productSearch: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success(`Searched: ${data.search || data.productSearch}`);
  };

  const handleSearch = (query: string) => {
    toast.info(`Searching for: ${query}`);
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    toast.success(`Selected: ${suggestion.label}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search Box Components</h1>
          <p className="text-muted-foreground mt-1">
            Search input with suggestions, recent searches, and async fetching
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="async">Async Search</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic">
            <DashboardCard title="Basic Search Box">
              <div className="space-y-6">
                <FormSearchBox
                  label="Search"
                  description="Enter your search query"
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={handleSearch}
                  placeholder="Search..."
                  clearable
                />

                <FormSearchBox
                  label="Disabled Search"
                  value="Disabled"
                  disabled
                  placeholder="Disabled search"
                />

                <FormSearchBox
                  label="Read-only Search"
                  value="Read-only value"
                  readOnly
                  placeholder="Read-only search"
                />

                <FormSearchBox
                  label="Loading State"
                  loading
                  placeholder="Loading..."
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Suggestions */}
          <TabsContent value="suggestions">
            <DashboardCard title="Search with Suggestions">
              <div className="space-y-6">
                <FormSearchBox
                  label="Product Search"
                  description="Search with static suggestions"
                  suggestions={staticSuggestions}
                  placeholder="Search products..."
                  onSearch={handleSearch}
                  onSelectSuggestion={handleSelectSuggestion}
                  showRecentSearches
                />

                <FormSearchBox
                  label="Search with Min Chars"
                  description="Type at least 2 characters to see suggestions"
                  suggestions={staticSuggestions}
                  minChars={2}
                  placeholder="Type at least 2 characters..."
                />

                <FormSearchBox
                  label="Without Recent Searches"
                  suggestions={staticSuggestions}
                  showRecentSearches={false}
                  placeholder="Search without history..."
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Async Search */}
          <TabsContent value="async">
            <DashboardCard title="Async Search with API">
              <div className="space-y-6">
                <FormSearchBox
                  label="Product Search (API)"
                  description="Search products from mock API"
                  fetchSuggestions={fetchProductSuggestions}
                  placeholder="Search products..."
                  onSearch={handleSearch}
                  onSelectSuggestion={handleSelectSuggestion}
                  debounceDelay={300}
                />

                <FormSearchBox
                  label="Search with Custom Delay"
                  description="Debounced search with 500ms delay"
                  fetchSuggestions={fetchProductSuggestions}
                  debounceDelay={500}
                  placeholder="Type slowly to see debounce effect..."
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Search Box with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormSearchBoxField
                    control={form.control}
                    name="search"
                    label="General Search"
                    description="Search across all content"
                    placeholder="Search everything..."
                    suggestions={staticSuggestions}
                    onSearch={handleSearch}
                    showRecentSearches
                  />

                  <FormSearchBoxField
                    control={form.control}
                    name="productSearch"
                    label="Product Search"
                    description="Search products only"
                    placeholder="Search products..."
                    fetchSuggestions={fetchProductSuggestions}
                    onSelectSuggestion={handleSelectSuggestion}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Search</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Form Values */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Form Values</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>General Search:</span>
                    <span className="font-mono">
                      {form.watch("search") || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product Search:</span>
                    <span className="font-mono">
                      {form.watch("productSearch") || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
