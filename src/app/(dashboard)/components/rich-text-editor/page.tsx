// app/rich-text-editor-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { FormRichTextEditorField } from "@/components/form/form-rich-text-editor-field";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const mockImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 1000);
  });
};

export default function RichTextEditorDemoPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description:
        "<p>This is a sample description with <strong>bold text</strong> and <em>italic text</em>.</p>",
      content: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rich Text Editor</h1>
          <p className="text-muted-foreground mt-1">
            WYSIWYG editor with TipTap, image upload, and formatting tools
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Editor</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="features">All Features</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <DashboardCard title="Basic Rich Text Editor">
              <RichTextEditor
                label="Description"
                description="Basic editor with common formatting options"
                placeholder="Write something amazing..."
                onImageUpload={mockImageUpload}
                showCharCount
                maxLength={500}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="form">
            <DashboardCard title="Rich Text Editor with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormRichTextEditorField
                    control={form.control}
                    name="description"
                    label="Product Description"
                    description="Detailed description of your product"
                    required
                    placeholder="Enter product description..."
                    onImageUpload={mockImageUpload}
                    showCharCount
                    maxLength={1000}
                    minHeight={300}
                  />

                  <FormRichTextEditorField
                    control={form.control}
                    name="content"
                    label="Additional Content (Optional)"
                    placeholder="Write additional content here..."
                    onImageUpload={mockImageUpload}
                    minHeight={200}
                  />

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DashboardCard>
          </TabsContent>

          <TabsContent value="features">
            <DashboardCard title="All Features">
              <RichTextEditor
                label="Full Featured Editor"
                description="Complete WYSIWYG editor with all formatting options"
                placeholder="Start writing..."
                features={{
                  heading: { levels: [1, 2, 3, 4] },
                  bold: true,
                  italic: true,
                  underline: true,
                  strike: true,
                  bulletList: true,
                  orderedList: true,
                  taskList: true,
                  blockquote: true,
                  code: true,
                  codeBlock: true,
                  link: true,
                  image: true,
                  horizontalRule: true,
                  clearFormatting: true,
                  undoRedo: true,
                  textAlign: true,
                  highlight: true,
                }}
                onImageUpload={mockImageUpload}
                minHeight={400}
                showCharCount
              />
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
