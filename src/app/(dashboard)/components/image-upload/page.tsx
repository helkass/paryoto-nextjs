// app/image-upload-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormImageUpload } from "@/components/image-upload/form-image-upload";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { ImageFile } from "@/types/image-upload.types";
import { FormImageUploadField } from "@/components/form/form-image-upload-field";

const imageSchema = z.object({
  profileImage: z
    .any()
    .refine(
      (val) => val !== null && val !== undefined,
      "Profile image is required"
    ),
  gallery: z.array(z.any()).optional(),
});

type ImageForm = z.infer<typeof imageSchema>;

const mockUpload = async (image: ImageFile): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://storage.example.com/${image.name}`);
    }, 2000);
  });
};

export default function ImageUploadDemoPage() {
  const form = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      profileImage: null,
      gallery: [],
    },
  });

  const onSubmit = (data: ImageForm) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Image Upload Components</h1>
          <p className="text-muted-foreground mt-1">
            Upload images with cropping, preview, and validation
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="mb-6">
            <TabsTrigger value="single">Single Image</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Images</TabsTrigger>
            <TabsTrigger value="crop">With Cropping</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <DashboardCard title="Single Image Upload">
              <FormImageUpload
                label="Profile Picture"
                description="Upload a profile picture (JPEG, PNG, max 5MB)"
                mode="single"
                accept={["image/jpeg", "image/png"]}
                maxSize={5 * 1024 * 1024}
                circularPreview
                showPreview
                onUpload={mockUpload}
                autoUpload
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="multiple">
            <DashboardCard title="Multiple Images Upload">
              <FormImageUpload
                label="Image Gallery"
                description="Upload up to 5 images (max 10MB each)"
                mode="multiple"
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
                showPreview
                showRemoveButton
                onUpload={mockUpload}
                autoUpload={false}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="crop">
            <DashboardCard title="Image Upload with Cropping">
              <FormImageUpload
                label="Upload with Crop"
                description="Upload and crop your image"
                mode="single"
                enableCrop
                cropAspect={1}
                cropShape="round"
                showCropButton
                onUpload={mockUpload}
              />
            </DashboardCard>
          </TabsContent>

          <TabsContent value="form">
            <DashboardCard title="With React Hook Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormImageUploadField
                    control={form.control}
                    name="profileImage"
                    label="Profile Image"
                    description="Required profile picture"
                    required
                    mode="single"
                    enableCrop
                    cropAspect={1}
                    cropShape="round"
                    circularPreview
                  />

                  <FormImageUploadField
                    control={form.control}
                    name="gallery"
                    label="Image Gallery (Optional)"
                    mode="multiple"
                    maxFiles={3}
                  />

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
