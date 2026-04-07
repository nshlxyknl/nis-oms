"use client";

import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import SkeletonCard from "@/components/cards/SkeletonCard";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession();

  if (status === "loading") return <SkeletonCard />;

  return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <SiteHeader />
            <SidebarInset className="flex-1">
              {children}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
  )
}