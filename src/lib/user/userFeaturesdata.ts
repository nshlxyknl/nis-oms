
import {
  Clock,
  CalendarDays,
  DoorOpen,
  Package,
} from "lucide-react";

export const userFeatures = [
  {
    title: "Attendance",
    description: "Clock in & out, view your daily and monthly attendance logs.",
    icon: Clock,
    color: "primary" as const,
    action: "Check In",
    url: "/dashboard/attendance",
  },
  {
    title: "Leave",
    description: "Apply for leave, check balances and track approval status.",
    icon: CalendarDays,
    color: "success" as const,
    action: "Apply Leave",
    url: "/dashboard/leave",
  },
  {
    title: " Book Room",
    description: "Book meeting rooms and check real-time availability.",
    icon: DoorOpen,
    color: "warning" as const,
    action: "Book Room",
    url: "/dashboard/book-rooms",
  },
  {
    title: "Request Assets",
    description:
      "Request equipment, view assigned assets and maintenance status.",
    icon: Package,
    color: "accent" as const,
    action: "Request Asset",
    url: "/dashboard/book-assets",
  },
];