"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { CalendarOff, CheckCircle, XCircle } from "lucide-react";

const pendingLeaveApprovals = [
  { id: 1, employee: "Bob Smith",    type: "Annual",    from: "2026-03-10", to: "2026-03-12", days: 3, reason: "Family vacation",  status: "pending" },
  { id: 2, employee: "Carol White",  type: "Sick",      from: "2026-03-15", to: "2026-03-16", days: 2, reason: "Fever and rest",   status: "pending" },
  { id: 3, employee: "Eva Martinez", type: "Emergency", from: "2026-04-05", to: "2026-04-05", days: 1, reason: "Personal matter",  status: "pending" },
  { id: 4, employee: "Frank Lee",    type: "Annual",    from: "2026-04-20", to: "2026-04-25", days: 6, reason: "Holiday trip",     status: "approved" },
  { id: 5, employee: "Bob Smith",    type: "Unpaid",    from: "2026-05-01", to: "2026-05-03", days: 3, reason: "Extended travel",  status: "rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const TYPE_COLORS: Record<string, string> = {
  Annual:    "bg-blue-100 text-blue-700",
  Sick:      "bg-red-100 text-red-700",
  Emergency: "bg-orange-100 text-orange-700",
  Unpaid:    "bg-gray-100 text-gray-700",
};

export default function LeaveApprovalCard() {
  const [approvals, setApprovals] = useState(pendingLeaveApprovals);

  const handleApproval = (id: number, action: "approved" | "rejected") => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
  };

  const pending  = approvals.filter(a => a.status === "pending").length;
  const approved = approvals.filter(a => a.status === "approved").length;
  const rejected = approvals.filter(a => a.status === "rejected").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarOff className="w-5 h-5 text-orange-500" /> Leave Approvals
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{pending} pending</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">{approved} approved</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">{rejected} rejected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                <CalendarOff className="w-4 h-4 text-orange-500" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLES[item.status]}`}>
                {item.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-card-foreground">{item.employee}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] ?? "bg-muted text-muted-foreground"}`}>
                {item.type}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-0.5">
              {item.from} → {item.to} · {item.days} day{item.days !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground truncate">{item.reason || "—"}</p>

            {item.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleApproval(item.id, "approved")}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleApproval(item.id, "rejected")}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
