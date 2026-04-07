
"use client"
import NoticeGrid from '@/components/pages/NoticeGrid';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { Notice, notidata } from '@/services/data/NoticeData';
import { useQuery } from '@tanstack/react-query';
import { Megaphone, Pin } from 'lucide-react'
import { toast } from 'sonner';

const NoticePage = () => {
  const { data, isLoading } = useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn:  () => api.get('/notices'),
  });


  const initial = Array.isArray(data) ? data : notidata;
  const [notices, setNotices] = useState<Notice[]>(initial);

  const togglePin = (id: number, pinned: boolean) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !pinned } : n));
    toast.success(pinned ? 'Notice unpinned' : 'Notice pinned');
  };

  if (isLoading) return <div>Loading..</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Megaphone className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Notices</h2>
      </div>
      <NoticeGrid notices={notices} />
    </div>
  );
};

export default NoticePage;
