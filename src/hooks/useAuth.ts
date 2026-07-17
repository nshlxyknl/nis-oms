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

  // Get user from TanStack Query cache or localStorage
  const { data: user, isLoading, error, isError } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      // Check if we have a token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No token found');
      }
      
      // Check if we have user in localStorage first
      const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (cachedUser) {
        console.log('Using cached user from localStorage');
        return JSON.parse(cachedUser);
      }
      
      // Fetch from API if not in cache
      console.log('Fetching user from API');
      const userData = await api.get('/auth/me');
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return userData;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'), // Only run if token exists
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) => {
      console.log('Login mutation starting...');
      return api.post('/auth/login', credentials);
    },
    onSuccess: async (data) => {
      console.log('Login successful, full response:', data);
      
      // Handle different response formats
      let token = null;
      let userData = null;
      
      // Check for token in different formats
      if (data.access_token) {
        token = data.access_token;
        console.log('Found access_token');
      } else if (data.token) {
        token = data.token;
        console.log('Found token');
      }
      
      // Check for user data in different formats
      if (data.user) {
        userData = data.user;
        console.log('Found user object:', userData);
      } else if (data.id && data.username) {
        // Response is the user object itself
        userData = data;
        console.log('Response is user object:', userData);
      }
      
      // Store token if present
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token stored in localStorage');
      } else {
        console.warn('No token found in response!');
      }
      
      // Store and use user data
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User stored in localStorage:', userData);
        queryClient.setQueryData(['auth', 'me'], userData);
        
        toast.success('Login successful!');
        
        // Redirect based on role (handle different role formats)
        const userRole = userData.role?.toUpperCase() || 'USER';
        console.log('User role:', userRole);
        
        setTimeout(() => {
          if (userRole === 'ADMIN') {
            console.log('Redirecting to /dashboard/overview (ADMIN)');
            router.push('/dashboard/overview');
            // Fallback: force reload after short delay
            setTimeout(() => {
              window.location.href = '/dashboard/overview';
            }, 500);
          } else {
            console.log('Redirecting to /dashboard/overview (USER)');
            router.push('/dashboard/overview');
            // Fallback: force reload after short delay
            setTimeout(() => {
              window.location.href = '/dashboard/overview';
            }, 500);
          }
        }, 100);
        
      } else {
        console.log('No user data in response, fetching from /auth/me');
        // If no user data in response, fetch it
        setTimeout(async () => {
          try {
            const fetchedUser = await api.get('/auth/me');
            console.log('Fetched user data:', fetchedUser);
            
            localStorage.setItem('user', JSON.stringify(fetchedUser));
            queryClient.setQueryData(['auth', 'me'], fetchedUser);
            
            toast.success('Login successful!');
            
            const userRole = fetchedUser.role?.toUpperCase() || 'USER';
            if (userRole === 'ADMIN') {
              router.push('/dashboard/overview');
              setTimeout(() => window.location.href = '/dashboard/overview', 500);
            } else {
              router.push('/dashboard/overview');
              setTimeout(() => window.location.href = '/dashboard/overview', 500);
            }
          } catch (error) {
            console.error('Failed to fetch user after login:', error);
            toast.error('Login succeeded but failed to get user data. Please refresh.');
          }
        }, 500);
      }
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
      console.log('Registration successful');
      toast.success('Registration successful! Please login.');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout', {}),
    onSuccess: () => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Clear all auth-related cache
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.clear(); // Clear all cache
      
      toast.success('Logged out successfully');
      router.push('/auth');
    },
    onError: () => {
      // Even if API call fails, clear local data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      queryClient.clear();
      
      toast.error('Logout failed but local session cleared');
      router.push('/auth');
    },
  });

  return {
    // User data
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    
    // Auth actions
    login: (credentials: { username: string; password: string }) => {
      console.log('Login function called with:', { username: credentials.username });
      loginMutation.mutate(credentials);
    },
    register: (userData: { username: string; password: string; name: string }) => {
      console.log('Register function called with:', { username: userData.username, name: userData.name });
      registerMutation.mutate(userData);
    },
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