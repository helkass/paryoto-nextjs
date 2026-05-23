// app/alert-dialog-demo/page.tsx
"use client";

import * as React from "react";
import { AlertDialog } from "@/components/alert-dialog/alert-dialog";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/cards/dashboard-card";
import { toast } from "sonner";
import {
  AlertCircle,
  Trash2,
  LogOut,
  Save,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const simulateAction = async (action: string, duration: number = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
  toast.success(`${action} completed!`);
};

export default function AlertDialogDemoPage() {
  // Simple state management - hanya untuk demo dasar
  const [dialogState, setDialogState] = React.useState({
    delete: false,
    logout: false,
    save: false,
    size: false,
  });
  const [selectedSize, setSelectedSize] = React.useState<"sm" | "md" | "lg">(
    "md"
  );

  const { alert, alertDialog } = useAlertDialog();

  const closeDialog = (key: keyof typeof dialogState) => {
    setDialogState((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alert Dialog Components</h1>
          <p className="text-muted-foreground mt-1">
            Alert dialogs with smooth animations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Delete Confirmation */}
          <DashboardCard title="Delete Confirmation">
            <p className="text-sm text-muted-foreground mb-4">
              Destructive action with danger variant
            </p>
            <Button
              variant="destructive"
              onClick={() =>
                setDialogState((prev) => ({ ...prev, delete: true }))
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Item
            </Button>
          </DashboardCard>

          {/* Logout Confirmation */}
          <DashboardCard title="Logout Confirmation">
            <p className="text-sm text-muted-foreground mb-4">
              Standard confirmation with default variant
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setDialogState((prev) => ({ ...prev, logout: true }))
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DashboardCard>

          {/* Save Confirmation */}
          <DashboardCard title="Save Confirmation">
            <p className="text-sm text-muted-foreground mb-4">
              Information alert with save action
            </p>
            <Button
              onClick={() =>
                setDialogState((prev) => ({ ...prev, save: true }))
              }
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DashboardCard>

          {/* Custom Alert via Hook */}
          <DashboardCard title="Custom Alert (Hook)">
            <p className="text-sm text-muted-foreground mb-4">
              Using useAlertDialog hook for programmatic alerts
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                alert({
                  title: "Delete Account",
                  description:
                    "This action cannot be undone. This will permanently delete your account and remove all your data.",
                  icon: <AlertCircle className="h-6 w-6 text-destructive" />,
                  action: {
                    label: "Delete",
                    variant: "destructive",
                    onClick: () => simulateAction("Account deleted"),
                  },
                  cancel: { label: "Cancel", onClick: () => {} },
                });
              }}
            >
              Delete Account
            </Button>
          </DashboardCard>

          {/* Size Variants */}
          <DashboardCard title="Dialog Sizes">
            <p className="text-sm text-muted-foreground mb-4">
              Different dialog sizes with animations
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedSize("sm");
                  setDialogState((prev) => ({ ...prev, size: true }));
                }}
              >
                Small (sm)
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedSize("md");
                  setDialogState((prev) => ({ ...prev, size: true }));
                }}
              >
                Medium (md)
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedSize("lg");
                  setDialogState((prev) => ({ ...prev, size: true }));
                }}
              >
                Large (lg)
              </Button>
            </div>
          </DashboardCard>

          {/* More Examples via Hook */}
          <DashboardCard title="More Examples">
            <p className="text-sm text-muted-foreground mb-4">
              Various alert types using the hook
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  alert({
                    title: "Update Available",
                    description:
                      "A new version (v2.0.0) is available. Would you like to update now?",
                    icon: <Info className="h-6 w-6 text-blue-500" />,
                    action: {
                      label: "Update",
                      onClick: () => simulateAction("Update started"),
                    },
                    cancel: { label: "Remind me later", onClick: () => {} },
                  });
                }}
              >
                Update
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  alert({
                    title: "Unsaved Changes",
                    description:
                      "You have unsaved changes. Are you sure you want to leave?",
                    icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
                    action: {
                      label: "Leave",
                      variant: "destructive",
                      onClick: () => simulateAction("Leaving page"),
                    },
                    cancel: { label: "Stay", onClick: () => {} },
                  });
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  alert({
                    title: "Payment Successful",
                    description:
                      "Your payment has been processed successfully.",
                    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
                    action: {
                      label: "View Receipt",
                      onClick: () => simulateAction("Opening receipt"),
                    },
                  });
                }}
              >
                Payment
              </Button>
            </div>
          </DashboardCard>
        </div>

        {/* Dialogs */}
        <AlertDialog
          open={dialogState.delete}
          onOpenChange={() => closeDialog("delete")}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          icon={<AlertCircle className="h-6 w-6 text-destructive" />}
          action={{
            label: "Delete",
            variant: "destructive",
            onClick: () => simulateAction("Item deleted"),
          }}
          cancel={{ label: "Cancel" }}
        />

        <AlertDialog
          open={dialogState.logout}
          onOpenChange={() => closeDialog("logout")}
          title="Logout"
          description="Are you sure you want to logout? You will need to login again to access your account."
          action={{
            label: "Logout",
            onClick: () => simulateAction("Logged out"),
          }}
          cancel={{ label: "Cancel" }}
        />

        <AlertDialog
          open={dialogState.save}
          onOpenChange={() => closeDialog("save")}
          title="Save Changes"
          description="Do you want to save your changes before leaving?"
          action={{
            label: "Save",
            onClick: () => simulateAction("Changes saved"),
          }}
          cancel={{ label: "Don't Save" }}
        />

        <AlertDialog
          open={dialogState.size}
          onOpenChange={() => closeDialog("size")}
          title={`${selectedSize.toUpperCase()} Size Dialog`}
          description={`This dialog has "${selectedSize}" size. Maximum width: ${
            selectedSize === "sm"
              ? "384px"
              : selectedSize === "md"
              ? "448px"
              : "512px"
          }.`}
          size={selectedSize}
          action={{
            label: "Continue",
            onClick: () => simulateAction("Continue"),
          }}
        />

        {/* Hook Dialog */}
        <AlertDialog {...alertDialog} />
      </div>
    </div>
  );
}
