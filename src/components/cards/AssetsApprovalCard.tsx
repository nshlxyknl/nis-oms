"use client";
import { Button } from '../ui/button';
import { CheckCircle, Package, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface AssetRequest {
  id: number;
  userId: number;
  user: {
    name: string;
  };
  assetId: number;
  asset: {
    name: string;
    type: string;
  };
  reason?: string;
  status: string;
  approvedBy?: {
    name: string;
  };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AssetsApprovalCard = () => {
  const queryClient = useQueryClient();

  // Fetch asset requests
  const { data: requests = [], isLoading } = useQuery<AssetRequest[]>({
    queryKey: ['asset-requests'],
    queryFn: () => api.get('/asset-requests'),
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/asset-requests/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset request approved');
    },
    onError: () => toast.error('Failed to approve asset request'),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/asset-requests/${id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      toast.success('Asset request rejected');
    },
    onError: () => toast.error('Failed to reject asset request'),
  });

  const handleApproval = (id: number, action: "approved" | "rejected") => {
    if (action === "approved") {
      approveMutation.mutate(id);
    } else {
      rejectMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-56 bg-muted animate-pulse rounded" />
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

  const pending = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" /> Asset Request Approvals
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{pending} pending</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">{approved} approved</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">{rejected} rejected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No asset requests yet
          </div>
        ) : (
          requests.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-card-foreground mb-1">{item.asset.name}</h3>
              <p className="text-xs text-muted-foreground mb-0.5">By {item.user.name} · {item.asset.type}</p>
              <p className="text-xs text-muted-foreground mb-1">{formatDate(item.createdAt)}</p>
              {item.reason && (
                <p className="text-xs text-muted-foreground truncate">Reason: {item.reason}</p>
              )}
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
};

export default AssetsApprovalCard;