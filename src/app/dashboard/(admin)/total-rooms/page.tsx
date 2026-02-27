import { Building, DoorOpen } from 'lucide-react';
import TotalCards from '@/components/cards/TotalCards';
import { BaseItems } from '@/components/cards/TotalCards';

interface Rooms extends BaseItems{
capacity: number;
  floor: string;
}

const TotalRooms = () => {

  const rooms =  [
  { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available" },
  { id: 2, name: "Board Room", capacity: 20, floor: "3rd", status: "occupied" },
  { id: 3, name: "Meeting Room 3", capacity: 6, floor: "1st", status: "available" },
  { id: 4, name: "Huddle Space", capacity: 4, floor: "1st", status: "maintenance" },
] as Rooms[];

  

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
  renderSubtitle={(room) => `Capacity: ${room.capacity} · ${room.floor} Floor`}
    />
    </div>
 )
}

export default TotalRooms