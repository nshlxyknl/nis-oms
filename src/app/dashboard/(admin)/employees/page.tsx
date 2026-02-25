import { Users } from 'lucide-react'
import React from 'react'

const Employeespage = () => {

  const employees = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", department: "Engineering", status: "online" },
  { id: 2, name: "Bob Smith", role: "Product Manager", department: "Product", status: "online" },
  { id: 3, name: "Carol White", role: "Designer", department: "Design", status: "offline" },
  { id: 4, name: "David Lee", role: "DevOps Engineer", department: "Engineering", status: "online" },
  { id: 5, name: "Emma Davis", role: "HR Manager", department: "Human Resources", status: "offline" },
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
              <Users className="w-5 h-5 text-blue-600" /> Employees
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div key={emp.id} className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {emp.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${emp.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground">{emp.name}</h3>
                      <p className="text-xs text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{emp.department}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[emp.status]}`}>
                      {emp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>  )
}

export default Employeespage