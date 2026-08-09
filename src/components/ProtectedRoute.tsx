"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/services/api";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [hasToken, setHasToken] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Set mounted to true only on client side
    setMounted(true);
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  const { 
    data: user, 
    isLoading, 
    isError,
    error
  } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      console.log('ProtectedRoute: Fetching user data...');
      
      // Check localStorage first
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        console.log('ProtectedRoute: Using cached user');
        return JSON.parse(cachedUser);
      }
      
      try {
        const userData = await api.get('/auth/me');
        console.log('ProtectedRoute: User data received:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } catch (err) {
        console.error('ProtectedRoute: Failed to fetch user data:', err);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: mounted && hasToken, // Only run query if mounted and token exists
  });

  const isAuthenticated = !!user && !isError;

  console.log('ProtectedRoute state:', { 
    user, 
    isLoading, 
    isError, 
    isAuthenticated,
    hasToken,
    mounted,
    error: error?.message,
  });

  React.useEffect(() => {
    if (!mounted) return; // Don't redirect until mounted
    
    if (!hasToken && !isLoading) {
      console.log('ProtectedRoute: No token, redirecting to /auth');
      router.push("/auth");
      return;
    }

    if (hasToken && !isLoading && !isAuthenticated) {
      console.log('ProtectedRoute: Token exists but not authenticated, redirecting to /auth');
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, hasToken, mounted, router]);

  // Show loading only after mounted to avoid hydration issues
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Spinner />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Don't show anything while redirecting
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required role: {requiredRole}, Your role: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export { ProtectedRoute };
export default ProtectedRoute;