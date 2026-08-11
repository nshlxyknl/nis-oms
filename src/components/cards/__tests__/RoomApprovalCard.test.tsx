import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import RoomApprovalCard from '../RoomApprovalCard';
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

const mockRoomBookings = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    roomId: 1,
    roomName: 'Conference Room A',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T12:00:00Z',
    purpose: 'Team meeting',
    status: 'pending',
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    roomId: 2,
    roomName: 'Meeting Room B',
    startTime: '2024-01-16T14:00:00Z',
    endTime: '2024-01-16T15:00:00Z',
    purpose: 'Client presentation',
    status: 'approved',
    approvedBy: 'Admin User',
  },
  {
    id: 3,
    userId: 3,
    userName: 'Bob Johnson',
    roomId: 3,
    roomName: 'Board Room',
    startTime: '2024-01-17T09:00:00Z',
    endTime: '2024-01-17T11:00:00Z',
    status: 'rejected',
  },
];

describe('RoomApprovalCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading skeletons initially', () => {
      vi.mocked(apiModule.api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<RoomApprovalCard />);

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Data Rendering', () => {
    it('renders room bookings correctly', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
        expect(screen.getByText('Meeting Room B')).toBeInTheDocument();
        expect(screen.getByText('Board Room')).toBeInTheDocument();
      });
    });

    it('displays user names', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
        expect(screen.getByText(/Bob Johnson/)).toBeInTheDocument();
      });
    });

    it('displays purpose when provided', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText(/Team meeting/)).toBeInTheDocument();
        expect(screen.getByText(/Client presentation/)).toBeInTheDocument();
      });
    });

    it('displays correct status counts', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('1 pending')).toBeInTheDocument();
        expect(screen.getByText('1 approved')).toBeInTheDocument();
        expect(screen.getByText('1 rejected')).toBeInTheDocument();
      });
    });

    it('displays header with icon and title', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Room Booking Approvals')).toBeInTheDocument();
      });
    });
  });

  describe('Action Buttons', () => {
    it('shows approve and reject buttons for pending requests', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        const approveButtons = screen.getAllByRole('button', { name: /approve/i });
        const rejectButtons = screen.getAllByRole('button', { name: /reject/i });

        expect(approveButtons.length).toBeGreaterThan(0);
        expect(rejectButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Approve Functionality', () => {
    it('calls approve API when approve button is clicked', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(apiModule.api.patch).toHaveBeenCalledWith('/room-bookings/1/approve', {});
      });
    });

    it('shows success toast on successful approval', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Room booking approved');
      });
    });

    it('shows error toast on approval failure', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);
      vi.mocked(apiModule.api.patch).mockRejectedValue(new Error('Network error'));

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
      });

      const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to approve booking');
      });
    });
  });

  describe('Reject Functionality', () => {
    it('calls reject API when reject button is clicked', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
      });

      const rejectButton = screen.getAllByRole('button', { name: /reject/i })[0];
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(apiModule.api.patch).toHaveBeenCalledWith('/room-bookings/1/reject', {});
      });
    });

    it('shows success toast on successful rejection', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue(mockRoomBookings);
      vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('Conference Room A')).toBeInTheDocument();
      });

      const rejectButton = screen.getAllByRole('button', { name: /reject/i })[0];
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Room booking rejected');
      });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no room bookings', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue([]);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('No room bookings yet')).toBeInTheDocument();
      });
    });

    it('shows zero counts in empty state', async () => {
      vi.mocked(apiModule.api.get).mockResolvedValue([]);

      render(<RoomApprovalCard />);

      await waitFor(() => {
        expect(screen.getByText('0 pending')).toBeInTheDocument();
        expect(screen.getByText('0 approved')).toBeInTheDocument();
        expect(screen.getByText('0 rejected')).toBeInTheDocument();
      });
    });
  });
});
