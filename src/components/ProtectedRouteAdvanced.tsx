"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackUrl?: string;
  showRetry?: boolean;
}

export function ProtectedRouteAdvanced({ 
  children, 
  requiredRole, 
  fallbackUrl = "/auth",
  showRetry = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [retryCount, setRetryCount] = useState(0);

  const { 
    data: user, 
    isLoading, 
    error,
    isError,
    refetch,
    isRefetching
  } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/me'),
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors (authentication/authorization failures)
      if (error instanceof Error && error.message.includes('401')) return false;
      if (error instanceof Error && error.message.includes('403')) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  const isAuthenticated = !!user && !isError;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isError) {
      router.push(fallbackUrl);
    }
  }, [isAuthenticated, isLoading, isError, router, fallbackUrl]);

  // Handle authentication errors
  useEffect(() => {
    if (isError && error) {
      console.error('Authentication error:', error);
      
      // Clear auth cache on authentication failure
      if (error.message.includes('401') || error.message.includes('403')) {
        queryClient.setQueryData(['auth', 'me'], null);
        queryClient.removeQueries({ queryKey: ['auth'] });
        
        if (!window.location.pathname.includes('/auth')) {
          toast.error('Session expired. Please login again.');
          router.push(fallbackUrl);
        }
      }
    }
  }, [isError, error, queryClient, router, fallbackUrl]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  // Show loading spinner while checking authentication
  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <span className="text-sm text-gray-600">
            {isRefetching ? 'Refreshing authentication...' : 'Checking authentication...'}
          </span>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (isError && showRetry) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to verify your authentication status. Please check your connection and try again.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRetry} variant="outline">
              Retry ({retryCount})
            </Button>
            <Button onClick={() => router.push(fallbackUrl)}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated (handled by useEffect)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Spinner />
          <span>Redirecting to login...</span>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Required role: <span className="font-medium">{requiredRole}</span>
            <br />
            Your role: <span className="font-medium">{user?.role}</span>
          </p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}