import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  onAction,
  ...props
}: {
  items: {
    title: string
    url?: string
    action?: "open-add-notice"
    icon: LucideIcon
  }[]
      onAction?: (action: "open-add-notice") => void

} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                {item.action ? (
    <button
      type="button"
      onClick={() => item.action &&  onAction?.(item.action)}
      className="w-full flex items-center gap-2"
    >
      <item.icon />
      <span>{item.title}</span>
    </button>
  ) :(
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>)}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
