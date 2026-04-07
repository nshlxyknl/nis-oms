"use client"

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
    <div>
      <div className="p-8 flex items-center gap-2 mb-4">
        <Megaphone className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold text-foreground">Notices</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex flex-col bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3 h-9">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${notice.pinned ? "bg-warning/10" : "bg-primary/10"}`}>
                {notice.pinned
                  ? <Pin className="w-4 h-4 text-warning" />
                  : <Megaphone className="w-4 h-4 text-primary" />
                }
              </div>
              {notice.pinned && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                  Pinned
                </span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-card-foreground mb-1 leading-snug line-clamp-2">
                {notice.title}
              </h3>
              <p className="text-xs text-muted-foreground">{notice.date}</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="mt-4 h-7 text-xs gap-1.5 w-full"
              onClick={() => togglePin(notice.id, notice.pinned)}
            >
              <Pin className="w-3 h-3" />
              {notice.pinned ? 'Unpin' : 'Pin me'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoticePage;
