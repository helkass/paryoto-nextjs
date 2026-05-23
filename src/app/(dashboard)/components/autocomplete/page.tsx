// app/autocomplete-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormAutoComplete } from "@/components/autocomplete/form-autocomplete";
import { DashboardCard } from "@/components/cards/dashboard-card";
import { FormAutoCompleteField } from "@/components/form/form-autocomplete-field";
import { AutoCompleteOption } from "@/types/autocomplete.types";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Search,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  user: z.string().optional(),
  product: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Static options
const countryOptions = [
  {
    value: "id",
    label: "Indonesia",
    description: "Southeast Asia",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "us",
    label: "United States",
    description: "North America",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "gb",
    label: "United Kingdom",
    description: "Europe",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "jp",
    label: "Japan",
    description: "East Asia",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "kr",
    label: "South Korea",
    description: "East Asia",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "cn",
    label: "China",
    description: "East Asia",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "in",
    label: "India",
    description: "South Asia",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "au",
    label: "Australia",
    description: "Oceania",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "de",
    label: "Germany",
    description: "Europe",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    value: "fr",
    label: "France",
    description: "Europe",
    icon: <MapPin className="h-4 w-4" />,
  },
];

const groupedOptions = [
  {
    label: "Team Members",
    options: [
      {
        value: "john",
        label: "John Doe",
        description: "john@example.com",
        icon: <User className="h-4 w-4" />,
      },
      {
        value: "jane",
        label: "Jane Smith",
        description: "jane@example.com",
        icon: <User className="h-4 w-4" />,
      },
      {
        value: "bob",
        label: "Bob Johnson",
        description: "bob@example.com",
        icon: <User className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Recent Contacts",
    options: [
      {
        value: "alice",
        label: "Alice Brown",
        description: "alice@example.com",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        value: "charlie",
        label: "Charlie Wilson",
        description: "charlie@example.com",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        value: "diana",
        label: "Diana Prince",
        description: "diana@example.com",
        icon: <Mail className="h-4 w-4" />,
      },
    ],
  },
];

// Mock async fetch function
const fetchUsers = async (search: string): Promise<AutoCompleteOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = [
    {
      value: "john_doe",
      label: "John Doe",
      description: "john.doe@example.com",
      icon: <User className="h-4 w-4" />,
    },
    {
      value: "jane_smith",
      label: "Jane Smith",
      description: "jane.smith@example.com",
      icon: <User className="h-4 w-4" />,
    },
    {
      value: "bob_wilson",
      label: "Bob Wilson",
      description: "bob.wilson@example.com",
      icon: <User className="h-4 w-4" />,
    },
    {
      value: "alice_brown",
      label: "Alice Brown",
      description: "alice.brown@example.com",
      icon: <User className="h-4 w-4" />,
    },
    {
      value: "charlie_davis",
      label: "Charlie Davis",
      description: "charlie.davis@example.com",
      icon: <User className="h-4 w-4" />,
    },
  ];

  return users.filter(
    (user) =>
      user.label.toLowerCase().includes(search.toLowerCase()) ||
      user.value.toLowerCase().includes(search.toLowerCase())
  );
};

const fetchProducts = async (search: string): Promise<AutoCompleteOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const products = [
    {
      value: "laptop_pro",
      label: "Laptop Pro",
      description: "High-performance laptop",
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: "wireless_mouse",
      label: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: "mechanical_keyboard",
      label: "Mechanical Keyboard",
      description: "RGB mechanical keyboard",
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: "usb_cable",
      label: "USB-C Cable",
      description: "Fast charging cable",
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: "monitor_4k",
      label: "4K Monitor",
      description: "27-inch 4K display",
      icon: <Package className="h-4 w-4" />,
    },
  ];

  return products.filter(
    (product) =>
      product.label.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );
};

