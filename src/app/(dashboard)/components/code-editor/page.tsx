"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor/code-editor";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { FormCodeEditorField } from "@/components/form/form-code-editor-field";

const formSchema = z.object({
  jsonConfig: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid JSON format" }
  ),
  script: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const sampleJSON = {
  name: "My Application",
  version: "1.0.0",
  settings: {
    theme: "dark",
    language: "en",
    notifications: true,
  },
  features: ["dashboard", "analytics", "reports"],
};

const sampleJavaScript = `// Sample JavaScript code
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const products = [
  { name: "Laptop", price: 999 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 }
];

console.log(calculateTotal(products));`;

export default function CodeEditorDemoPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jsonConfig: JSON.stringify(sampleJSON, null, 2),
      script: sampleJavaScript,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    toast.success("Form submitted successfully");

    // Parse JSON to show it's valid
    if (data.jsonConfig) {
      const parsed = JSON.parse(data.jsonConfig);
      console.log("Parsed JSON:", parsed);
    }
  };

  const handleCustomFormat = (code: string) => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, 4);
    } catch {
      return code;
    }
  };

  const handleCustomValidate = (code: string) => {
    try {
      const parsed = JSON.parse(code);
      if (parsed.version && typeof parsed.version !== "string") {
        return { valid: false, error: "Version must be a string" };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Code Editor Components</h1>
          <p className="text-muted-foreground mt-1">
            Code editor with syntax highlighting for JSON, JavaScript, and more
          </p>
        </div>

        <Tabs defaultValue="json">
          <TabsList className="mb-6">
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript Editor</TabsTrigger>
            <TabsTrigger value="form">With Form</TabsTrigger>
            <TabsTrigger value="features">All Features</TabsTrigger>
          </TabsList>

          {/* JSON Editor */}
          <TabsContent value="json">
            <DashboardCard title="JSON Editor">
              <div className="space-y-6">
                <CodeEditor
                  label="Configuration JSON"
                  description="Edit your JSON configuration with real-time validation"
                  language="json"
                  value={JSON.stringify(sampleJSON, null, 2)}
                  onChange={(value) => console.log("JSON changed:", value)}
                  jsonValidation
                  showCopyButton
                  showFormatButton
                  minHeight={300}
                />

                <CodeEditor
                  label="Read-only JSON Viewer"
                  language="json"
                  value={JSON.stringify(sampleJSON, null, 2)}
                  readOnly
                  showCopyButton
                  showFormatButton={false}
                  minHeight={200}
                />
              </div>
            </DashboardCard>
          </TabsContent>

          {/* JavaScript Editor */}
          <TabsContent value="javascript">
            <DashboardCard title="JavaScript Editor">
              <CodeEditor
                label="JavaScript Code"
                description="Write and test your JavaScript code"
                language="javascript"
                value={sampleJavaScript}
                onChange={(value) => console.log("JavaScript changed:", value)}
                showCopyButton
                showFormatButton
                showResetButton
                minHeight={400}
                lineNumbers
              />
            </DashboardCard>
          </TabsContent>

          {/* With Form */}
          <TabsContent value="form">
            <DashboardCard title="Code Editor with Form">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormCodeEditorField
                    control={form.control}
                    name="jsonConfig"
                    label="JSON Configuration"
                    description="Enter valid JSON configuration"
                    required
                    language="json"
                    jsonValidation
                    showCopyButton
                    showFormatButton
                    minHeight={250}
                  />

                  <FormCodeEditorField
                    control={form.control}
                    name="script"
                    label="JavaScript Script"
                    description="Optional script to run"
                    language="javascript"
                    showCopyButton
                    showFormatButton
                    minHeight={200}
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
            </DashboardCard>
          </TabsContent>

          {/* All Features */}
          <TabsContent value="features">
            <DashboardCard title="All Features">
              <div className="space-y-6">
                <CodeEditor
                  label="Custom Validation"
                  description="JSON with custom validation rules"
                  language="json"
                  value={JSON.stringify(sampleJSON, null, 2)}
                  jsonValidation
                  onValidate={handleCustomValidate}
                  onFormat={handleCustomFormat}
                  showCopyButton
                  showFormatButton
                  showResetButton
                  showMinimizeButton
                  minHeight={300}
                  lineNumbers
                />

                <CodeEditor
                  label="SQL Editor"
                  language="sql"
                  value={`SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;`}
                  showCopyButton
                  minHeight={250}
                  lineNumbers
                />

                <CodeEditor
                  label="YAML Editor"
                  language="yaml"
                  value={`app:
  name: MyApp
  version: 1.0.0
  environment: production

database:
  host: localhost
  port: 5432
  name: mydb
  pool:
    min: 5
    max: 20

features:
  - name: authentication
    enabled: true
  - name: caching
    enabled: false
    config:
      ttl: 3600`}
                  showCopyButton
                  showFormatButton
                  minHeight={300}
                  lineNumbers
                />

                <CodeEditor
                  label="HTML Editor"
                  language="html"
                  value={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello World</h1>
    <p>This is a sample HTML document.</p>
  </div>
</body>
</html>`}
                  showCopyButton
                  minHeight={350}
                  lineNumbers
                />

                <CodeEditor
                  label="CSS Editor"
                  language="css"
                  value={`/* Main Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  color: white;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Button Styles */
.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.button-primary {
  background: #3b82f6;
  color: white;
}

.button-primary:hover {
  background: #2563eb;
}`}
                  showCopyButton
                  minHeight={350}
                  lineNumbers
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
