import { EmployeeTable } from '@/components/pages/EmployeeTable';
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

  

  return (
    <div className='m-10 flex flex-col gap-4'>
<h2 className="text-lg font-semibold text-foreground flex items-center gap-2 ">
          <Users className="w-5 h-5 text-blue-600" /> My Employees
        </h2>   
         <EmployeeTable/>
    </div>
  )
}

export default Employeespage