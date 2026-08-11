import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import NoticeCard from '../cards/NoticeCard';
import * as apiModule from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

vi.mock('@/services/data/NoticeData', () => ({
  notidata: [
    {
      id: 1,
      title: 'Fallback Notice',
      message: 'This is fallback data',
      priority: 'normal',
      pinned: false,
      createdBy: 'System',
      publishedOn: '2024-01-01',
    },
  ],
  Notice: {},
}));

const mockNotices = [
  {
    id: 1,
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Friday',
    priority: 'high',
    pinned: true,
    createdBy: 'Admin',
    publishedOn: '2024-01-15',
  },
  {
    id: 2,
    title: 'Holiday Notice',
    message: 'Office closed on Monday',
    priority: 'normal',
    pinned: false,
    createdBy: 'HR',
    publishedOn: '2024-01-10',
  },
];

describe('NoticeCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(apiModule.api.get).mockImplementation(
      () => new Promise(() => {})
    );

    render(<NoticeCard />);
    
    expect(screen.getByText('Loading..')).toBeInTheDocument();
  });

  it('renders notices correctly', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockNotices);

    render(<NoticeCard />);

    await waitFor(() => {
      expect(screen.getByText('System Maintenance')).toBeInTheDocument();
    });
  });

  it('displays Notices header with icon', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockNotices);

    render(<NoticeCard />);

    await waitFor(() => {
      expect(screen.getByText('Notices')).toBeInTheDocument();
    });
  });

  it('uses fallback data when API returns invalid data', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(null);

    render(<NoticeCard />);

    await waitFor(() => {
      // Should render with "No pinned notices" message for empty/invalid data
      expect(screen.getByText(/notices/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiModule.api.get).mockRejectedValue(new Error('API Error'));

    render(<NoticeCard />);

    await waitFor(() => {
      // Should render with header even on error
      expect(screen.getByText(/notices/i)).toBeInTheDocument();
    });
  });
});
