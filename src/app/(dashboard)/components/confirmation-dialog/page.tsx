// app/confirmation-dialog-demo/page.tsx
"use client";

import * as React from "react";
import { ConfirmationDialog } from "@/components/confirmation-dialog/confirmation-dialog";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import {
  Trash2,
  LogOut,
  Mail,
  Settings,
  User,
  AlertTriangle,
  Save,
} from "lucide-react";

// Simulate async action
const simulateAsyncAction = async (
  actionName: string,
  duration: number = 1500
) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
  toast.success(`${actionName} completed successfully!`);
};

export default function ConfirmationDialogDemoPage() {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);
  const [isCustomOpen, setIsCustomOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sizeOpen, setSizeOpen] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<
    "sm" | "md" | "lg" | "xl"
  >("md");

  const { confirm, confirmDialog } = useConfirmationDialog();

  const handleDelete = async () => {
    setIsLoading(true);
    await simulateAsyncAction("Delete item");
    setIsLoading(false);
    setIsDeleteOpen(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await simulateAsyncAction("Logout");
    setIsLoading(false);
    setIsLogoutOpen(false);
  };

  const handleCustomAction = async () => {
    setIsLoading(true);
    await simulateAsyncAction("Custom action");
    setIsLoading(false);
    setIsCustomOpen(false);
  };

  const handleConfirmWithHook = async () => {
    await simulateAsyncAction("Action confirmed", 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Confirmation Dialog Components</h1>
          <p className="text-muted-foreground mt-1">
            Yes/No confirmation dialogs with multiple variants and options
          </p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="hook">useConfirmationDialog</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Basic Dialogs */}
          <TabsContent value="basic">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Delete Confirmation">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Destructive action with warning icon
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Item
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Logout Confirmation">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Default confirmation dialog
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsLogoutOpen(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Confirm Variants">
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      confirm({
                        title: "Save Changes",
                        description: "Do you want to save your changes?",
                        confirmLabel: "Save",
                        confirmVariant: "default",
                        onConfirm: async () => {
                          await simulateAsyncAction("Save changes");
                        },
                      });
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save (Default)
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Destructive Variant">
                <div className="space-y-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      confirm({
                        title: "Delete Account",
                        description:
                          "This action cannot be undone. All your data will be permanently deleted.",
                        confirmLabel: "Delete",
                        confirmVariant: "destructive",
                        onConfirm: async () => {
                          await simulateAsyncAction("Account deleted");
                        },
                      });
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Without Cancel Button">
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      confirm({
                        title: "Information",
                        description:
                          "This is an informational message that requires acknowledgment.",
                        confirmLabel: "OK",
                        onConfirm: async () => {
                          await simulateAsyncAction("Acknowledged");
                        },
                      });
                    }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Info Dialog
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Reverse Buttons">
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      confirm({
                        title: "Reverse Buttons",
                        description: "Confirm and Cancel buttons are reversed",
                        confirmLabel: "Confirm",
                        cancelLabel: "Cancel",
                        onConfirm: async () => {
                          await simulateAsyncAction("Confirmed");
                        },
                      });
                    }}
                  >
                    Reverse Buttons
                  </Button>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Sizes */}
          <TabsContent value="sizes">
            <DashboardCard title="Dialog Sizes">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => {
                    setSelectedSize("sm");
                    setSizeOpen(true);
                  }}
                >
                  Small (sm)
                </Button>
                <Button
                  onClick={() => {
                    setSelectedSize("md");
                    setSizeOpen(true);
                  }}
                >
                  Medium (md)
                </Button>
                <Button
                  onClick={() => {
                    setSelectedSize("lg");
                    setSizeOpen(true);
                  }}
                >
                  Large (lg)
                </Button>
                <Button
                  onClick={() => {
                    setSelectedSize("xl");
                    setSizeOpen(true);
                  }}
                >
                  Extra Large (xl)
                </Button>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* useConfirmationDialog Hook */}
          <TabsContent value="hook">
            <DashboardCard title="useConfirmationDialog Hook">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Programmatic confirmation dialogs using a custom hook
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => {
                      confirm({
                        title: "Confirm Action",
                        description:
                          "This dialog was triggered using the useConfirmationDialog hook",
                        confirmLabel: "Confirm",
                        onConfirm: handleConfirmWithHook,
                      });
                    }}
                  >
                    Show Hook Dialog
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples">
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCard title="Form Discard Warning">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Warn user about unsaved changes
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      confirm({
                        title: "Unsaved Changes",
                        description:
                          "You have unsaved changes. Are you sure you want to leave?",
                        confirmLabel: "Leave",
                        cancelLabel: "Stay",
                        confirmVariant: "destructive",
                        onConfirm: async () => {
                          await simulateAsyncAction("Form discarded");
                        },
                      });
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Discard Changes
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Email Send Confirmation">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Confirm before sending email
                  </p>
                  <Button
                    onClick={() => {
                      confirm({
                        title: "Send Email",
                        description:
                          "Are you sure you want to send this email?",
                        confirmLabel: "Send",
                        icon: <Mail className="h-6 w-6" />,
                        onConfirm: async () => {
                          await simulateAsyncAction("Email sent");
                        },
                      });
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Profile Update">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Confirm profile update
                  </p>
                  <Button
                    onClick={() => {
                      confirm({
                        title: "Update Profile",
                        description:
                          "Are you sure you want to update your profile information?",
                        confirmLabel: "Update",
                        icon: <User className="h-6 w-6" />,
                        onConfirm: async () => {
                          await simulateAsyncAction("Profile updated");
                        },
                      });
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </div>
              </DashboardCard>

              <DashboardCard title="Loading State">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Dialog with loading state during async operation
                  </p>
                  <Button onClick={() => setIsCustomOpen(true)}>
                    Show Loading Dialog
                  </Button>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isLoading}
          loadingText="Deleting..."
        />

        <ConfirmationDialog
          isOpen={isLogoutOpen}
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={handleLogout}
          title="Logout"
          description="Are you sure you want to logout?"
          confirmLabel="Logout"
          loading={isLoading}
          loadingText="Logging out..."
        />

        <ConfirmationDialog
          isOpen={isCustomOpen}
          onClose={() => setIsCustomOpen(false)}
          onConfirm={handleCustomAction}
          title="Custom Action"
          description="This action will take a few moments. Please wait."
          confirmLabel="Proceed"
          loading={isLoading}
          loadingText="Processing..."
        />

        <ConfirmationDialog
          isOpen={sizeOpen}
          onClose={() => setSizeOpen(false)}
          onConfirm={() => {
            toast.success(`Selected size: ${selectedSize}`);
            setSizeOpen(false);
          }}
          title={`${selectedSize.toUpperCase()} Size Dialog`}
          description={`This dialog is sized as "${selectedSize}". The dimensions change based on the selected size option.`}
          size={selectedSize}
        />

        {/* Hook Dialog */}
        <ConfirmationDialog {...confirmDialog} />
      </div>
    </div>
  );
}
