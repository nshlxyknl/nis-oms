import NoticeGrid from '@/components/pages/NoticeGrid';
import { api } from '@/services/api';
import { Notice, notidata } from '@/services/data/NoticeData';
import { useQuery } from '@tanstack/react-query';
import { Megaphone, Pin } from 'lucide-react'

const NoticePage = () => {
  const { data, isLoading } = useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn:  () => api.get('/notices'),
  });

  const notices = Array.isArray(data) ? data : notidata;

  const noti: Notice[] = notidata;

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
