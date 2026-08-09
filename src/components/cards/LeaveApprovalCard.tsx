"use client";
import { Button } from "../ui/button";
import { CalendarOff, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { toast } from "sonner";

interface LeaveApproval {
  id: number;
  userId: number;
  userName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: string;
  approvedBy?: string;
  appliedOn: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const TYPE_COLORS: Record<string, string> = {
  annual:    "bg-blue-100 text-blue-700",
  sick:      "bg-red-100 text-red-700",
  emergency: "bg-orange-100 text-orange-700",
  unpaid:    "bg-gray-100 text-gray-700",
};

export default function LeaveApprovalCard() {
  const queryClient = useQueryClient();

  // Fetch leave requests
  const { data: approvals = [], isLoading } = useQuery<LeaveApproval[]>({
    queryKey: ['leaves'],
    queryFn: () => api.get('/leaves'),
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/leaves/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave request approved');
    },
    onError: () => toast.error('Failed to approve leave request'),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/leaves/${id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave request rejected');
    },
    onError: () => toast.error('Failed to reject leave request'),
  });

  const handleApproval = (id: number, action: "approved" | "rejected") => {
    if (action === "approved") {
      approveMutation.mutate(id);
    } else {
      rejectMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

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
        {approvals.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No leave requests yet
          </div>
        ) : (
          approvals.map((item) => (
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
                <h3 className="text-sm font-semibold text-card-foreground">{item.userName}</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[item.type] ?? "bg-muted text-muted-foreground"}`}>
                  {item.type}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-0.5">
                {item.startDate} → {item.endDate} · {item.days} day{item.days !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground truncate">{item.reason || "—"}</p>

              {item.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleApproval(item.id, "approved")}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleApproval(item.id, "rejected")}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
