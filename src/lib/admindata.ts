import {
  BookOpen,
  Bot,
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
      url: "/approvals",
      icon: SquareTerminal,
       items: [
        {
          title: "Rooms",
          url: "/dashboard/rooms",
        },
        {
          title: "Assets",
          url: "/assets-approvals",
        }
      ],
    },
    {
      title: "Employees",
      url: "/employees",
      icon: SquareTerminal,
    },
    {
      title: "Our Rooms",
      url: "/dashboard/rooms",
      icon: Bot,
    },
     {
      title: "Our Assets",
      url: "/assets",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Add Notice",
      url: "/notice",
      icon: Send,
    },
  ],
} 