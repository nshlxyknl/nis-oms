import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Simple hook to get user data from TanStack Query cache
 * This doesn't trigger a new request, just reads from cache
 * Use this in components that are already protected by ProtectedRoute
 */
export function useUser() {
  const queryClient = useQueryClient();
  
  // Get user data from cache without triggering a new request
  const user = queryClient.getQueryData<User>(['auth', 'me']);
  
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
  };
}