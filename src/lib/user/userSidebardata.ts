import {
  BookOpen,
  Bot,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"



export const userData = {
  user: {
    name: "user",
    email: `user@gmail.com`,
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: SquareTerminal,
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: SquareTerminal,
    },
    {
      title: "Leave",
      url: "/dashboard/leave",
      icon: Bot,
    },
    {
      title: "Book Rooms",
      url: "/dashboard/book-rooms",
      icon: BookOpen,
    },
    {
      title: "Book Assets",
      url: "/dashboard/book-assets",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "See Notices",
      url: "/dashboard/notices",
      icon: Send,
    },
  ],
} 