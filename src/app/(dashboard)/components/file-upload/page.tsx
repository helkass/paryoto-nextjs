// app/file-upload-demo/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormFileUpload } from "@/components/file-upload/form-file-upload";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { UploadedFile } from "@/types/file-upload.types";
import { FormFileUploadField } from "@/components/form/form-file-upload-field";

// Schema for validation
const singleFileSchema = z.object({
  singleFile: z
    .any()
    .refine((val) => val !== null && val !== undefined, "File is required"),
  multipleFiles: z.array(z.any()).optional(),
});

type SingleFileForm = z.infer<typeof singleFileSchema>;

// Mock upload function
const mockUpload = async (file: UploadedFile): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://storage.example.com/${file.name}`);
    }, 2000);
  });
};

export default function FileUploadDemoPage() {
  const form = useForm<SingleFileForm>({
    resolver: zodResolver(singleFileSchema),
    defaultValues: {
      singleFile: null,
      multipleFiles: [],
    },
  });

  const onSubmit = (data: SingleFileForm) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  const handleUpload = async (file: UploadedFile): Promise<string> => {
    toast.loading(`Uploading ${file.name}...`);
    const url = await mockUpload(file);
    toast.success(`${file.name} uploaded successfully`);
    return url;
  };

  const handleUploadProgress = (fileId: string, progress: number) => {
    console.log(`Upload progress for ${fileId}: ${progress}%`);
  };

  const handleUploadSuccess = (file: UploadedFile, url: string) => {
    console.log(`Uploaded ${file.name} to ${url}`);
  };

  const handleUploadError = (file: UploadedFile, error: Error) => {
    console.error(`Upload failed for ${file.name}:`, error);
    toast.error(`Failed to upload ${file.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">File Upload Components</h1>
          <p className="text-muted-foreground mt-1">
            Drag & drop file upload with preview and validation
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="mb-6">
            <TabsTrigger value="single">Single File</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Files</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Single File Upload */}
          <TabsContent value="single">
            <DashboardCard title="Single File Upload">
              <div className="space-y-6">
                <FormFileUpload
                  label="Profile Picture"
                  description="Upload a profile picture (max 5MB)"
                  mode="single"
                  accept={["image/jpeg", "image/png", "image/jpg"]}
                  maxSize={5 * 1024 * 1024}
                  showPreview
                  showSize
                  onUpload={handleUpload}
                  autoUpload
                />

                <FormFileUpload
                  label="Document Upload"
                  mode="single"
                  accept={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ]}
                  maxSize={10 * 1024 * 1024}
                  showPreview={false}
                  buttonLabel="Upload Document"
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Multiple Files Upload */}
          <TabsContent value="multiple">
            <DashboardCard title="Multiple Files Upload">
              <FormFileUpload
                label="Upload Files"
                description="Upload up to 5 files (max 10MB each)"
                mode="multiple"
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
                accept={["image/*", "application/pdf"]}
                showPreview
                showSize
                showRemoveButton
                onUpload={handleUpload}
                onUploadProgress={handleUploadProgress}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                buttonLabel="Upload All"
                autoUpload={false}
              />
            </DashboardCard>
          </TabsContent>

          {/* With React Hook Form */}
          <TabsContent value="form">
            <DashboardCard title="File Upload with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormFileUploadField
                    control={form.control}
                    name="singleFile"
                    label="Required Document"
                    description="Please upload your document"
                    required
                    mode="single"
                    accept={["application/pdf"]}
                    maxSize={5 * 1024 * 1024}
                    showPreview
                  />

                  <FormFileUploadField
                    control={form.control}
                    name="multipleFiles"
                    label="Additional Files (Optional)"
                    mode="multiple"
                    maxFiles={3}
                    maxSize={5 * 1024 * 1024}
                    showPreview
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Submit Form</Button>
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
            </DashboardCard>
          </TabsContent>

          {/* Advanced Features */}
          <TabsContent value="advanced">
            <DashboardCard title="Advanced Features">
              <div className="space-y-6">
                <FormFileUpload
                  label="Disabled Upload"
                  mode="single"
                  disabled
                  value={{
                    id: "1",
                    file: new File([], "sample.pdf"),
                    name: "sample.pdf",
                    size: 1024,
                    type: "application/pdf",
                    lastModified: Date.now(),
                    status: "success",
                  }}
                />

                <FormFileUpload
                  label="Read Only Mode"
                  mode="multiple"
                  readOnly
                  value={[
                    {
                      id: "1",
                      file: new File([], "file1.pdf"),
                      name: "file1.pdf",
                      size: 1024,
                      type: "application/pdf",
                      lastModified: Date.now(),
                      status: "success",
                    },
                    {
                      id: "2",
                      file: new File([], "file2.pdf"),
                      name: "file2.pdf",
                      size: 2048,
                      type: "application/pdf",
                      lastModified: Date.now(),
                      status: "success",
                    },
                  ]}
                  showDownloadButton
                />

                <FormFileUpload
                  label="With Custom Preview"
                  mode="multiple"
                  maxFiles={3}
                  renderPreview={(file, onRemove) => (
                    <div className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          📄
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={onRemove}>
                        Remove
                      </Button>
                    </div>
                  )}
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
