# 🚀 TanStack Query Authentication Guide

## Overview

Your authentication system now uses **TanStack Query** directly in the `ProtectedRoute` component, providing better performance, caching, and error handling.

## Components Available

### 1. **ProtectedRoute** (Standard)
```typescript
// src/components/ProtectedRoute.tsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// With role-based access
<ProtectedRoute requiredRole="admin">
  <AdminOnlyComponent />
</ProtectedRoute>
```

### 2. **ProtectedRouteAdvanced** (Enhanced)
```typescript
// src/components/ProtectedRouteAdvanced.tsx
<ProtectedRouteAdvanced 
  requiredRole="admin"
  fallbackUrl="/unauthorized"
  showRetry={true}
>
  <AdminComponent />
</ProtectedRouteAdvanced>
```

## Hooks Available

### 1. **useAuth()** - Full Authentication Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user,                    // User data
    isLoading,              // Loading state
    isAuthenticated,        // Boolean auth status
    login,                  // Login function
    register,               // Register function
    logout,                 // Logout function
    isLoginLoading,         // Login loading state
    isRegisterLoading,      // Register loading state
    error,                  // Error object
    isError                 // Error boolean
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={() => login({ username: 'test', password: 'test' })}>
          Login
        </button>
      )}
    </div>
  );
}
```

### 2. **useUser()** - Cache-Only User Data
```typescript
import { useUser } from '@/hooks/useUser';

// Use this in components already protected by ProtectedRoute
function UserProfile() {
  const { user, isAdmin, isEmployee } = useUser();

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>Role: {user?.role}</p>
      {isAdmin && <AdminPanel />}
      {isEmployee && <EmployeePanel />}
    </div>
  );
}
```

## TanStack Query Features Used

### 1. **Automatic Caching**
- User data cached for 5 minutes (`staleTime`)
- Cache persists for 10 minutes (`gcTime`)
- Shared across all components using the same query key

### 2. **Smart Refetching**
- Refetches when window regains focus
- Refetches when network reconnects
- Automatic background updates

### 3. **Error Handling**
- No retry on 401/403 errors (auth failures)
- Automatic cache clearing on auth errors
- Toast notifications for errors

### 4. **Optimistic Updates**
- Login immediately invalidates cache
- Logout clears all cached data
- Smooth user experience

## Usage Patterns

### 1. **Protected Pages**
```typescript
// src/app/dashboard/admin/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

### 2. **Components Inside Protected Routes**
```typescript
// src/components/UserProfile.tsx
import { useUser } from '@/hooks/useUser';

export function UserProfile() {
  const { user, isAdmin } = useUser();
  
  // No need to check authentication - already protected by route
  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      {isAdmin && <AdminSettings />}
    </div>
  );
}
```

### 3. **Login/Register Forms**
```typescript
// src/components/LoginForm.tsx
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { login, isLoginLoading } = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoginLoading}>
        {isLoginLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Query Keys Used

```typescript
['auth', 'me']           // Current user data
['employees']            // Employee list
['assets']               // Asset list  
['rooms']                // Room list
['notices']              // Notice list
// Add more as needed
```

## Error Handling

### 1. **Authentication Errors**
- 401/403 errors automatically clear cache
- User redirected to login page
- Toast notification shown

### 2. **Network Errors**
- Retry mechanism (up to 2 times)
- Manual retry button in advanced component
- Graceful fallback UI

### 3. **Role-Based Access**
- Clear error message for insufficient permissions
- Shows required vs actual role
- Option to go back

## Performance Benefits

### 1. **Reduced API Calls**
- Single auth check shared across components
- 5-minute cache prevents unnecessary requests
- Background refetching keeps data fresh

### 2. **Better UX**
- Instant user data from cache
- Smooth transitions between pages
- Loading states only when needed

### 3. **Memory Efficient**
- Automatic garbage collection after 10 minutes
- Smart cache invalidation
- Optimized re-renders

## Best Practices

### 1. **Use useUser() in Protected Components**
```typescript
// ✅ Good - inside protected route
function Dashboard() {
  const { user } = useUser(); // Fast, from cache
  return <div>Welcome {user?.name}</div>;
}

// ❌ Avoid - unnecessary loading
function Dashboard() {
  const { user, isLoading } = useAuth(); // Triggers new request
  if (isLoading) return <Spinner />;
  return <div>Welcome {user?.name}</div>;
}
```

### 2. **Handle Loading States Properly**
```typescript
// ✅ Good - check loading before rendering
function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <LoginForm />;
  
  return <Dashboard user={user} />;
}
```

### 3. **Use Appropriate Protection Level**
```typescript
// ✅ Good - page-level protection
<ProtectedRoute>
  <DashboardLayout>
    <UserProfile /> {/* Uses useUser() */}
  </DashboardLayout>
</ProtectedRoute>

// ❌ Avoid - component-level protection
<DashboardLayout>
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
</DashboardLayout>
```

## Migration from AuthContext

If you have existing components using the old AuthContext:

```typescript
// Old way
import { useAuth } from '@/context/AuthContext';

// New way  
import { useAuth } from '@/hooks/useAuth';
// OR for cache-only access:
import { useUser } from '@/hooks/useUser';
```

The API is mostly the same, but now with better performance and caching! 🚀