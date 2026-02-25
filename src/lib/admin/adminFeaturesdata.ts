
import {
  Clock,
  CalendarDays,
  DoorOpen,
  Package,
  User,
} from "lucide-react";

export const adminFeatures = [
     {
    title: "Room Approval",
    description: "Approve meeting rooms and check real-time availability.",
    icon: DoorOpen,
    color: "warning" as const,
    action: "Approve Room",
    url: "/dashboard/approvals/rooms",
  },
  {
    title: "Assets Approval ",
    description: "Approve equipment, view assigned assets and maintenance status",
    icon: Package,
    color: "warning" as const,
    action: "Approve Assets",
    url: "/dashboard/approvals/assets",
  },
  {
    title: "Manage Employees",
    description:"View our employees and their status of leave, availability",
    icon: User,
    color: "accent" as const,
    action: "Manage Employees",
    url: "/dashboard/employees",
  },
];