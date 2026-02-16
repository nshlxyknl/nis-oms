"use client"

import AdminDashboard from '@/components/pages/AdminDashboard'
import UserDashboard from '@/components/pages/UserDashboard'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

const Dashboard = () => {
    const { data: session } = useSession()

    useEffect(() => {
    // Prevent back button
    window.history.pushState(null, '', window.location.href)
    
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  return (<>
{session?.user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}  
      </>
      )
      
}

export default Dashboard