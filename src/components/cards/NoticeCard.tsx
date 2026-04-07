"use client"

import { useQuery } from '@tanstack/react-query';
import { Megaphone, Pin } from 'lucide-react';
import { api } from '@/services/api';
import { Notice, notidata } from '@/services/data/NoticeData';
import { Button } from '../ui/button';
import NoticePage from '@/app/dashboard/notices/page';

  

export const NoticeCard = () => {
const { data, isLoading } = useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn:  () => api.get('/notices'),
  });

const notices = Array.isArray(data) ? data : notidata;

  if (isLoading) return <div>Loading..</div>;
  return (
notices
  .filter((n) => n.pinned)  
  .map((n) => (
    <NoticePage key={n.id} />
  ))
      
    )
}

export default NoticeCard