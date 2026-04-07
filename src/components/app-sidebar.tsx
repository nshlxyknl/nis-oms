"use client";

import * as React from "react";
import {
  Command,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { adminData } from "@/lib/admin/adminSidebardata";
import { userData } from "@/lib/user/userSidebardata";

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session , status} = useSession();
  const [open, setOpen] = useState(false)

  const sideData = session?.user?.role === "admin" ? adminData : userData;

  return (
    <>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={session?.user?.name || "User"}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user?.name}</span>
                <span className="truncate text-xs">
                  {session?.user?.role === "admin" ? "Admin" : "Employee"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideData.navMain} />
        <NavSecondary items={sideData.navSecondary} onAction={(action) => {
    if (action === "open-add-notice") {
      setOpen(true)
    }
  }} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

     <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notice</DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
           
            <textarea
              placeholder="Notice"
              className="w-full border rounded-md p-2"
            />
            <Button
              type="submit"
              className="w-full bg-primary text-white rounded-md p-2"
            >
              Save Notice
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      </>
  );
}
