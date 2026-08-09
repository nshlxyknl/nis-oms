"use client";
import { Package } from "lucide-react";
import { statusColors } from "@/lib/statuscolor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

type AssetStatus = "available" | "assigned" | "maintenance";

interface Asset {
  id: number;
  name: string;
  type: string;
  status: AssetStatus;
  assignedTo?: string;
  assignedToId?: number;
}

export default function BookAssetsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Asset | null>(null);
  const [reason, setReason] = useState("");

  // Fetch assets
  const { data: assets = [], isLoading } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: () => api.get('/assets'),
  });

  // Create asset request mutation
  const requestMutation = useMutation({
    mutationFn: (data: { assetId: number; reason?: string }) =>
      api.post('/asset-requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      toast.success('Asset request submitted successfully');
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit asset request');
    },
  });

  const handleRequest = () => {
    if (!selected) return;
    requestMutation.mutate({
      assetId: selected.id,
      reason: reason || undefined,
    });
  };

  const closeDialog = () => {
    setSelected(null);
    setReason("");
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-6 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-blue-600" /> Book an Asset
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[asset.status]}`}>
                {asset.status}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-card-foreground mb-1">{asset.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {asset.type}{asset.assignedTo ? ` · ${asset.assignedTo}` : ""}
            </p>

            <Button
              size="sm"
              className="w-full"
              disabled={asset.status !== "available" || requestMutation.isPending}
              onClick={() => setSelected(asset)}
            >
              {asset.status === "available" ? "Request Asset" : "Unavailable"}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Type: {selected?.type}
            </p>
            <Input
              placeholder="Reason / notes (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button 
                onClick={handleRequest}
                disabled={requestMutation.isPending}
              >
                {requestMutation.isPending ? 'Submitting...' : 'Confirm Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
