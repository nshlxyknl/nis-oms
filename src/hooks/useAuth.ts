import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get user from TanStack Query cache - this will be the same query as ProtectedRoute
  const { data: user, isLoading, error, isError } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      api.post('/auth/login', credentials),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: {
      username: string;
      email: string;
      password: string;
      name: string;
    }) => api.post('/auth/register', userData),
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
    onError: () => {
      toast.error('Registration failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout', {}),
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.clear(); // Clear all cache
      toast.success('Logged out successfully');
      router.push('/auth');
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  return {
    // User data
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    
    // Auth actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    
    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    
    // Error states
    error,
    isError,
  };
}