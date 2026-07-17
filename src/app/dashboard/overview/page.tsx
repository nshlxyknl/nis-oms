"use client";

import AdminOverview from '@/components/pages/AdminOverview'
import UserOverview from '@/components/pages/UserOverview'
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from 'react';

const Overviewpage = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (user?.role === "admin") {
    return <AdminOverview/>
  }

  return <UserOverview/>
}

export default Overviewpage