export default function AutoCompleteDemoPage() {
  const [selectedCountry, setSelectedCountry] = useState("id");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "id",
      user: "",
      product: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AutoComplete Components</h1>
          <p className="text-muted-foreground mt-1">
            Searchable dropdown with debounced search and keyboard navigation
          </p>
        </div>

        <Tabs defaultValue="static">
          <TabsList className="mb-6">
            <TabsTrigger value="static">Static Options</TabsTrigger>
            <TabsTrigger value="grouped">Grouped Options</TabsTrigger>
            <TabsTrigger value="async">Async Search</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Static Options */}
          <TabsContent value="static">
            <DashboardCard title="Static Options">
              <div className="space-y-6">
                <FormAutoComplete
                  label="Country"
                  description="Select a country from the list"
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countryOptions}
                  placeholder="Search country..."
                  showIcon
                  showDescription
                  clearable
                />

                <FormAutoComplete
                  label="Country (No Icon)"
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countryOptions}
                  placeholder="Search country..."
                  showIcon={false}
                  clearable
                />

                <FormAutoComplete
                  label="Country (No Description)"
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countryOptions}
                  placeholder="Search country..."
                  showDescription={false}
                  clearable
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Grouped Options */}
          <TabsContent value="grouped">
            <DashboardCard title="Grouped Options">
              <FormAutoComplete
                label="Select Contact"
                description="Search for team members or recent contacts"
                value={selectedUser}
                onChange={setSelectedUser}
                options={groupedOptions}
                placeholder="Search contacts..."
                showIcon
                showDescription
                clearable
              />
            </DashboardCard>
          </TabsContent>

          {/* Async Search */}
          <TabsContent value="async">
            <DashboardCard title="Async Search">
              <div className="space-y-6">
                <FormAutoComplete
                  label="Search Users"
                  description="Type to search users (debounced 300ms)"
                  value={selectedUser}
                  onChange={setSelectedUser}
                  fetchOptions={fetchUsers}
                  placeholder="Search users..."
                  debounceDelay={300}
                  minChars={2}
                  showIcon
                  showDescription
                  clearable
                />

                <FormAutoComplete
                  label="Search Products"
                  description="Search products from API"
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  fetchOptions={fetchProducts}
                  placeholder="Search products..."
                  debounceDelay={300}
                  minChars={2}
                  showIcon
                  showDescription
                  clearable
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="AutoComplete with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormAutoCompleteField
                    control={form.control}
                    name="country"
                    label="Country"
                    description="Select your country"
                    required
                    options={countryOptions}
                    placeholder="Search country..."
                    showIcon
                    showDescription
                    clearable
                  />

                  <FormAutoCompleteField
                    control={form.control}
                    name="user"
                    label="Assign User"
                    description="Search and select a user"
                    fetchOptions={fetchUsers}
                    placeholder="Search users..."
                    debounceDelay={300}
                    minChars={2}
                    showIcon
                    showDescription
                    clearable
                  />

                  <FormAutoCompleteField
                    control={form.control}
                    name="product"
                    label="Product"
                    description="Search products"
                    fetchOptions={fetchProducts}
                    placeholder="Search products..."
                    debounceDelay={300}
                    minChars={2}
                    showIcon
                    showDescription
                    clearable
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
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

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">
                  Current Form Values:
                </h4>
                <div className="space-y-1 text-sm">
                  <p>Country: {form.watch("country")}</p>
                  <p>User: {form.watch("user") || "Not selected"}</p>
                  <p>Product: {form.watch("product") || "Not selected"}</p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <DashboardCard title="Additional Features">
              <div className="space-y-6">
                <FormAutoComplete
                  label="Disabled"
                  value="disabled"
                  disabled
                  options={countryOptions.slice(0, 3)}
                  placeholder="Disabled autocomplete"
                />

                <FormAutoComplete
                  label="Read Only"
                  value="readonly"
                  readOnly
                  options={countryOptions.slice(0, 3)}
                  placeholder="Read-only autocomplete"
                />

                <FormAutoComplete
                  label="With Error"
                  error="This field is required"
                  options={countryOptions.slice(0, 3)}
                  placeholder="Select an option"
                />

                <FormAutoComplete
                  label="Loading State"
                  loading
                  options={countryOptions.slice(0, 3)}
                  placeholder="Loading..."
                />

                <FormAutoComplete
                  label="Creatable"
                  description="Type and press Enter to create new option"
                  creatable
                  options={countryOptions.slice(0, 3)}
                  placeholder="Type to create..."
                  onCreate={(value) => toast.success(`Created: ${value}`)}
                />

                <FormAutoComplete
                  label="Custom Min Characters (3)"
                  description="Search requires at least 3 characters"
                  minChars={3}
                  options={countryOptions}
                  placeholder="Type at least 3 characters..."
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
