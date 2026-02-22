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
      title: "Attendance",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Leave",
      url: "#",
      icon: Bot,
    },
    {
      title: "Book Rooms",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Book Assets",
      url: "#",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "See Notices",
      url: "#",
      icon: Send,
    },
  ],
} 