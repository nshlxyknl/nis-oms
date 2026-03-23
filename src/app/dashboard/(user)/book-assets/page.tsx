"use client";
import { useState } from "react";
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

type AssetStatus = "available" | "assigned" | "maintenance";

interface Asset {
  id: number;
  name: string;
  category: string;
  status: AssetStatus;
  assignedTo?: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: 1, name: 'MacBook Pro 16"',  category: "Laptop",     status: "assigned",    assignedTo: "Alice Johnson" },
  { id: 2, name: 'Dell Monitor 27"', category: "Peripheral", status: "assigned",    assignedTo: "Carol White" },
  { id: 3, name: "Standing Desk",    category: "Furniture",  status: "available" },
  { id: 4, name: "Logitech Webcam",  category: "Peripheral", status: "maintenance" },
  { id: 5, name: "iPad Pro 12.9",    category: "Tablet",     status: "available" },
  { id: 6, name: "Ergonomic Chair",  category: "Furniture",  status: "available" },
];

const CURRENT_USER = { id: 10, name: "Bob Smith" };

export default function BookAssetsPage() {
  const [assets, setAssets]     = useState<Asset[]>(MOCK_ASSETS);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [note, setNote]         = useState("");

  const handleRequest = () => {
    if (!selected) return;
    setAssets(prev =>
      prev.map(a =>
        a.id === selected.id
          ? { ...a, status: "assigned", assignedTo: CURRENT_USER.name }
          : a
      )
    );
    toast.success(`"${selected.name}" assigned to you`);
    setSelected(null);
    setNote("");
  };

  const closeDialog = () => {
    setSelected(null);
    setNote("");
  };

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
              {asset.category}{asset.assignedTo ? ` · ${asset.assignedTo}` : ""}
            </p>

            <Button
              size="sm"
              className="w-full"
              disabled={asset.status !== "available"}
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
              Category: {selected?.category}
            </p>
            <Input
              placeholder="Reason / notes (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button onClick={handleRequest}>Confirm Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
