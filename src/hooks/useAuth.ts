import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  name: string;
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
    onSuccess: async (data) => {
      console.log('Login successful, response:', data);
      toast.success('Login successful!');
      
      // Wait a moment for session to be set, then check user
      setTimeout(async () => {
        try {
          console.log('Checking user session after login...');
          const userResponse = await api.get('/auth/me');
          console.log('User data after login:', userResponse);
          
          // Update the query cache with the user data
          queryClient.setQueryData(['auth', 'me'], userResponse);
          
          // Redirect based on role
          const redirectPath = userResponse.role === 'ADMIN' ? '/dashboard/overview' : '/dashboard/overview';
          console.log(`Redirecting to: ${redirectPath}`);
          window.location.href = redirectPath;
          
        } catch (error) {
          console.error('Failed to get user data after login:', error);
          // Fallback: try to redirect anyway
          console.log('Fallback: redirecting to dashboard');
          window.location.href = '/dashboard';
        }
      }, 500);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      toast.error(`Login failed: ${error.message}`);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: {
      username: string;
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