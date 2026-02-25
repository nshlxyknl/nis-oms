import { Package } from 'lucide-react'

const TotalAssets = () => {
const assets = [
  { id: 1, name: "MacBook Pro 16\"", category: "Laptop", assignedTo: "Alice Johnson", status: "assigned" },
  { id: 2, name: "Dell Monitor 27\"", category: "Peripheral", assignedTo: "Bob Smith", status: "assigned" },
  { id: 3, name: "Standing Desk", category: "Furniture", assignedTo: "—", status: "available" },
  { id: 4, name: "Logitech Webcam", category: "Peripheral", assignedTo: "—", status: "maintenance" },
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
              <Package className="w-5 h-5 text-blue-600" /> Assets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[asset.status]}`}>
                      {asset.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground mb-1">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground">{asset.category} · {asset.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>  )
}

export default TotalAssets