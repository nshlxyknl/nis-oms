import { DoorOpen } from 'lucide-react';
import React from 'react'

const TotalRooms = () => {

  const rooms = [
  { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available" },
  { id: 2, name: "Board Room", capacity: 20, floor: "3rd", status: "occupied" },
  { id: 3, name: "Meeting Room 3", capacity: 6, floor: "1st", status: "available" },
  { id: 4, name: "Huddle Space", capacity: 4, floor: "1st", status: "maintenance" },
];

   const statusColors: Record<string, string> = {
  online: "bg-green-100 text-green-800",
  offline: "bg-gray-100 text-gray-800",
  available: "bg-green-100 text-green-800",
  occupied: "bg-yellow-100 text-yellow-800",
  maintenance: "bg-red-100 text-red-800",
  assigned: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

  return (
 <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-yellow-600" /> Rooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-yellow-400">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <DoorOpen className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[room.status]}`}>
                      {room.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-1">{room.name}</h3>
                  <p className="text-xs text-muted-foreground">Capacity: {room.capacity} · {room.floor} Floor</p>
                </div>
              ))}
            </div>
          </div>  )
}

export default TotalRooms