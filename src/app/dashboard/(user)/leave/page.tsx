"use client";
import { useState } from "react";
import { CalendarOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type LeaveStatus = "pending" | "approved" | "rejected";
type LeaveType   = "annual" | "sick" | "emergency" | "unpaid";

interface LeaveRequest {
  id: number;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

const STATUS_STYLES: Record<LeaveStatus, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const LEAVE_BALANCE = [
  { label: "Annual",    total: 15,  used: 5, color: "bg-blue-500"   },
  { label: "Sick",      total: 10,  used: 2, color: "bg-red-400"    },
  { label: "Emergency", total: 3,   used: 1, color: "bg-orange-400" },
  { label: "Unpaid",    total: 999, used: 0, color: "bg-gray-400"   },
];

const INITIAL_REQUESTS: LeaveRequest[] = [
  { id: 1, type: "annual",    from: "2026-03-10", to: "2026-03-12", days: 3, reason: "Family vacation",   status: "approved", appliedOn: "2026-03-01" },
  { id: 2, type: "sick",      from: "2026-02-20", to: "2026-02-21", days: 2, reason: "Fever and rest",    status: "approved", appliedOn: "2026-02-20" },
  { id: 3, type: "emergency", from: "2026-04-05", to: "2026-04-05", days: 1, reason: "Personal matter",   status: "pending",  appliedOn: "2026-03-20" },
];

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState({ type: "" as LeaveType | "", from: "", to: "", reason: "" });

  const closeDialog = () => {
    setOpen(false);
    setForm({ type: "", from: "", to: "", reason: "" });
  };

  const calcDays = (from: string, to: string) => {
    if (!from || !to) return 0;
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.from || !form.to) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newRequest: LeaveRequest = {
      id:        requests.length + 1,
      type:      form.type as LeaveType,
      from:      form.from,
      to:        form.to,
      days:      calcDays(form.from, form.to),
      reason:    form.reason,
      status:    "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };
    setRequests(prev => [newRequest, ...prev]);
    toast.success("Leave request submitted");
    closeDialog();
  };

  return (
    <div className="p-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarOff className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-foreground">Leave Requests</h2>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Apply Leave
        </Button>
      </div>

      {/* Leave balance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LEAVE_BALANCE.map((b) => {
          const remaining = b.total === 999 ? "∞" : b.total - b.used;
          const pct       = b.total === 999 ? 0 : Math.round((b.used / b.total) * 100);
          return (
            <div key={b.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{b.label}</p>
              <p className="text-2xl font-semibold text-foreground">{remaining}</p>
              <p className="text-[11px] text-muted-foreground mb-2">
                {b.total === 999 ? "Unlimited" : `${b.used} used of ${b.total}`}
              </p>
              {b.total !== 999 && (
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Requests table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="border-b border-border">
              {[
                { label: "Type",       width: "14%" },
                { label: "From",       width: "14%" },
                { label: "To",         width: "14%" },
                { label: "Days",       width: "8%"  },
                { label: "Reason",     width: "30%" },
                { label: "Status",     width: "12%" },
                { label: "Applied on", width: "14%" },
              ].map((h) => (
                <th
                  key={h.label}
                  style={{ width: h.width }}
                  className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                  No leave requests yet
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 text-xs capitalize">{r.type}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.from}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.to}</td>
                  <td className="px-4 py-3 text-xs">{r.days}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground truncate">{r.reason || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.appliedOn}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
          {requests.length} request{requests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Apply leave dialog */}
      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v as LeaveType }))}>
              <SelectTrigger>
                <SelectValue placeholder="Leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">From</label>
                <Input type="date" value={form.from} onChange={(e) => setForm(f => ({ ...f, from: e.target.value }))} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">To</label>
                <Input type="date" value={form.to} onChange={(e) => setForm(f => ({ ...f, to: e.target.value }))} />
              </div>
            </div>

            {form.from && form.to && (
              <p className="text-xs text-muted-foreground">
                Duration: {calcDays(form.from, form.to)} day(s)
              </p>
            )}

            <Input
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
