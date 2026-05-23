// app/modal-layout-demo/page.tsx - Bagian Sizes yang diperbaiki
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ModalLayout } from "@/components/modal-layout/modal-layout";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { useState } from "react";

// ... imports lainnya

export default function ModalLayoutDemoPage() {
  const [sizeOpen, setSizeOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<
    "sm" | "md" | "lg" | "xl" | "full" | "auto"
  >("md");

  // ... state lainnya

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ... header */}

        <Tabs defaultValue="sizes">
          <TabsList className="mb-6">
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            {/* ... tabs lainnya */}
          </TabsList>

          {/* Sizes - Menampilkan perbedaan ukuran dengan jelas */}
          <TabsContent value="sizes">
            <DashboardCard title="Modal Sizes">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => {
                      setSelectedSize("sm");
                      setSizeOpen(true);
                    }}
                  >
                    Small (sm) - 384px
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSize("md");
                      setSizeOpen(true);
                    }}
                  >
                    Medium (md) - 448px
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSize("lg");
                      setSizeOpen(true);
                    }}
                  >
                    Large (lg) - 512px
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSize("xl");
                      setSizeOpen(true);
                    }}
                  >
                    Extra Large (xl) - 576px
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSize("full");
                      setSizeOpen(true);
                    }}
                  >
                    Full Screen - 90vw/90vh
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSize("auto");
                      setSizeOpen(true);
                    }}
                  >
                    Auto Size - Fit content
                  </Button>
                </div>

                {/* Preview card untuk menunjukkan ukuran */}
                <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-2 text-sm font-medium">Size Preview:</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className={cn(
                        "rounded border bg-background p-2 text-center transition-all",
                        selectedSize === "sm" && "w-32",
                        selectedSize === "md" && "w-48",
                        selectedSize === "lg" && "w-64",
                        selectedSize === "xl" && "w-80",
                        selectedSize === "full" && "w-full max-w-[90vw]",
                        selectedSize === "auto" && "w-auto"
                      )}
                    >
                      {selectedSize.toUpperCase()}
                    </div>
                    <span>→</span>
                    <div className="text-xs">
                      {selectedSize === "sm" && "max-width: 384px"}
                      {selectedSize === "md" && "max-width: 448px"}
                      {selectedSize === "lg" && "max-width: 512px"}
                      {selectedSize === "xl" && "max-width: 576px"}
                      {selectedSize === "full" &&
                        "max-width: 90vw, max-height: 90vh"}
                      {selectedSize === "auto" && "width: auto, fit content"}
                    </div>
                  </div>
                </div>
              </div>

              <ModalLayout
                isOpen={sizeOpen}
                onClose={() => setSizeOpen(false)}
                title={`${selectedSize.toUpperCase()} Size Modal`}
                description={`Modal dengan ukuran ${selectedSize}. ${
                  selectedSize === "full"
                    ? "Menggunakan 90% viewport width dan height."
                    : selectedSize === "auto"
                    ? "Lebar menyesuaikan konten."
                    : `Max width: ${
                        selectedSize === "sm"
                          ? "384px"
                          : selectedSize === "md"
                          ? "448px"
                          : selectedSize === "lg"
                          ? "512px"
                          : "576px"
                      }`
                }`}
                size={selectedSize}
                footer={
                  <Button onClick={() => setSizeOpen(false)}>Close</Button>
                }
              >
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    This modal demonstrates the <strong>{selectedSize}</strong>{" "}
                    size option.
                  </p>
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-sm">
                      Current size: <strong>{selectedSize}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedSize === "sm" && "Max width: 384px (24rem)"}
                      {selectedSize === "md" && "Max width: 448px (28rem)"}
                      {selectedSize === "lg" && "Max width: 512px (32rem)"}
                      {selectedSize === "xl" && "Max width: 576px (36rem)"}
                      {selectedSize === "full" &&
                        "Max width: 90vw, Max height: 90vh"}
                      {selectedSize === "auto" &&
                        "Width auto - menyesuaikan konten"}
                    </p>
                  </div>
                  {selectedSize === "full" && (
                    <div className="h-32 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5" />
                  )}
                  {selectedSize === "auto" && (
                    <div className="flex flex-wrap gap-2">
                      <div className="h-10 w-20 rounded bg-primary/10" />
                      <div className="h-10 w-32 rounded bg-primary/10" />
                      <div className="h-10 w-24 rounded bg-primary/10" />
                    </div>
                  )}
                </div>
              </ModalLayout>
            </DashboardCard>
          </TabsContent>

          {/* ... tabs lainnya */}
        </Tabs>
      </div>
    </div>
  );
}

// Import cn
import { cn } from "@/lib/utils";
