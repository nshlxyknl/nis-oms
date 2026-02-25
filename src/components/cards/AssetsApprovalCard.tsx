import React, { useState } from 'react'
import { Button } from '../ui/button'
import { CheckCircle, Package, XCircle } from 'lucide-react'

const pendingAssetApprovals = [
  { id: 1, employee: "David Lee", asset: "MacBook Pro 16\"", type: "Laptop", date: "Feb 22, 2026", status: "pending" },
  { id: 2, employee: "Emma Davis", asset: "Ergonomic Chair", type: "Furniture", date: "Feb 23, 2026", status: "pending" },
  { id: 3, employee: "Frank Miller", asset: "External Monitor 27\"", type: "Peripheral", date: "Feb 24, 2026", status: "pending" },
];

const AssetsApprovalCard = () => {
      const [assetApprovals, setAssetApprovals] = useState(pendingAssetApprovals);


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

    const handleApproval = ( id: number, action: "approved" | "rejected") => {
    
      setAssetApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    
  };
  return (
     <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Asset Request Approvals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetApprovals.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-1">{item.asset}</h3>
                    <p className="text-xs text-muted-foreground mb-0.5">By {item.employee} · {item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    {item.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleApproval( item.id, "approved")}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleApproval( item.id, "rejected")}>
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

export default AssetsApprovalCard