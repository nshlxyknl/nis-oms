import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import FeaturesCard from '../FeaturesCard';
import * as useAuthHook from '@/hooks/useAuth';

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock feature data
vi.mock('@/lib/admin/adminFeaturesdata', () => ({
  adminFeatures: [
    {
      title: 'Manage Employees',
      description: 'Add, edit, or remove employees',
      url: '/dashboard/employees',
      action: 'Manage',
      icon: vi.fn(() => null),
      color: 'primary' as const,
    },
    {
      title: 'Approve Requests',
      description: 'Review and approve requests',
      url: '/dashboard/approvals',
      action: 'Review',
      icon: vi.fn(() => null),
      color: 'success' as const,
    },
  ],
}));

vi.mock('@/lib/user/userFeaturesdata', () => ({
  userFeatures: [
    {
      title: 'Book Room',
      description: 'Reserve meeting rooms',
      url: '/dashboard/book-rooms',
      action: 'Book',
      icon: vi.fn(() => null),
      color: 'warning' as const,
    },
    {
      title: 'Request Leave',
      description: 'Submit leave requests',
      url: '/dashboard/leave',
      action: 'Request',
      icon: vi.fn(() => null),
      color: 'accent' as const,
    },
  ],
}));

describe('FeaturesCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  describe('Admin User Features', () => {
    it('renders admin features when user is admin', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 1, username: 'admin', name: 'Admin', role: 'admin' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        expect(screen.getByText('Manage Employees')).toBeInTheDocument();
        expect(screen.getByText('Approve Requests')).toBeInTheDocument();
      });
    });

    it('displays admin feature descriptions', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 1, username: 'admin', name: 'Admin', role: 'admin' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        expect(screen.getByText('Add, edit, or remove employees')).toBeInTheDocument();
        expect(screen.getByText('Review and approve requests')).toBeInTheDocument();
      });
    });
  });

  describe('User Features', () => {
    it('renders user features when user is not admin', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 2, username: 'user', name: 'User', role: 'user' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        expect(screen.getByText('Book Room')).toBeInTheDocument();
        expect(screen.getByText('Request Leave')).toBeInTheDocument();
      });
    });

    it('displays user feature descriptions', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 2, username: 'user', name: 'User', role: 'user' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        expect(screen.getByText('Reserve meeting rooms')).toBeInTheDocument();
        expect(screen.getByText('Submit leave requests')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to correct URL when feature button is clicked', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 1, username: 'admin', name: 'Admin', role: 'admin' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        expect(screen.getByText('Manage Employees')).toBeInTheDocument();
      });

      const manageButton = screen.getByRole('button', { name: /manage/i });
      fireEvent.click(manageButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/employees');
    });
  });

  describe('UI Elements', () => {
    it('displays Quick Actions header', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 2, username: 'user', name: 'User', role: 'user' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('renders cards with hover effects', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { id: 1, username: 'admin', name: 'Admin', role: 'admin' },
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        const cards = document.querySelectorAll('.hover\\:shadow-md');
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('No User State', () => {
    it('renders user features when no user is logged in', async () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: undefined,
        isLoading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isLoginLoading: false,
        isRegisterLoading: false,
        isLogoutLoading: false,
        error: null,
        isError: false,
      });

      render(<FeaturesCard />);

      await waitFor(() => {
        expect(screen.getByText('Book Room')).toBeInTheDocument();
      });
    });
  });
});
