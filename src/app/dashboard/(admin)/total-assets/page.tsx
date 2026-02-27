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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assets extends BaseItems {
  category: string;
  assignedTo: string;
}

const TotalAssets = () => {
  const assets = [
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
  ] as Assets[];

  const [open, setOpen] = useState<boolean>(false);

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
         statusOptions={[                          // 👈 asset specific
    { value: "assigned", label: "Assigned" },
    { value: "available", label: "Available" },
    { value: "maintenance", label: "Maintenance" },
  ]}
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
