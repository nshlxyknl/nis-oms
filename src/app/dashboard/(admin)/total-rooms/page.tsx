"use client";
import { Building, DoorOpen } from 'lucide-react';
import TotalCards from '@/components/cards/TotalCards';
import { BaseItems } from '@/components/cards/TotalCards';
import { useState } from 'react';
import { toast } from 'sonner';

interface Rooms extends BaseItems{
  capacity: number;
  floor: string;
  occupiedBy?: string;
}

const TotalRooms = () => {
  const [rooms, setRooms] = useState<Rooms[]>([
    { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available", occupiedBy: undefined },
    { id: 2, name: "Board Room", capacity: 20, floor: "3rd", status: "occupied", occupiedBy: "Diana Prince" },
    { id: 3, name: "Meeting Room 3", capacity: 6, floor: "1st", status: "available", occupiedBy: undefined },
    { id: 4, name: "Huddle Space", capacity: 4, floor: "1st", status: "maintenance", occupiedBy: undefined },
  ]);

  const handleStatusChange = (roomId: number, newStatus: "available" | "occupied" | "maintenance" | "assigned", userId?: number) => {
    setRooms(prevRooms => 
      prevRooms.map(room => {
        if (room.id === roomId) {
          const updatedRoom = { ...room, status: newStatus };
          // If occupying with an admin, update the occupiedBy field
          if (newStatus === "occupied" && userId) {
            const admin = mockAdmins.find(a => a.id === userId);
            updatedRoom.occupiedBy = admin ? admin.name : undefined;
          } else if (newStatus === "available") {
            updatedRoom.occupiedBy = undefined;
          }
          return updatedRoom;
        }
        return room;
      })
    );
    
    if (userId) {
      const admin = mockAdmins.find(a => a.id === userId);
      toast.success(`Room occupied by ${admin?.name}`);
    } else {
      toast.success(`Room status updated to ${newStatus}`);
    }
  };

  const mockAdmins = [
    { id: 4, name: "Diana Prince", email: "diana@company.com", role: "ADMIN" },
    { id: 5, name: "Ethan Hunt", email: "ethan@company.com", role: "ADMIN" },
  ] as const;

  

  return (<div>
    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mt-10 ml-14">
      <DoorOpen className="w-5 h-5 text-purple-600 " /> Rooms
    </h2>
    <TotalCards<Rooms>
      title="Rooms"
      items={rooms}
      icon={<Building className="w-4 h-4 text-purple-600" />}
      iconBg="bg-purple-100"
      accentColor="hover:border-purple-400"
      renderSubtitle={(room) => `Capacity: ${room.capacity} · ${room.floor} Floor${room.occupiedBy ? ` · ${room.occupiedBy}` : ''}`}
      onStatusChange={handleStatusChange}
      type="room"
    />
    </div>
 )
}

export default TotalRooms