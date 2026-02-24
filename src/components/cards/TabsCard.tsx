import React, { useState } from 'react'
import {
  Users,
  DoorOpen,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";


const pendingRoomApprovals = [
  { id: 1, employee: "Alice Johnson", room: "Conference Room A", date: "Feb 25, 2026", time: "10:00 AM – 11:00 AM", status: "pending" },
  { id: 2, employee: "Bob Smith", room: "Board Room", date: "Feb 26, 2026", time: "2:00 PM – 3:30 PM", status: "pending" },
  { id: 3, employee: "Carol White", room: "Meeting Room 3", date: "Feb 27, 2026", time: "9:00 AM – 10:00 AM", status: "pending" },
];

const pendingAssetApprovals = [
  { id: 1, employee: "David Lee", asset: "MacBook Pro 16\"", type: "Laptop", date: "Feb 22, 2026", status: "pending" },
  { id: 2, employee: "Emma Davis", asset: "Ergonomic Chair", type: "Furniture", date: "Feb 23, 2026", status: "pending" },
  { id: 3, employee: "Frank Miller", asset: "External Monitor 27\"", type: "Peripheral", date: "Feb 24, 2026", status: "pending" },
];

const employees = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", department: "Engineering", status: "online" },
  { id: 2, name: "Bob Smith", role: "Product Manager", department: "Product", status: "online" },
  { id: 3, name: "Carol White", role: "Designer", department: "Design", status: "offline" },
  { id: 4, name: "David Lee", role: "DevOps Engineer", department: "Engineering", status: "online" },
  { id: 5, name: "Emma Davis", role: "HR Manager", department: "Human Resources", status: "offline" },
];

const rooms = [
  { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available" },
  { id: 2, name: "Board Room", capacity: 20, floor: "3rd", status: "occupied" },
  { id: 3, name: "Meeting Room 3", capacity: 6, floor: "1st", status: "available" },
  { id: 4, name: "Huddle Space", capacity: 4, floor: "1st", status: "maintenance" },
];

const assets = [
  { id: 1, name: "MacBook Pro 16\"", category: "Laptop", assignedTo: "Alice Johnson", status: "assigned" },
  { id: 2, name: "Dell Monitor 27\"", category: "Peripheral", assignedTo: "Bob Smith", status: "assigned" },
  { id: 3, name: "Standing Desk", category: "Furniture", assignedTo: "—", status: "available" },
  { id: 4, name: "Logitech Webcam", category: "Peripheral", assignedTo: "—", status: "maintenance" },
];

type Tab = "approvals" | "employees" | "rooms" | "assets";

const statusColors: Record<string, string> = {
  online: "bg-success/10 text-success",
  offline: "bg-muted text-muted-foreground",
  available: "bg-success/10 text-success",
  occupied: "bg-warning/10 text-warning",
  maintenance: "bg-destructive/10 text-destructive",
  assigned: "bg-primary/10 text-primary",
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const TabsCard = () => {

     const [activeTab, setActiveTab] = useState<Tab>("approvals");
  const [roomApprovals, setRoomApprovals] = useState(pendingRoomApprovals);
  const [assetApprovals, setAssetApprovals] = useState(pendingAssetApprovals);

  const tabs = [
    { key: "approvals" as Tab, label: "Approvals", icon: CheckCircle, count: roomApprovals.filter(r => r.status === "pending").length + assetApprovals.filter(a => a.status === "pending").length },
    { key: "employees" as Tab, label: "Employees", icon: Users, count: employees.length },
    { key: "rooms" as Tab, label: "Rooms", icon: DoorOpen, count: rooms.length },
    { key: "assets" as Tab, label: "Assets", icon: Package, count: assets.length },
  ];

  const handleApproval = (type: "room" | "asset", id: number, action: "approved" | "rejected") => {
    if (type === "room") {
      setRoomApprovals(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    } else {
      setAssetApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    }
  };


  return (
     <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        /* Approvals Tab */ 
        {activeTab === "approvals" && (
          <div className="space-y-8">
            {/* Room Approvals */}
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-warning" /> Room Booking Approvals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomApprovals.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                        <DoorOpen className="w-4 h-4 text-warning" />
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-1">{item.room}</h3>
                    <p className="text-xs text-muted-foreground mb-0.5">By {item.employee}</p>
                    <p className="text-xs text-muted-foreground mb-1">{item.date} · {item.time}</p>
                    {item.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleApproval("room", item.id, "approved")}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleApproval("room", item.id, "rejected")}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Approvals */}
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" /> Asset Request Approvals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetApprovals.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-accent" />
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-1">{item.asset}</h3>
                    <p className="text-xs text-muted-foreground mb-0.5">By {item.employee} · {item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    {item.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleApproval("asset", item.id, "approved")}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleApproval("asset", item.id, "rejected")}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Employees
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div key={emp.id} className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {emp.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${emp.status === "online" ? "bg-success" : "bg-muted-foreground/40"}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground">{emp.name}</h3>
                      <p className="text-xs text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{emp.department}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[emp.status]}`}>
                      {emp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-warning" /> Rooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-warning/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                      <DoorOpen className="w-4 h-4 text-warning" />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[room.status]}`}>
                      {room.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-1">{room.name}</h3>
                  <p className="text-xs text-muted-foreground">Capacity: {room.capacity} · {room.floor} Floor</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === "assets" && (
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" /> Assets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-accent/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-accent" />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[asset.status]}`}>
                      {asset.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-1">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground">{asset.category} · {asset.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>
        )}
  );
}

export default TabsCard