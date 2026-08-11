import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import NoticeGrid from '../NoticeGrid';
import { toast } from 'sonner';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

const mockNotices = [
  {
    id: 1,
    title: 'Office Closure',
    date: '2024-01-15',
    pinned: true,
  },
  {
    id: 2,
    title: 'New Policy Update',
    date: '2024-01-14',
    pinned: false,
  },
  {
    id: 3,
    title: 'Team Building Event',
    date: '2024-01-13',
    pinned: false,
  },
  {
    id: 4,
    title: 'System Maintenance',
    date: '2024-01-12',
    pinned: true,
  },
];

describe('NoticeGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all notices when pinnedOnly is false', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      expect(screen.getByText('Office Closure')).toBeInTheDocument();
      expect(screen.getByText('New Policy Update')).toBeInTheDocument();
      expect(screen.getByText('Team Building Event')).toBeInTheDocument();
      expect(screen.getByText('System Maintenance')).toBeInTheDocument();
    });

    it('renders only pinned notices when pinnedOnly is true', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={true} />);

      expect(screen.getByText('Office Closure')).toBeInTheDocument();
      expect(screen.getByText('System Maintenance')).toBeInTheDocument();
      expect(screen.queryByText('New Policy Update')).not.toBeInTheDocument();
      expect(screen.queryByText('Team Building Event')).not.toBeInTheDocument();
    });

    it('displays notice dates', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('2024-01-14')).toBeInTheDocument();
    });

    it('displays notice titles with proper truncation', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const noticeTitles = screen.getAllByText(/Office Closure|New Policy Update/);
      noticeTitles.forEach(title => {
        expect(title).toHaveClass('line-clamp-2');
      });
    });
  });

  describe('Pinned Badge', () => {
    it('shows pinned badge for pinned notices', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const pinnedBadges = screen.getAllByText('Pinned');
      expect(pinnedBadges.length).toBe(2); // Two notices are pinned
    });

    it('does not show pinned badge for unpinned notices', () => {
      const unpinnedNotices = [mockNotices[1], mockNotices[2]];
      render(<NoticeGrid notices={unpinnedNotices} pinnedOnly={false} />);

      expect(screen.queryByText('Pinned')).not.toBeInTheDocument();
    });

    it('applies correct styling to pinned badge', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const pinnedBadge = screen.getAllByText('Pinned')[0];
      expect(pinnedBadge).toHaveClass('text-warning', 'bg-warning/10');
    });
  });

  describe('Icons', () => {
    it('displays warning icon for pinned notices', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      // Check for icon containers with warning styling
      const warningContainers = container.querySelectorAll('.bg-warning\\/10');
      expect(warningContainers.length).toBeGreaterThan(0);
    });

    it('displays megaphone icon for unpinned notices', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      // Check for icon containers with primary styling
      const primaryContainers = container.querySelectorAll('.bg-primary\\/10');
      expect(primaryContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Pin/Unpin Functionality', () => {
    it('shows pin buttons when showActions is true', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      const pinButtons = screen.getAllByRole('button');
      expect(pinButtons.length).toBeGreaterThan(0);
    });

    it('does not show pin buttons when showActions is false', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={false} />);

      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(0);
    });

    it('shows "Pin me" text for unpinned notices', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      const pinButtons = screen.getAllByRole('button', { name: /pin me/i });
      expect(pinButtons.length).toBeGreaterThan(0);
    });

    it('shows "Unpin" text for pinned notices', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      const unpinButtons = screen.getAllByRole('button', { name: /unpin/i });
      expect(unpinButtons.length).toBeGreaterThan(0);
    });

    it('toggles pin state when button is clicked', async () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      // Find an unpinned notice and pin it
      const pinButton = screen.getAllByRole('button', { name: /pin me/i })[0];
      fireEvent.click(pinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Notice pinned');
      });
    });

    it('shows success toast when unpinning', async () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      // Find a pinned notice and unpin it
      const unpinButton = screen.getAllByRole('button', { name: /unpin/i })[0];
      fireEvent.click(unpinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Notice unpinned');
      });
    });

    it('updates UI after toggling pin', async () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      const initialUnpinCount = screen.getAllByRole('button', { name: /unpin/i }).length;
      
      // Pin an unpinned notice
      const pinButton = screen.getAllByRole('button', { name: /pin me/i })[0];
      fireEvent.click(pinButton);

      await waitFor(() => {
        const newUnpinCount = screen.getAllByRole('button', { name: /unpin/i }).length;
        expect(newUnpinCount).toBe(initialUnpinCount + 1);
      });
    });
  });

  describe('Empty State', () => {
    it('displays empty state message when no notices', () => {
      render(<NoticeGrid notices={[]} pinnedOnly={false} />);

      expect(screen.getByText('No pinned notices.')).toBeInTheDocument();
    });

    it('displays empty state when no pinned notices and pinnedOnly is true', () => {
      const unpinnedNotices = [mockNotices[1], mockNotices[2]];
      render(<NoticeGrid notices={unpinnedNotices} pinnedOnly={true} />);

      expect(screen.getByText('No pinned notices.')).toBeInTheDocument();
    });

    it('empty state has correct styling', () => {
      render(<NoticeGrid notices={[]} pinnedOnly={false} />);

      const emptyMessage = screen.getByText('No pinned notices.');
      expect(emptyMessage).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  describe('Grid Layout', () => {
    it('uses responsive grid layout', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
    });

    it('applies correct gap between cards', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
    });
  });

  describe('Card Styling', () => {
    it('applies hover effects to cards', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const cards = container.querySelectorAll('.hover\\:shadow-md');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('applies correct border and background colors', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const cards = container.querySelectorAll('.bg-card.border-border');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('cards have rounded corners', () => {
      const { container } = render(<NoticeGrid notices={mockNotices} pinnedOnly={false} />);

      const cards = container.querySelectorAll('.rounded-xl');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('pin buttons have accessible names', () => {
      render(<NoticeGrid notices={mockNotices} pinnedOnly={false} showActions={true} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
});
