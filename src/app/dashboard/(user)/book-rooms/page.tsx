"use client";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

type RoomStatus = "available" | "occupied" | "maintenance";

interface Room {
  id: number;
  name: string;
  capacity: number;
  status: RoomStatus;
}

export default function BookRoomsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Room | null>(null);
  const [purpose, setPurpose] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch rooms
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms'),
  });

  // Create room booking mutation
  const bookingMutation = useMutation({
    mutationFn: (data: { roomId: number; startTime: string; endTime: string; purpose?: string }) =>
      api.post('/room-bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-bookings'] });
      toast.success('Room booking submitted successfully');
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to book room');
    },
  });

  const handleBook = () => {
    if (!selected || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create ISO datetime strings
    const startDateTime = new Date(startTime).toISOString();
    const endDateTime = new Date(endTime).toISOString();

    bookingMutation.mutate({
      roomId: selected.id,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose: purpose || undefined,
    });
  };

  const closeDialog = () => {
    setSelected(null);
    setPurpose("");
    setStartTime("");
    setEndTime("");
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
              Capacity: {room.capacity}
            </p>

            <Button
              size="sm"
              className="w-full"
              disabled={room.status !== "available" || bookingMutation.isPending}
              onClick={() => setSelected(room)}
            >
              {room.status === "available" ? "Book Room" : "Unavailable"}
            </Button>
          </div>
        ))}
      </div>

      {/* Booking confirmation dialog */}
      <Dialog open={!!selected} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Capacity: {selected?.capacity}
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <Input
              placeholder="Purpose / notes (optional)"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handleBook}
                disabled={bookingMutation.isPending || !startTime || !endTime}
              >
                {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
