import { Building, DoorOpen } from 'lucide-react';
import React from 'react'
import { statusColors } from '@/lib/statuscolor';
import TotalCards from '@/components/cards/TotalCards';

const TotalRooms = () => {

  const rooms = [
  { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available" },
  { id: 2, name: "Board Room", capacity: 20, floor: "3rd", status: "occupied" },
  { id: 3, name: "Meeting Room 3", capacity: 6, floor: "1st", status: "available" },
  { id: 4, name: "Huddle Space", capacity: 4, floor: "1st", status: "maintenance" },
];

  

  return (
    <TotalCards
    title="Rooms"
  items={rooms}
  icon={<Building className="w-4 h-4 text-purple-600" />}
  iconBg="bg-purple-100"
  accentColor="hover:border-purple-400"
  renderSubtitle={(room) => `Capacity: ${room.capacity} · ${room.floor} Floor`}
    />
 )
}

export default TotalRooms