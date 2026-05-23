// app/split-layout-demo/page.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { SplitLayout } from "@/components/split-layout/split-layout";
import { DashboardCard } from "@/components/cards/dashboard-card";
import { toast } from "sonner";
import { Maximize2, Minimize2, RotateCcw, Settings } from "lucide-react";
import { SplitLayoutRef } from "@/types/split-layout.types";

// Code editor content
const htmlCode = `<div class="container">
  <h1>Hello World</h1>
  <p>This is a sample HTML content.</p>
  <button>Click me</button>
</div>`;

const cssCode = `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #3B82F6;
  font-size: 2rem;
}

button {
  background: #3B82F6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}`;

const jsCode = `document.querySelector('button').addEventListener('click', () => {
  alert('Button clicked!');
});`;

// Preview component
function PreviewPanel() {
  return (
    <div className="h-full p-4">
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-blue-600">Hello World</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This is a sample preview.
        </p>
        <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Click me
        </button>
      </div>
    </div>
  );
}

// Settings panel
function SettingsPanel() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <select id="theme" className="w-full rounded-md border p-2">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fontSize">Font Size</Label>
        <input
          type="range"
          min="12"
          max="20"
          defaultValue="14"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="autoSave">Auto Save</Label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoSave"
            defaultChecked
            className="h-4 w-4"
          />
          <span className="text-sm">Enable auto save</span>
        </div>
      </div>
    </div>
  );
}

