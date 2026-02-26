import { useState } from 'react';
import { Button } from '../ui/button'
import { CheckCircle, DoorOpen, Package, XCircle } from 'lucide-react'

interface IRooms {
  id: number,
  name: String,
  capacity: number,
  floor: String,
  status: String

}

const pendingRoomApprovals = [
  { id: 1, employee: "Alice Johnson", room: "Conference Room A", date: "Feb 25, 2026", time: "10:00 AM – 11:00 AM", status: "pending" },
  { id: 2, employee: "Bob Smith", room: "Board Room", date: "Feb 26, 2026", time: "2:00 PM – 3:30 PM", status: "pending" },
  { id: 3, employee: "Carol White", room: "Meeting Room 3", date: "Feb 27, 2026", time: "9:00 AM – 10:00 AM", status: "pending" },
];


const RoomApprovalCard = () => {

  const [roomApprovals, setRoomApprovals] = useState(pendingRoomApprovals);


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

  const handleApproval = (id: number, action: "approved" | "rejected") => {
    setRoomApprovals(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    console.log(`Item ${id} was ${action}d`);

  };




  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <DoorOpen className="w-5 h-5 text-yellow-600" /> Room Booking Approvals
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roomApprovals.map((item) => (
          <div key={item.id} className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                <DoorOpen className="w-4 h-4 text-yellow-600" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                {item.status}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-card-foreground mb-1">{item.room}</h3>
            <p className="text-xs text-muted-foreground mb-0.5">By {item.employee}</p>
            <p className="text-xs text-muted-foreground mb-1">{item.date} · {item.time}</p>
            {item.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleApproval(item.id, "approved")}>
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleApproval(item.id, "rejected")}>
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomApprovalCard