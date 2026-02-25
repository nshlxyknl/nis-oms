"use client"

import RoomApprovalCard from "@/components/cards/RoomApprovalCard";

interface IRooms{
   id: number,
  name: String,
  capacity: number,
  floor: String,
  status: String

}

const RoomsPage = () => {
   const rooms : IRooms[] = [
  { id: 1, name: "Conference Room A", capacity: 12, floor: "2nd", status: "available" },
  { id: 2, name: "Board Room", capacity: 20, floor: "3rd", status: "occupied" },
  { id: 3, name: "Meeting Room 3", capacity: 6, floor: "1st", status: "available" },
  { id: 4, name: "Huddle Space", capacity: 4, floor: "1st", status: "maintenance" },
];
 

  return (
<RoomApprovalCard/>  )
}

export default RoomsPage