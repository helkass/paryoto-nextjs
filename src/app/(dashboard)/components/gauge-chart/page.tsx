// app/gauge-chart-demo/page.tsx
'use client';

import * as React from 'react';
import { GaugeChart } from '@/components/gauge-chart/gauge-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs/custom-tabs';
import { DashboardCard } from '@/components/cards/dashboard-card';
import { useState } from 'react';

export default function GaugeChartDemoPage() {
  const [value, setValue] = useState(65);
  const [kpiValue, setKpiValue] = useState(78);
  const [performanceValue, setPerformanceValue] = useState(45);
  const [customValue, setCustomValue] = useState(50);

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;
  const formatPercentage = (val: number) => `${Math.round(val)}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gauge Chart Components</h1>
          <p className="text-muted-foreground mt-1">
            Speedometer-style gauges for KPI visualization
          </p>
        </div>

        <Tabs defaultValue="variants">
          <TabsList className="mb-6">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
          </TabsList>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard title="Default Variant">
                <GaugeChart
                  value={value}
                  min={0}
                  max={100}
                  title="Completion Rate"
                  subtitle="Project Progress"
                  variant="default"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Success Variant">
                <GaugeChart
                  value={82}
                  min={0}
                  max={100}
                  title="Customer Satisfaction"
                  subtitle="CSAT Score"
                  variant="success"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Warning Variant">
                <GaugeChart
                  value={68}
                  min={0}
                  max={100}
                  title="System Load"
                  subtitle="CPU Usage"
                  variant="warning"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Danger Variant">
                <GaugeChart
                  value={25}
                  min={0}
                  max={100}
                  title="Storage Space"
                  subtitle="Available Space"
                  variant="danger"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Primary Variant">
                <GaugeChart
                  value={92}
                  min={0}
                  max={100}
                  title="Revenue Target"
                  subtitle="Quarterly Goal"
                  variant="primary"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Custom Color">
                <GaugeChart
                  value={70}
                  min={0}
                  max={100}
                  title="Custom Color"
                  subtitle="Purple Theme"
                  color="#8B5CF6"
                  showPercentage
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Sizes */}
          <TabsContent value="sizes">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard title="Small Size">
                <GaugeChart
                  value={65}
                  min={0}
                  max={100}
                  title="Small"
                  variant="primary"
                  size="sm"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Medium Size (Default)">
                <GaugeChart
                  value={65}
                  min={0}
                  max={100}
                  title="Medium"
                  variant="primary"
                  size="md"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Large Size">
                <GaugeChart
                  value={65}
                  min={0}
                  max={100}
                  title="Large"
                  variant="primary"
                  size="lg"
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Extra Large Size">
                <GaugeChart
                  value={65}
                  min={0}
                  max={100}
                  title="Extra Large"
                  variant="primary"
                  size="xl"
                  showPercentage
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Segments */}
          <TabsContent value="segments">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Performance Segments">
                <GaugeChart
                  value={performanceValue}
                  min={0}
                  max={100}
                  title="Performance Score"
                  variant="default"
                  segments={[
                    { start: 0, end: 40, color: '#EF4444', label: 'Poor' },
                    { start: 40, end: 70, color: '#F59E0B', label: 'Average' },
                    { start: 70, end: 100, color: '#10B981', label: 'Excellent' },
                  ]}
                  showPercentage
                />
              </DashboardCard>

              <DashboardCard title="Custom Color Segments">
                <GaugeChart
                  value={55}
                  min={0}
                  max={100}
                  title="Custom Segments"
                  segments={[
                    { start: 0, end: 30, color: '#3B82F6', label: 'Low' },
                    { start: 30, end: 60, color: '#8B5CF6', label: 'Medium' },
                    { start: 60, end: 80, color: '#EC4899', label: 'High' },
                    { start: 80, end: 100, color: '#06B6D4', label: 'Very High' },
                  ]}
                  showPercentage
                />
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Interactive */}
          <TabsContent value="interactive">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Interactive Gauge">
                <div className="space-y-4">
                  <GaugeChart
                    value={customValue}
                    min={0}
                    max={100}
                    title="Interactive Value"
                    variant="primary"
                    showPercentage
                    showMinMax
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adjust Value: {customValue}%</label>
                    <Slider
                      value={[customValue]}
                      onValueChange={(val) => setCustomValue(val[0])}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard title="KPI Dashboard Example">
                <div className="space-y-4">
                  <GaugeChart
                    value={kpiValue}
                    min={0}
                    max={100}
                    title="KPI Target Achievement"
                    subtitle="Annual Goal: 100%"
                    variant="success"
                    showPercentage
                    showMinMax
                    valueFormat={(val) => `${Math.round(val)}%`}
                  />
                  <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-semibold">100%</p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-semibold">{kpiValue}%</p>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>GaugeChart Features</CardTitle>
            <CardDescription>Available options and configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Variants</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• default - Blue theme</li>
                  <li>• primary - Purple theme</li>
                  <li>• success - Green theme</li>
                  <li>• warning - Yellow theme</li>
                  <li>• danger - Red theme</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sizes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• sm - 200px width</li>
                  <li>• md - 280px width</li>
                  <li>• lg - 360px width</li>
                  <li>• xl - 440px width</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Custom segments & colors</li>
                  <li>• Animated needle & value</li>
                  <li>• Threshold indicators</li>
                  <li>• Custom value formatting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}