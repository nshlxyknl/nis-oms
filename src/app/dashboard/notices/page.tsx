import { Notice, notidata } from '@/services/data/NoticeData';
import { Megaphone, Pin } from 'lucide-react'

const NoticePage = () => {

  const noti: Notice[] = notidata;

  return (
<div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Megaphone className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">All Notices</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {noti.map((notice) => (
          <div
            key={notice.id}
            className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${notice.pinned ? "bg-warning/10" : "bg-primary/10"}`}>
                {notice.pinned ? (
                  <Pin className="w-4 h-4 text-warning" />
                ) : (
                  <Megaphone className="w-4 h-4 text-primary" />
                )}
              </div>
              {notice.pinned && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-card-foreground mb-2 leading-snug line-clamp-2">
              {notice.title}
            </h3>
            <p className="text-xs text-muted-foreground">{notice.date}</p>
          </div>
        ))}
      </div>
    </div>  )
}

export default NoticePage