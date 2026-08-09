"use client";
import { Building, DoorOpen, Plus } from 'lucide-react';
import TotalCards from '@/components/cards/TotalCards';
import { BaseItems } from '@/components/cards/TotalCards';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Room extends BaseItems {
  capacity: number;
  floor?: string;
}

const TotalRooms = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
  });

  // Fetch rooms
  const { data: roomsData = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms'),
  });

  // Transform API data to match component interface
  const rooms: Room[] = roomsData.map((room: any) => ({
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    status: room.status,
    floor: undefined, // API doesn't have floor, keep for UI consistency
  }));

  // Create room mutation
  const createMutation = useMutation({
    mutationFn: (data: { name: string; capacity: number }) => 
      api.post('/rooms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room added successfully');
      setOpen(false);
      setFormData({ name: '', capacity: '' });
    },
    onError: () => toast.error('Failed to add room'),
  });

  // Update room status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/rooms/${id}/status`, { status: status.toUpperCase() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room status updated');
    },
    onError: () => toast.error('Failed to update room status'),
  });

  const handleStatusChange = (
    roomId: number,
    newStatus: "available" | "occupied" | "maintenance" | "assigned"
  ) => {
    updateStatusMutation.mutate({
      id: roomId,
      status: newStatus,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) {
      toast.error('Please fill in all fields');
      return;
    }
    createMutation.mutate({
      name: formData.name,
      capacity: parseInt(formData.capacity),
    });
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
      <div className="flex m-10 gap-4 justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-purple-600" /> Rooms
        </h2>
        <Button onClick={() => setOpen(true)}>
          New <Plus />
        </Button>
      </div>
      
      <TotalCards<Room>
        title="Rooms"
        items={rooms}
        icon={<Building className="w-4 h-4 text-purple-600" />}
        iconBg="bg-purple-100"
        accentColor="hover:border-purple-400"
        renderSubtitle={(room) => `Capacity: ${room.capacity}${room.floor ? ` · ${room.floor} Floor` : ''}`}
        onStatusChange={handleStatusChange}
        type="room"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Room Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              min="1"
              required
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white rounded-md p-2"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Room'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TotalRooms;