// Content panel with tabs
function ContentPanel() {
  const [activeTab, setActiveTab] = React.useState("html");

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-2">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("html")}
            className={`px-3 py-2 text-sm transition-colors ${
              activeTab === "html"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab("css")}
            className={`px-3 py-2 text-sm transition-colors ${
              activeTab === "css"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab("js")}
            className={`px-3 py-2 text-sm transition-colors ${
              activeTab === "js"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            JavaScript
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Textarea
          value={
            activeTab === "html"
              ? htmlCode
              : activeTab === "css"
              ? cssCode
              : jsCode
          }
          readOnly
          className="font-mono text-sm"
          rows={20}
        />
      </div>
    </div>
  );
}

export default function SplitLayoutDemoPage() {
  const splitLayoutRef = React.useRef<SplitLayoutRef>(null);
  const [isFullWidth, setIsFullWidth] = React.useState(false);

  const handleReset = () => {
    splitLayoutRef.current?.resetLayout();
    toast.info("Layout reset to default");
  };

  const handleSetSize = () => {
    splitLayoutRef.current?.setSize(30);
    toast.info("Left panel set to 30%");
  };

  const handleSizeChange = (size: number) => {
    console.log("Size changed:", size);
  };

  const handleResizeStart = () => {
    console.log("Resize started");
  };

  const handleResizeEnd = () => {
    toast.success("Panel resized");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-full mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Split Layout Components</h1>
          <p className="text-muted-foreground mt-1">
            Resizable split panels for flexible layouts
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Layout
          </Button>
          <Button variant="outline" size="sm" onClick={handleSetSize}>
            <Settings className="mr-2 h-4 w-4" />
            Set 30/70
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullWidth(!isFullWidth)}
          >
            {isFullWidth ? (
              <Minimize2 className="mr-2 h-4 w-4" />
            ) : (
              <Maximize2 className="mr-2 h-4 w-4" />
            )}
            {isFullWidth ? "Normal" : "Full Width"}
          </Button>
        </div>

        <Tabs defaultValue="code-editor">
          <TabsList className="mb-6">
            <TabsTrigger value="code-editor">Code Editor</TabsTrigger>
            <TabsTrigger value="preview-editor">Preview & Editor</TabsTrigger>
            <TabsTrigger value="settings">Settings Panel</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Code Editor Split */}
          <TabsContent value="code-editor">
            <DashboardCard title="Code Editor (Horizontal Split)">
              <SplitLayout
                ref={splitLayoutRef}
                left={
                  <div className="p-4">
                    <h3 className="mb-2 font-medium">Editor</h3>
                    <ContentPanel />
                  </div>
                }
                right={
                  <div className="p-4">
                    <h3 className="mb-2 font-medium">Preview</h3>
                    <PreviewPanel />
                  </div>
                }
                defaultSize={50}
                minSize={30}
                maxSize={70}
                resizable
                savePreference
                preferenceKey="code-editor-layout"
                onSizeChange={handleSizeChange}
                onResizeStart={handleResizeStart}
                onResizeEnd={handleResizeEnd}
              />
            </DashboardCard>
          </TabsContent>

          {/* Preview & Editor */}
          <TabsContent value="preview-editor">
            <DashboardCard title="Preview & Editor (Vertical Split)">
              <SplitLayout
                direction="vertical"
                left={
                  <div className="p-4">
                    <h3 className="mb-2 font-medium">Editor</h3>
                    <ContentPanel />
                  </div>
                }
                right={
                  <div className="p-4">
                    <h3 className="mb-2 font-medium">Preview</h3>
                    <PreviewPanel />
                  </div>
                }
                defaultSize={40}
                minSize={25}
                maxSize={60}
                resizable
              />
            </DashboardCard>
          </TabsContent>

          {/* Settings Panel */}
          <TabsContent value="settings">
            <DashboardCard title="Settings Panel">
              <SplitLayout
                left={
                  <div className="p-4">
                    <h3 className="mb-4 font-medium">Settings</h3>
                    <SettingsPanel />
                  </div>
                }
                right={
                  <div className="p-4">
                    <h3 className="mb-2 font-medium">Preview</h3>
                    <PreviewPanel />
                  </div>
                }
                defaultSize={30}
                minSize={25}
                maxSize={40}
                resizable
              />
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-6">
              <DashboardCard title="Non-resizable Split">
                <SplitLayout
                  left={
                    <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-8">
                      <p className="text-center text-muted-foreground">
                        Fixed Left Panel (40%)
                      </p>
                    </div>
                  }
                  right={
                    <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-8">
                      <p className="text-center text-muted-foreground">
                        Fixed Right Panel (60%)
                      </p>
                    </div>
                  }
                  defaultSize={40}
                  resizable={false}
                />
              </DashboardCard>

              <DashboardCard title="Without Gutter">
                <SplitLayout
                  left={
                    <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-8">
                      <p className="text-center text-muted-foreground">
                        Left Panel
                      </p>
                    </div>
                  }
                  right={
                    <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-8">
                      <p className="text-center text-muted-foreground">
                        Right Panel
                      </p>
                    </div>
                  }
                  showGutter={false}
                  defaultSize={50}
                />
              </DashboardCard>

              <DashboardCard title="Custom Size Limits">
                <SplitLayout
                  left={
                    <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-8">
                      <p className="text-center text-muted-foreground">
                        Left Panel
                        <br />
                        Min: 20%, Max: 40%
                      </p>
                    </div>
                  }
                  right={
                    <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-8">
                      <p className="text-center text-muted-foreground">
                        Right Panel
                        <br />
                        Min: 60%, Max: 80%
                      </p>
                    </div>
                  }
                  defaultSize={30}
                  minSize={20}
                  maxSize={40}
                />
              </DashboardCard>

              <DashboardCard title="Loading State">
                <SplitLayout left={<div />} right={<div />} loading />
              </DashboardCard>

              <DashboardCard title="Error State">
                <SplitLayout
                  left={<div />}
                  right={<div />}
                  error="Failed to load split layout content"
                />
              </DashboardCard>

              <DashboardCard title="Three Panel Layout (Nested)">
                <SplitLayout
                  left={
                    <div className="p-2">
                      <SplitLayout
                        direction="vertical"
                        left={
                          <div className="flex h-full items-center justify-center rounded-lg bg-blue-100 p-4 dark:bg-blue-900/30">
                            <p className="text-center text-sm">Top Left</p>
                          </div>
                        }
                        right={
                          <div className="flex h-full items-center justify-center rounded-lg bg-green-100 p-4 dark:bg-green-900/30">
                            <p className="text-center text-sm">Bottom Left</p>
                          </div>
                        }
                        defaultSize={50}
                        showGutter
                      />
                    </div>
                  }
                  right={
                    <div className="flex h-full items-center justify-center rounded-lg bg-purple-100 p-8 dark:bg-purple-900/30">
                      <p className="text-center">Right Panel</p>
                    </div>
                  }
                  defaultSize={40}
                />
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
