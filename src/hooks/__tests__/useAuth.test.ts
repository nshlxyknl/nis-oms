import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import * as apiModule from '@/services/api';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

const mockUser = {
  id: 1,
  username: 'testuser',
  name: 'Test User',
  role: 'user',
};

describe('useAuth', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Authentication State', () => {
    it('should start with no user when not authenticated', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load user from localStorage if token exists', async () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should fetch user from API if token exists but no cached user', async () => {
      localStorage.setItem('token', 'test-token');
      vi.mocked(apiModule.api.get).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(apiModule.api.get).toHaveBeenCalledWith('/auth/me');
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should handle loading state correctly', () => {
      localStorage.setItem('token', 'test-token');
      vi.mocked(apiModule.api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeUndefined();
    });

    it('should handle error state when fetching user fails', async () => {
      localStorage.setItem('token', 'test-token');
      vi.mocked(apiModule.api.get).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('Login', () => {
    it('should login successfully with user in response', async () => {
      const loginResponse = {
        access_token: 'new-token',
        user: mockUser,
      };

      vi.mocked(apiModule.api.post).mockResolvedValue(loginResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password' });

      await waitFor(() => {
        expect(apiModule.api.post).toHaveBeenCalledWith('/auth/login', {
          username: 'testuser',
          password: 'password',
        });
      });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('new-token');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        expect(toast.success).toHaveBeenCalledWith('Login successful!');
      });
    });

    it('should handle token-only response and fetch user', async () => {
      vi.mocked(apiModule.api.post).mockResolvedValue({ token: 'new-token' });
      vi.mocked(apiModule.api.get).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password' });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('new-token');
      });

      // Wait for the subsequent user fetch
      await waitFor(
        () => {
          expect(apiModule.api.get).toHaveBeenCalledWith('/auth/me');
        },
        { timeout: 1000 }
      );
    });

    it('should set loading state during login', async () => {
      vi.mocked(apiModule.api.post).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password' });

      await waitFor(() => {
        expect(result.current.isLoginLoading).toBe(true);
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(apiModule.api.post).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'wrong' });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Login failed: Invalid credentials');
        expect(result.current.isLoginLoading).toBe(false);
      });
    });

    it('should handle different token formats (access_token vs token)', async () => {
      vi.mocked(apiModule.api.post).mockResolvedValue({
        access_token: 'test-token',
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password' });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('test-token');
      });
    });

    it('should handle admin user login and redirect', async () => {
      const adminUser = { ...mockUser, role: 'admin' };
      vi.mocked(apiModule.api.post).mockResolvedValue({
        token: 'admin-token',
        user: adminUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'admin', password: 'password' });

      await waitFor(() => {
        expect(localStorage.getItem('user')).toBe(JSON.stringify(adminUser));
        expect(toast.success).toHaveBeenCalledWith('Login successful!');
      });
    });
  });

  describe('Register', () => {
    it('should register successfully', async () => {
      vi.mocked(apiModule.api.post).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({
        username: 'newuser',
        password: 'password',
        name: 'New User',
      });

      await waitFor(() => {
        expect(apiModule.api.post).toHaveBeenCalledWith('/auth/register', {
          username: 'newuser',
          password: 'password',
          name: 'New User',
        });
        expect(toast.success).toHaveBeenCalledWith('Registration successful! Please login.');
      });
    });

    it('should set loading state during registration', async () => {
      vi.mocked(apiModule.api.post).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({
        username: 'newuser',
        password: 'password',
        name: 'New User',
      });

      await waitFor(() => {
        expect(result.current.isRegisterLoading).toBe(true);
      });
    });

    it('should handle registration error', async () => {
      const error = new Error('Username already exists');
      vi.mocked(apiModule.api.post).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({
        username: 'existing',
        password: 'password',
        name: 'Existing User',
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Registration failed: Username already exists');
        expect(result.current.isRegisterLoading).toBe(false);
      });
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
    });

    it('should logout successfully', async () => {
      vi.mocked(apiModule.api.post).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      await waitFor(() => {
        expect(apiModule.api.post).toHaveBeenCalledWith('/auth/logout', {});
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
      });
    });

    it('should clear local data even if API call fails', async () => {
      vi.mocked(apiModule.api.post).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(toast.error).toHaveBeenCalledWith('Logout failed but local session cleared');
      });
    });

    it('should set loading state during logout', async () => {
      vi.mocked(apiModule.api.post).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      await waitFor(() => {
        expect(result.current.isLogoutLoading).toBe(true);
      });
    });

    it('should clear query cache on logout', async () => {
      vi.mocked(apiModule.api.post).mockResolvedValue({ success: true });

      queryClient.setQueryData(['auth', 'me'], mockUser);
      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      await waitFor(() => {
        expect(queryClient.getQueryData(['auth', 'me'])).toBeNull();
      });
    });
  });
});
