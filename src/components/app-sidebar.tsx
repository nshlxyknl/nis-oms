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
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';


export interface CreateNoticeDto {
  title: string;
  date: string;
  pinned: boolean;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
    const { register, handleSubmit, reset } = useForm<CreateNoticeDto>();
  const [open, setOpen] = useState(false)

  const sideData = session?.user?.role === "admin" ? adminData : userData;

  const queryClient = useQueryClient();

  const { mutate: createNotice, isPending } = useMutation({
  mutationFn: (data: CreateNoticeDto) => api.post('/notices/add', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notices'] });
    toast.success('Notice created!');
     reset();
      setOpen(false);
  },
  onError: (error) => {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    toast.error(message);
  }
});

const onSubmit = (data: CreateNoticeDto) => {
    createNotice(data);
  };

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

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register('title')}
              placeholder="Title"
              className="w-full border rounded-md p-2"
            />
            <input
              {...register('date')}
              type="date"
              className="w-full border rounded-md p-2"
            />
            <div className="flex items-center gap-2">
              <input {...register('pinned')} type="checkbox" id="pinned" />
              <label htmlFor="pinned" className="text-sm">Pin this notice</label>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Notice'}
            </Button>
          </form>

        </DialogContent>
      </Dialog>
      </>
  );
}
