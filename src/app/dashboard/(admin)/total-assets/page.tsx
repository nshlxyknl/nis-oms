"use client";
import TotalCards, { BaseItems } from "@/components/cards/TotalCards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Package, Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface Asset extends BaseItems {
  category: string;
  assignedTo: string;
  assignedToId?: number;
}

const TotalAssets = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  // Fetch assets
  const { data: assetsData = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.get('/assets'),
  });

  // Fetch employees for assignment
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.get('/employees'),
  });

  // Transform API data to match component interface
  const assets: Asset[] = assetsData.map((asset: any) => ({
    id: asset.id,
    name: asset.name,
    category: asset.type,
    assignedTo: asset.assignedTo || "—",
    assignedToId: asset.assignedToId,
    status: asset.status,
  }));

  // Create asset mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/assets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset added successfully');
      setOpen(false);
      setFormData({ name: "", type: "" });
    },
    onError: () => toast.error('Failed to add asset'),
  });

  // Update asset status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, assignedToId }: { id: number; status: string; assignedToId?: number }) =>
      api.patch(`/assets/${id}/status`, { status: status.toUpperCase(), assignedToId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset status updated');
    },
    onError: () => toast.error('Failed to update asset status'),
  });

  const handleStatusChange = (
    assetId: number,
    newStatus: "available" | "occupied" | "maintenance" | "assigned",
    userId?: number
  ) => {
    updateStatusMutation.mutate({
      id: assetId,
      status: newStatus,
      assignedToId: newStatus === "assigned" ? userId : undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex m-10 gap-4 justify-between items-center">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="m-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex m-10 gap-4 justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" /> Assets
        </h2>
        <Button onClick={() => setOpen(true)}>
          New <Plus />
        </Button>
      </div>
      <TotalCards<Asset>
        title="Assets"
        items={assets}
        icon={<Package className="w-4 h-4 text-blue-600" />}
        iconBg="bg-blue-100"
        accentColor="hover:border-blue-400"
        renderSubtitle={(asset) => `${asset.category} · ${asset.assignedTo}`}
        onStatusChange={handleStatusChange}
        type="asset"
        users={employees}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Asset Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Peripheral">Peripheral</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full bg-primary text-white rounded-md p-2"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Save Asset"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TotalAssets;
