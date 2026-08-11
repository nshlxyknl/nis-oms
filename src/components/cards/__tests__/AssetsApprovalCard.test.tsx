import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import AssetsApprovalCard from '../AssetsApprovalCard';
import * as apiModule from '@/services/api';
import { toast } from 'sonner';

// Mock the API module
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockAssetRequests = [
  {
    id: 1,
    userId: 1,
    user: { name: 'John Doe' },
    assetId: 1,
    asset: { name: 'Laptop Dell XPS', type: 'Electronics' },
    reason: 'Need for project work',
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    userId: 2,
    user: { name: 'Jane Smith' },
    assetId: 2,
    asset: { name: 'Office Chair', type: 'Furniture' },
    reason: 'Ergonomic seating',
    status: 'approved',
    approvedBy: { name: 'Admin User' },
    createdAt: '2024-01-14T09:00:00Z',
  },
  {
    id: 3,
    userId: 3,
    user: { name: 'Bob Johnson' },
    assetId: 3,
    asset: { name: 'Monitor', type: 'Electronics' },
    status: 'rejected',
    createdAt: '2024-01-13T08:00:00Z',
  },
];

describe('AssetsApprovalCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading skeletons initially', () => {
      vi.mocked(apiModule.api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<AssetsApprovalCard />);

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows loading skeletons for header and cards', () => {
      vi.mocked(apiModule.api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<AssetsApprovalCard />);

      // Check for multiple skeleton cards
      const skeletonCards = document.querySelectorAll('.bg-card.animate-pulse');
      expect(skeletonCards.length).toBeGreaterThan(0);
    });
  });

  describe('Data Rendering', () => {
    it('renders asset requests correctly', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
        expect(screen.getByText('Office Chair')).toBeInTheDocument();
        expect(screen.getByText('Monitor')).toBeInTheDocument();
      });
    });

    it('displays user names and asset types', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
        // Use getAllByText since "Electronics" appears multiple times
        const electronicsElements = screen.getAllByText(/Electronics/);
        expect(electronicsElements.length).toBeGreaterThan(0);
        expect(screen.getByText(/Furniture/)).toBeInTheDocument();
      });
    });

    it('displays reason when provided', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText(/Need for project work/)).toBeInTheDocument();
        expect(screen.getByText(/Ergonomic seating/)).toBeInTheDocument();
      });
    });

    it('displays correct status counts', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('1 pending')).toBeInTheDocument();
        expect(screen.getByText('1 approved')).toBeInTheDocument();
        expect(screen.getByText('1 rejected')).toBeInTheDocument();
      });
    });

    it('displays header with icon and title', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Asset Request Approvals')).toBeInTheDocument();
      });
    });

    it('formats dates correctly', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        // Check that dates are formatted (e.g., "Jan 15, 2024")
        expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
      });
    });
  });

  describe('Status Display', () => {
    it('shows correct status badges', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        const pendingBadges = screen.getAllByText('pending');
        const approvedBadges = screen.getAllByText('approved');
        const rejectedBadges = screen.getAllByText('rejected');

        expect(pendingBadges.length).toBeGreaterThan(0);
        expect(approvedBadges.length).toBeGreaterThan(0);
        expect(rejectedBadges.length).toBeGreaterThan(0);
      });
    });

    it('applies correct status colors', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        const pendingBadge = screen.getAllByText('pending')[0];
        expect(pendingBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');

        const approvedBadge = screen.getAllByText('approved')[0];
        expect(approvedBadge).toHaveClass('bg-green-100', 'text-green-800');

        const rejectedBadge = screen.getAllByText('rejected')[0];
        expect(rejectedBadge).toHaveClass('bg-red-100', 'text-red-800');
      });
    });
  });

  describe('Action Buttons', () => {
    it('shows approve and reject buttons for pending requests', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        const approveButtons = screen.getAllByRole('button', { name: /approve/i });
        const rejectButtons = screen.getAllByRole('button', { name: /reject/i });

        expect(approveButtons.length).toBeGreaterThan(0);
        expect(rejectButtons.length).toBeGreaterThan(0);
      });
    });

    it('does not show action buttons for approved requests', async () => {
      const approvedOnly = [mockAssetRequests[1]]; // Only approved request
      vi.mocked(apiModule.api.get).mockResolvedValue(approvedOnly);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Office Chair')).toBeInTheDocument();
      });

      const approveButtons = screen.queryAllByRole('button', { name: /approve/i });
      expect(approveButtons.length).toBe(0);
    });

    it('does not show action buttons for rejected requests', async () => {
      const rejectedOnly = [mockAssetRequests[2]]; // Only rejected request
      vi.mocked(apiModule.api.get).mockResolvedValue(rejectedOnly);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Monitor')).toBeInTheDocument();
      });

      const rejectButtons = screen.queryAllByRole('button', { name: /reject/i });
      expect(rejectButtons.length).toBe(0);
    });
  });

  describe('Approve Functionality', () => {
    it('calls approve API when approve button is clicked', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(apiModule.api.patch).toHaveBeenCalledWith('/asset-requests/1/approve', {});
      });
    });

    it('shows success toast on successful approval', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Asset request approved');
      });
    });

    it('shows error toast on approval failure', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockRejectedValue(new Error('Network error'));

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to approve asset request');
      });
    });

    it('disables buttons during approval', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      const rejectButton = screen.getAllByRole('button', { name: /reject/i })[0];

      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(approveButton).toBeDisabled();
        expect(rejectButton).toBeDisabled();
      });
    });
  });

  describe('Reject Functionality', () => {
    it('calls reject API when reject button is clicked', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const rejectButton = screen.getAllByRole('button', { name: /reject/i })[0];
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(apiModule.api.patch).toHaveBeenCalledWith('/asset-requests/1/reject', {});
      });
    });

    it('shows success toast on successful rejection', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const rejectButton = screen.getAllByRole('button', { name: /reject/i })[0];
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Asset request rejected');
      });
    });

    it('shows error toast on rejection failure', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);
      vi.mocked(apiModule.api.patch).mockRejectedValue(new Error('Network error'));

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Laptop Dell XPS')).toBeInTheDocument();
      });

      const rejectButton = screen.getAllByRole('button', { name: /reject/i })[0];
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to reject asset request');
      });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no asset requests', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue([]);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('No asset requests yet')).toBeInTheDocument();
      });
    });

    it('shows zero counts in empty state', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue([]);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('0 pending')).toBeInTheDocument();
        expect(screen.getByText('0 approved')).toBeInTheDocument();
        expect(screen.getByText('0 rejected')).toBeInTheDocument();
      });
    });
  });

  describe('Hover Effects', () => {
    it('applies hover classes to cards', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockAssetRequests);

      render(<AssetsApprovalCard />);

      await waitFor(() => {
        const cards = document.querySelectorAll('.hover\\:shadow-md');
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });
});
