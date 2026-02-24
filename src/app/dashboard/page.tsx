"use client"


import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Dashboard = () => {

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

    redirect("/dashboard/overview")

      
}

export default Dashboard