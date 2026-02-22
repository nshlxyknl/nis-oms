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
      title: "Approvals",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
       items: [
        {
          title: "Rooms",
          url: "#",
        },
        {
          title: "Assets",
          url: "#",
        }
      ],
    },
    {
      title: "Employees",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Our Rooms",
      url: "#",
      icon: Bot,
    },
     {
      title: "Our Assets",
      url: "#",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Add Notice",
      url: "#",
      icon: Send,
    },
  ],
} 