"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/services/api";

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
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();

  const { 
    data: user, 
    isLoading, 
    error,
    isError 
  } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const isAuthenticated = !!user && !isError;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Spinner />
          <span>Checking authentication...</span>
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