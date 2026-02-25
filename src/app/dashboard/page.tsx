"use client"

import SkeletonCard from '@/components/cards/SkeletonCard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return 

    if (!session) {
      router.push("/auth")
      return
    }

    router.push("/dashboard/overview")
  }, [session, status, router])

  if (status === "loading") {
    return (
     <SkeletonCard/>
    )
  }

  return null
}

export default Dashboard