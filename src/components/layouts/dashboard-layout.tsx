import React from "react";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../AppSidebar";
import Navbar from "../Navbar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <div className="px-4 w-full max-w-full overflow-hidden">{children}</div>
      </main>
    </SidebarProvider>
  );
}
