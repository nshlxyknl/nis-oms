import {
  BookOpen,
  Bot,
  Plus,
  Send,
  SquareTerminal,
} from "lucide-react"

export const adminData = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: SquareTerminal,
    },
    {
      title: "Approvals",
      icon: SquareTerminal,
       items: [
        {
          title: "Rooms",
          url: "/dashboard/approvals/rooms",
        },
        {
          title: "Assets",
          url: "/dashboard/approvals/assets",
        }
      ],
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: SquareTerminal,
    },
    {
      title: "Our Rooms",
      url: "/dashboard/total-rooms",
      icon: Bot,
    },
     {
      title: "Our Assets",
      url: "/dashboard/total-assets",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Add Notices",
      icon: Plus,
      action: "open-add-notice" as const,
    },
    {
      title: "See Notices",
      url: "/dashboard/notices",
      icon: Send,
    },
  ],
} 