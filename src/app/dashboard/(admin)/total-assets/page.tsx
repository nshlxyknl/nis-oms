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

interface Assets extends BaseItems {
  category: string;
  assignedTo: string;
}

const TotalAssets = () => {
  const [assets, setAssets] = useState<Assets[]>([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      category: "Laptop",
      assignedTo: "Alice Johnson",
      status: "assigned",
    },
    {
      id: 2,
      name: 'Dell Monitor 27"',
      category: "Peripheral",
      assignedTo: "Bob Smith",
      status: "assigned",
    },
    {
      id: 3,
      name: "Standing Desk",
      category: "Furniture",
      assignedTo: "—",
      status: "available",
    },
    {
      id: 4,
      name: "Logitech Webcam",
      category: "Peripheral",
      assignedTo: "—",
      status: "maintenance",
    },
  ]);

  const [open, setOpen] = useState<boolean>(false);

  const handleStatusChange = (assetId: number, newStatus: "available" | "occupied" | "maintenance" | "assigned", userId?: number) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.id === assetId) {
          const updatedAsset = { ...asset, status: newStatus };
          // If assigning to a user, update the assignedTo field
          if (newStatus === "assigned" && userId) {
            const user = mockUsers.find(u => u.id === userId);
            updatedAsset.assignedTo = user ? user.name : "—";
          } else if (newStatus === "available") {
            updatedAsset.assignedTo = "—";
          }
          return updatedAsset;
        }
        return asset;
      })
    );
    
    if (userId) {
      const user = mockUsers.find(u => u.id === userId);
      toast.success(`Asset assigned to ${user?.name}`);
    } else {
      toast.success(`Asset status updated to ${newStatus}`);
    }
  };

  
  const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@company.com", role: "USER" },
    { id: 2, name: "Bob Smith", email: "bob@company.com", role: "USER" },
    { id: 3, name: "Charlie Davis", email: "charlie@company.com", role: "USER" },
    { id: 4, name: "Diana Prince", email: "diana@company.com", role: "ADMIN" },
    { id: 5, name: "Ethan Hunt", email: "ethan@company.com", role: "ADMIN" },
    { id: 6, name: "Fiona Green", email: "fiona@company.com", role: "USER" },
  ] as const;

  return (
    <div>
      <div className="flex  m-10 gap-249 justify-evenly">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 ">
          <Package className="w-5 h-5 text-blue-600" /> Assets
        </h2>

        <Button onClick={() => setOpen(true)}>
          New <Plus />{" "}
        </Button>
      </div>
      <TotalCards<Assets>
        title="Assets"
        items={assets}
        icon={<Package className="w-4 h-4 text-blue-600" />}
        iconBg="bg-blue-100"
        accentColor="hover:border-blue-400"
        renderSubtitle={(asset) => `${asset.category} · ${asset.assignedTo}`}
        onStatusChange={handleStatusChange}
        type="asset"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Assets</DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
            <Input placeholder="name" className="w-100"></Input>

            <Select>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Peripheral">Peripheral</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full bg-primary text-white rounded-md p-2"
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TotalAssets;
