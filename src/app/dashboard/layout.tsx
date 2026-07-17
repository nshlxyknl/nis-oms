"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import dynamic from 'next/dynamic';

// Import components as client-only to prevent hydration issues
const AppSidebar = dynamic(
  () => import('@/components/app-sidebar').then(mod => ({ default: mod.AppSidebar })),
  { ssr: false, loading: () => <div className="w-16"></div> }
);

const SiteHeader = dynamic(
  () => import('@/components/site-header').then(mod => ({ default: mod.SiteHeader })),
  { ssr: false, loading: () => <div className="h-14"></div> }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}