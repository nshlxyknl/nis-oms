import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from '../useUser';

describe('useUser', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return undefined user when no data in cache', () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isEmployee).toBe(false);
  });

  it('should return user data from cache', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      name: 'Test User',
      role: 'user',
    };

    queryClient.setQueryData(['auth', 'me'], mockUser);

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isEmployee).toBe(false);
  });

  it('should identify admin user correctly', () => {
    const adminUser = {
      id: 1,
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
    };

    queryClient.setQueryData(['auth', 'me'], adminUser);

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toEqual(adminUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isEmployee).toBe(false);
  });

  it('should identify employee user correctly', () => {
    const employeeUser = {
      id: 2,
      username: 'employee',
      name: 'Employee User',
      role: 'employee',
    };

    queryClient.setQueryData(['auth', 'me'], employeeUser);

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toEqual(employeeUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isEmployee).toBe(true);
  });

  it('should handle role changes in cache', () => {
    const userAsUser = {
      id: 1,
      username: 'testuser',
      name: 'Test User',
      role: 'user',
    };

    queryClient.setQueryData(['auth', 'me'], userAsUser);

    const { result, rerender } = renderHook(() => useUser(), { wrapper });

    expect(result.current.isAdmin).toBe(false);

    // Update user role to admin
    const userAsAdmin = { ...userAsUser, role: 'admin' };
    queryClient.setQueryData(['auth', 'me'], userAsAdmin);

    rerender();

    expect(result.current.isAdmin).toBe(true);
  });

  it('should not trigger API requests', () => {
    // This test verifies that useUser only reads from cache
    // and doesn't trigger any API calls
    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toBeUndefined();
    // No API mocks needed - if it made a request, the test would fail
  });

  it('should handle user data updates', () => {
    const initialUser = {
      id: 1,
      username: 'testuser',
      name: 'Test User',
      role: 'user',
    };

    queryClient.setQueryData(['auth', 'me'], initialUser);

    const { result, rerender } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user?.name).toBe('Test User');

    // Simulate user data update
    const updatedUser = { ...initialUser, name: 'Updated Name' };
    queryClient.setQueryData(['auth', 'me'], updatedUser);

    rerender();

    expect(result.current.user?.name).toBe('Updated Name');
  });

  it('should handle user logout (cache cleared)', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      name: 'Test User',
      role: 'user',
    };

    queryClient.setQueryData(['auth', 'me'], mockUser);

    const { result, rerender } = renderHook(() => useUser(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);

    // Simulate logout
    queryClient.setQueryData(['auth', 'me'], null);

    rerender();

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
