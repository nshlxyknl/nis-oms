"use client";

import AdminOverview from '@/components/pages/AdminOverview'
import UserOverview from '@/components/pages/UserOverview'
import { useAuth } from "@/hooks/useAuth"

const Overviewpage = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminOverview/>
  }

  return <UserOverview/>
}

export default Overviewpage