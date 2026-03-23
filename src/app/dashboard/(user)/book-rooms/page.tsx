"use client";
import { useState } from "react";
import { Building, DoorOpen } from "lucide-react";
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

type RoomStatus = "available" | "occupied" | "maintenance";

interface Room {
  id: number;
  name: string;
  capacity: number;
  floor: string;
  status: RoomStatus;
  bookedBy?: string;
}

const MOCK_ROOMS: Room[] = [
  { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available" },
  { id: 2, name: "Board Room",        capacity: 20, floor: "3rd", status: "occupied",  bookedBy: "Diana Prince" },
  { id: 3, name: "Meeting Room 3",    capacity: 6,  floor: "1st", status: "available" },
  { id: 4, name: "Huddle Space",      capacity: 4,  floor: "1st", status: "maintenance" },
  { id: 5, name: "Training Room",     capacity: 30, floor: "4th", status: "available" },
  { id: 6, name: "Focus Pod A",       capacity: 2,  floor: "2nd", status: "available" },
];

// Logged-in user (mock)
const CURRENT_USER = { id: 10, name: "Bob Smith" };

export default function BookRoomsPage() {
  const [rooms, setRooms]       = useState<Room[]>(MOCK_ROOMS);
  const [selected, setSelected] = useState<Room | null>(null);
  const [purpose, setPurpose]   = useState("");

  const handleBook = () => {
    if (!selected) return;
    setRooms(prev =>
      prev.map(r =>
        r.id === selected.id
          ? { ...r, status: "occupied", bookedBy: CURRENT_USER.name }
          : r
      )
    );
    toast.success(`"${selected.name}" booked successfully`);
    setSelected(null);
    setPurpose("");
  };

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
        <DoorOpen className="w-5 h-5 text-purple-600" /> Book a Room
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-purple-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                <Building className="w-4 h-4 text-purple-600" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[room.status]}`}>
                {room.status}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-card-foreground mb-1">{room.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Capacity: {room.capacity} · {room.floor} Floor
              {room.bookedBy ? ` · ${room.bookedBy}` : ""}
            </p>

            <Button
              size="sm"
              className="w-full"
              disabled={room.status !== "available"}
              onClick={() => setSelected(room)}
            >
              {room.status === "available" ? "Book Room" : "Unavailable"}
            </Button>
          </div>
        ))}
      </div>

      {/* Booking confirmation dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setPurpose(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Capacity: {selected?.capacity} · {selected?.floor} Floor
            </p>
            <Input
              placeholder="Purpose / notes (optional)"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setSelected(null); setPurpose(""); }}>
                Cancel
              </Button>
              <Button onClick={handleBook}>Confirm Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
