"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Notice } from '@/services/data/NoticeData';
import { Megaphone, Pin } from 'lucide-react';
import { toast } from 'sonner';

interface NoticeGridProps {
  notices: Notice[];
  pinnedOnly?: boolean;
  showActions?: boolean;
}

export default function NoticeGrid({ notices: initial, pinnedOnly = false, showActions = true }: NoticeGridProps) {
  const [notices, setNotices] = useState<Notice[]>(initial);

  const togglePin = (id: number, pinned: boolean) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !pinned } : n));
    toast.success(pinned ? 'Notice unpinned' : 'Notice pinned');
  };

  const visible = pinnedOnly ? notices.filter(n => n.pinned) : notices;

  if (visible.length === 0)
    return <p className="text-sm text-muted-foreground">No pinned notices.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {visible.map((notice) => (
        <div
          key={notice.id}
          className="flex flex-col bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40"
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

          {showActions && (
            <Button
              size="sm"
              variant="outline"
              className="mt-4 h-7 text-xs gap-1.5 w-full"
              onClick={() => togglePin(notice.id, notice.pinned)}
            >
              <Pin className="w-3 h-3" />
              {notice.pinned ? 'Unpin' : 'Pin me'}
            </Button>
                    )}
        </div>
      ))}
    </div>
  );
}
