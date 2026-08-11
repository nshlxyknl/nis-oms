import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import LeaveApprovalCard from '../cards/LeaveApprovalCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as apiModule from '@/services/api';

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

const mockLeaveData = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    type: 'annual',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    days: 5,
    reason: 'Vacation',
    status: 'pending',
    appliedOn: '2023-12-20',
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    type: 'sick',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    days: 3,
    reason: 'Medical',
    status: 'approved',
    appliedOn: '2024-01-08',
  },
];

describe('LeaveApprovalCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(apiModule.api.get).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<LeaveApprovalCard />);
    
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders leave requests correctly', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockLeaveData);

    render(<LeaveApprovalCard />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('displays correct status counts', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockLeaveData);

    render(<LeaveApprovalCard />);

    await waitFor(() => {
      expect(screen.getByText('1 pending')).toBeInTheDocument();
      expect(screen.getByText('1 approved')).toBeInTheDocument();
      expect(screen.getByText('0 rejected')).toBeInTheDocument();
    });
  });

  it('shows approve and reject buttons for pending requests', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockLeaveData);

    render(<LeaveApprovalCard />);

    await waitFor(() => {
      const approveButtons = screen.getAllByRole('button', { name: /approve/i });
      const rejectButtons = screen.getAllByRole('button', { name: /reject/i });
      
      expect(approveButtons.length).toBeGreaterThan(0);
      expect(rejectButtons.length).toBeGreaterThan(0);
    });
  });

  it('calls approve API when approve button is clicked', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockLeaveData);
    vi.mocked(apiModule.api.patch).mockResolvedValue({ success: true });

    render(<LeaveApprovalCard />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const approveButton = screen.getAllByRole('button', { name: /approve/i })[0];
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(apiModule.api.patch).toHaveBeenCalledWith('/leaves/1/approve', {});
    });
  });

  it('displays empty state when no leave requests', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue([]);

    render(<LeaveApprovalCard />);

    await waitFor(() => {
      expect(screen.getByText('No leave requests yet')).toBeInTheDocument();
    });
  });

  it('displays leave type badges correctly', async () => {
    vi.mocked(apiModule.api.get).mockResolvedValue(mockLeaveData);

    render(<LeaveApprovalCard />);

    await waitFor(() => {
      expect(screen.getByText('annual')).toBeInTheDocument();
      expect(screen.getByText('sick')).toBeInTheDocument();
    });
  });
});
