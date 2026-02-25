import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SkeletonCard = () => {
  return (
<div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-55 border-r bg-white flex flex-col gap-2 p-4 shrink-0">
        {/* User */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-10 h-2.5" />
          </div>
        </div>

        {/* Nav items */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-3" style={{ width: `${60 + i * 8}px` }} />
          </div>
        ))}

        {/* Bottom links */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5" />
            <Skeleton className="w-24 h-2.5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5" />
            <Skeleton className="w-20 h-2.5" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-7">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-44 h-6" />
          </div>
          <Skeleton className="w-48 h-8 rounded-lg" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Dashboard header card */}
          <div className="border rounded-xl p-5 flex items-center gap-4 mb-8 bg-white">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-40 h-5" />
              <Skeleton className="w-64 h-3.5" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Skeleton className="w-32 h-5 mb-5" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-xl p-6 bg-white flex flex-col gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <Skeleton className="w-2/3 h-4" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-4/5 h-3" />
                  </div>
                  <Skeleton className="w-28 h-3.5 mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Notices */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-20 h-5" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-xl p-5 bg-white flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="w-14 h-2.5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-3.5" />
                    <Skeleton className="w-4/5 h-3.5" />
                  </div>
                  <Skeleton className="w-24 h-2.5" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>  )
}

export default SkeletonCard