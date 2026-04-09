"use client";

import { useQuery } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { api } from '@/services/api';
import { Notice, notidata } from '@/services/data/NoticeData';
import NoticeGrid from '@/components/pages/NoticeGrid';

export const NoticeCard = () => {
  const { data, isLoading } = useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn:  () => api.get('/notices'),
  });

  const notices = Array.isArray(data) ? data : notidata;

  if (isLoading) return <div>Loading..</div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold text-foreground">Notices</h2>
      </div>
      <NoticeGrid notices={notices} pinnedOnly showActions={false} />
    </div>
  );
};

export default NoticeCard;
