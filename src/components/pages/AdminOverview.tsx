import { LayoutDashboard } from 'lucide-react'
import React from 'react'
import FeaturesCard from '../cards/FeaturesCard'
import NoticeCard from '../cards/NoticeCard'

const AdminOverview = () => {
  return (
      <main className="w-full mx-auto px-6 py-8">
       
        <div className="rounded-xl border border-border bg-card p-5 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage approvals, employees, rooms and assets.</p>
          </div>
        </div>

<FeaturesCard/>
<NoticeCard/>
        </main>
  )
}

export default AdminOverview