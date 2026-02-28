"use client";
import React, { useState } from "react";
import { statusColors } from "@/lib/statuscolor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Status = "available" | "occupied" | "maintenance" | "assigned";

export interface BaseItems {
  id: number;
  name: string;
  status: Status;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface IProps<T extends BaseItems> {
  items: T[];
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  renderSubtitle: (item: T) => string;
  onStatusChange?: (itemId: number, newStatus: Status, userId?: number) => void;
  type?: "asset" | "room";
}

const TotalCards = <T extends BaseItems>({
  items,
  icon,
  iconBg,
  renderSubtitle,
  accentColor,
  onStatusChange,
  type = "asset",
}: IProps<T>) => {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");

  // Mock user data
  const mockUsers: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@company.com", role: "USER" },
    { id: 2, name: "Bob Smith", email: "bob@company.com", role: "USER" },
    { id: 3, name: "Charlie Davis", email: "charlie@company.com", role: "USER" },
    { id: 4, name: "Diana Prince", email: "diana@company.com", role: "ADMIN" },
    { id: 5, name: "Ethan Hunt", email: "ethan@company.com", role: "ADMIN" },
    { id: 6, name: "Fiona Green", email: "fiona@company.com", role: "USER" },
  ];

  const getStatusOptions = (currentStatus: Status): Status[] => {
    switch (currentStatus) {
      case "available":
        return type === "asset" ? ["maintenance", "assigned"] : ["maintenance", "occupied"];
      case "maintenance":
      case "occupied":
        return ["available"];
      case "assigned":
        return ["available"];
      default:
        return [];
    }
  };

  const handleStatusChange = (itemId: number, newStatus: Status) => {
    // Check if we need to show user selection dialog
    if ((type === "asset" && newStatus === "assigned") || (type === "room" && newStatus === "occupied")) {
      setSelectedItem(itemId);
      setSelectedStatus(newStatus);
      setShowUserDialog(true);
    } else {
      if (onStatusChange) {
        onStatusChange(itemId, newStatus);
      }
    }
  };

  const handleUserSelection = () => {
    if (selectedItem && selectedStatus && selectedUser && onStatusChange) {
      onStatusChange(selectedItem, selectedStatus, parseInt(selectedUser));
      setShowUserDialog(false);
      setSelectedItem(null);
      setSelectedStatus(null);
      setSelectedUser("");
    }
  };

  const filteredUsers = type === "room" 
    ? mockUsers.filter(user => user.role === "ADMIN")
    : mockUsers.filter(user => user.role === "USER");
  return (
    <>
      <div className="m-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${accentColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg bg-blue-100  ${iconBg} flex items-center justify-center`}
                >
                  {icon}
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {renderSubtitle(item)}
                    </p>
                  </div>
                </div>
                {getStatusOptions(item.status).length > 0 && (
                  <Select
                    value={item.status}
                    onValueChange={(value) => handleStatusChange(item.id, value as Status)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Change to</SelectLabel>
                        {getStatusOptions(item.status).map((status) => (
                          <SelectItem key={status} value={status}>
                            <span className="capitalize">{status}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === "asset" ? "Assign to User" : "Assign to Admin"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {type === "asset" 
                ? "Select a user to assign this asset to:" 
                : "Select an admin to occupy this room:"}
            </p>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${type === "asset" ? "user" : "admin"}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{type === "asset" ? "Users" : "Admins"}</SelectLabel>
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowUserDialog(false);
                  setSelectedUser("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUserSelection}
                disabled={!selectedUser}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TotalCards;
