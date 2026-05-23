// app/tag-input-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormTagInputField } from "@/components/form/form-tag-input-field";
import { FormTagInput } from "@/components/tag-input/form-tag-input";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { useState } from "react";
import { Tag as TagIcon, Hash } from "lucide-react";
import { Tag } from "@/types/tag-input.types";

const formSchema = z.object({
  skills: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1, "Please add at least one skill"),
  categories: z.array(z.any()).optional(),
  tags: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Suggestions data
const skillSuggestions = [
  {
    id: "1",
    label: "React",
    value: "react",
    icon: <Hash className="h-3 w-3" />,
  },
  {
    id: "2",
    label: "TypeScript",
    value: "typescript",
    icon: <Hash className="h-3 w-3" />,
  },
  {
    id: "3",
    label: "Next.js",
    value: "nextjs",
    icon: <Hash className="h-3 w-3" />,
  },
  {
    id: "4",
    label: "Node.js",
    value: "nodejs",
    icon: <Hash className="h-3 w-3" />,
  },
  {
    id: "5",
    label: "Python",
    value: "python",
    icon: <Hash className="h-3 w-3" />,
  },
  { id: "6", label: "Java", value: "java", icon: <Hash className="h-3 w-3" /> },
  {
    id: "7",
    label: "GraphQL",
    value: "graphql",
    icon: <Hash className="h-3 w-3" />,
  },
  {
    id: "8",
    label: "Docker",
    value: "docker",
    icon: <Hash className="h-3 w-3" />,
  },
];

const categorySuggestions = [
  {
    id: "1",
    label: "Technology",
    value: "technology",
    icon: <TagIcon className="h-3 w-3" />,
  },
  {
    id: "2",
    label: "Design",
    value: "design",
    icon: <TagIcon className="h-3 w-3" />,
  },
  {
    id: "3",
    label: "Marketing",
    value: "marketing",
    icon: <TagIcon className="h-3 w-3" />,
  },
  {
    id: "4",
    label: "Sales",
    value: "sales",
    icon: <TagIcon className="h-3 w-3" />,
  },
  {
    id: "5",
    label: "Support",
    value: "support",
    icon: <TagIcon className="h-3 w-3" />,
  },
];

export default function TagInputDemoPage() {
  const [skills, setSkills] = useState<Tag[]>([
    { id: "1", label: "React", value: "react" },
    { id: "2", label: "TypeScript", value: "typescript" },
  ]);
  const [categories, setCategories] = useState<Tag[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: skills,
      categories: [],
      tags: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  const validateTag = (tag: string): boolean | string => {
    if (tag.length < 2) {
      return false;
    }
    if (!/^[a-zA-Z0-9\\s-]+$/.test(tag)) {
      return false;
    }
    return true;
  };

  const transformTag = (tag: string): string => {
    return tag.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tag Input Components</h1>
          <p className="text-muted-foreground mt-1">
            Multi-tag input with suggestions, validation, and limits
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="suggestions">With Suggestions</TabsTrigger>
            <TabsTrigger value="limits">With Limits</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic">
            <DashboardCard title="Basic Tag Input">
              <div className="space-y-6">
                <FormTagInput
                  label="Skills"
                  description="Add your skills (press Enter after each skill)"
                  value={skills}
                  onChange={setSkills}
                  placeholder="Type a skill and press Enter..."
                  allowCreate
                />

                <FormTagInput
                  label="Read-only Tags"
                  value={[
                    { id: "1", label: "React", value: "react" },
                    { id: "2", label: "TypeScript", value: "typescript" },
                    { id: "3", label: "Next.js", value: "nextjs" },
                  ]}
                  readOnly
                  placeholder="Read-only tags"
                />

                <FormTagInput
                  label="Disabled"
                  value={[{ id: "1", label: "Disabled", value: "disabled" }]}
                  disabled
                  placeholder="Disabled tag input"
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Suggestions */}
          <TabsContent value="suggestions">
            <DashboardCard title="Tag Input with Suggestions">
              <div className="space-y-6">
                <FormTagInput
                  label="Skills with Suggestions"
                  description="Select from suggestions or create your own"
                  value={skills}
                  onChange={setSkills}
                  suggestions={skillSuggestions}
                  placeholder="Type to see suggestions..."
                  allowCreate
                />

                <FormTagInput
                  label="Categories"
                  description="Select from category suggestions"
                  value={categories}
                  onChange={setCategories}
                  suggestions={categorySuggestions}
                  placeholder="Search categories..."
                  allowCreate={false}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Limits */}
          <TabsContent value="limits">
            <DashboardCard title="Tag Input with Limits">
              <div className="space-y-6">
                <FormTagInput
                  label="Max 3 Tags"
                  description="You can add up to 3 tags"
                  value={[]}
                  maxTags={3}
                  placeholder="Add up to 3 tags..."
                  allowCreate
                  showCount
                />

                <FormTagInput
                  label="Min 2 Tags Required"
                  description="At least 2 tags are required"
                  value={[]}
                  minTags={2}
                  placeholder="Add at least 2 tags..."
                  allowCreate
                />

                <FormTagInput
                  label="Max Length 10 Characters"
                  description="Each tag can have max 10 characters"
                  value={[]}
                  maxLength={10}
                  placeholder="Max 10 characters per tag..."
                  allowCreate
                />

                <FormTagInput
                  label="No Duplicates"
                  description="Duplicate tags are not allowed"
                  value={[]}
                  allowDuplicates={false}
                  placeholder="Cannot add duplicate tags..."
                  allowCreate
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Tag Input with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormTagInputField
                    control={form.control}
                    name="skills"
                    label="Required Skills"
                    description="Add your programming skills"
                    required
                    suggestions={skillSuggestions}
                    placeholder="Type a skill and press Enter..."
                    allowCreate
                    maxTags={5}
                    minTags={1}
                  />

                  <FormTagInputField
                    control={form.control}
                    name="categories"
                    label="Categories (Optional)"
                    description="Select or create categories"
                    suggestions={categorySuggestions}
                    placeholder="Add categories..."
                    allowCreate
                  />

                  <FormTagInputField
                    control={form.control}
                    name="tags"
                    label="Custom Validation"
                    description="Tags must be alphanumeric with hyphens"
                    placeholder="Add validated tags..."
                    allowCreate
                    validateTag={validateTag}
                    transformTag={transformTag}
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
                  <p>
                    Skills:{" "}
                    {form
                      .watch("skills")
                      ?.map((s) => s.label)
                      .join(", ") || "None"}
                  </p>
                  <p>
                    Categories:{" "}
                    {form
                      .watch("categories")
                      ?.map((c) => c.label)
                      .join(", ") || "None"}
                  </p>
                  <p>
                    Tags:{" "}
                    {form
                      .watch("tags")
                      ?.map((t) => t.label)
                      .join(", ") || "None"}
                  </p>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <DashboardCard title="Tag Variants">
              <div className="space-y-6">
                <FormTagInput
                  label="Default Variant"
                  value={[
                    { id: "1", label: "Default", value: "default" },
                    { id: "2", label: "Style", value: "style" },
                  ]}
                  variant="default"
                  placeholder="Default style"
                />

                <FormTagInput
                  label="Outline Variant"
                  value={[
                    { id: "1", label: "Outline", value: "outline" },
                    { id: "2", label: "Style", value: "style" },
                  ]}
                  variant="outline"
                  placeholder="Outline style"
                />

                <FormTagInput
                  label="Filled Variant"
                  value={[
                    { id: "1", label: "Filled", value: "filled" },
                    { id: "2", label: "Style", value: "style" },
                  ]}
                  variant="filled"
                  placeholder="Filled style"
                />

                <FormTagInput
                  label="Modern Variant"
                  value={[
                    { id: "1", label: "Modern", value: "modern" },
                    { id: "2", label: "Style", value: "style" },
                  ]}
                  variant="modern"
                  placeholder="Modern style"
                />

                <FormTagInput
                  label="Small Size"
                  value={[
                    { id: "1", label: "Small", value: "small" },
                    { id: "2", label: "Tag", value: "tag" },
                  ]}
                  size="sm"
                  placeholder="Small tags"
                />

                <FormTagInput
                  label="Large Size"
                  value={[
                    { id: "1", label: "Large", value: "large" },
                    { id: "2", label: "Tag", value: "tag" },
                  ]}
                  size="lg"
                  placeholder="Large tags"
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
