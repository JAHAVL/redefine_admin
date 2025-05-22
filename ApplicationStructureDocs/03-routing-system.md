# Routing System

This document details the routing architecture used in the application, focusing on how routes are defined, organized, and protected.

## Centralized Routing Approach

The application uses a centralized routing approach with React Router, where all routes are defined in a single file for better maintainability and an easy-to-understand structure.

### Core Files

- `/src/routes/ProtectedRoutes.tsx` - Contains all route definitions and authentication logic
- `/src/App.tsx` - Loads the routing system using React's lazy loading

## Route Definition Structure

Routes are defined in a hierarchical structure, organized by feature and access level:

```tsx
// Example ProtectedRoutes.tsx structure
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getComponentPath } from '../utils/pathconfig';

// Import page components
import LoginPage from '../pages/auth/LoginPage';
import TemplatePage from '../pages/template/TemplatePage';
// ... more imports

// Authentication wrapper component
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  // Check authentication
  const isAuthenticated = true; // Replace with actual auth logic
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Component />;
};

// Main routes component
const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute component={TemplatePage} />} />
      
      {/* Feature routes grouped with comments */}
      {/* Finance routes */}
      <Route path="/finance" element={<ProtectedRoute component={FinanceDashboardPage} />} />
      <Route path="/finance/transactions" element={<ProtectedRoute component={TransactionsPage} />} />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ProtectedRoutes;
```

## Protected Routes Implementation

Protected routes are implemented using a Higher-Order Component (HOC) pattern that checks authentication status before rendering the requested page.

### Authentication Flow

1. User attempts to access a protected route
2. The `ProtectedRoute` component checks the authentication status
3. If authenticated, the requested component is rendered
4. If not authenticated, the user is redirected to the login page

## Route Organization

Routes are organized into logical groups by feature for better readability and maintainability:

### Public vs. Admin Routes

A key organization principle is the separation between public and admin routes:

```tsx
// Example route organization
const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes - no authentication required */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      
      {/* Admin routes - protected by authentication */}
      <Route path="/admin/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
      
      {/* Admin feature routes grouped with comments */}
      {/* Finance routes */}
      <Route path="/admin/finance" element={<ProtectedRoute component={FinanceDashboardPage} />} />
      <Route path="/admin/finance/transactions" element={<ProtectedRoute component={TransactionsPage} />} />
      
      {/* User Management routes */}
      <Route path="/admin/users" element={<ProtectedRoute component={UsersPage} />} />
      <Route path="/admin/users/:userId" element={<ProtectedRoute component={UserDetailPage} />} />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
```

This separation ensures that admin routes are properly protected while public routes remain accessible without authentication.

### Feature Grouping

Within the admin routes, further organization by feature:

```
// Example route grouping
// Auth routes (public)
/login
/register
/forgot-password

// Admin routes (protected)
/admin/dashboard
/admin/profile

// Finance routes (protected)
/admin/finance
/admin/finance/transactions
/admin/finance/accounts
/admin/finance/reports
/admin/finance/statements
/admin/finance/reconciliation

// And so on...
```

## Route Naming Conventions

- Use lowercase kebab-case for route paths
- Feature routes should start with the feature name (e.g., `/finance/transactions`)
- Keep route paths as short and descriptive as possible

## Lazy Loading Routes

Use React's lazy loading to improve initial load performance:

```tsx
// In App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Lazy load the routes
const ProtectedRoutes = React.lazy(() => import('./routes/ProtectedRoutes'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoutes />
      </Suspense>
    </Router>
  );
};
```

## Route Parameters

Use route parameters for dynamic content:

```tsx
<Route 
  path="/scheduler/events/:seriesId/:eventId" 
  element={<ProtectedRoute component={EventDetailsPage} />} 
/>
```

## Nested Routes

For complex UIs with nested navigation, use nested routes:

```tsx
<Route path="/dashboard" element={<ProtectedRoute component={DashboardLayout} />}>
  <Route index element={<Overview />} />
  <Route path="stats" element={<Stats />} />
  <Route path="preferences" element={<Preferences />} />
</Route>
```

## Best Practices

1. **Single Source of Truth** - Keep all routes in a single file
2. **Group Related Routes** - Organize routes by feature with clear comments
3. **Descriptive Paths** - Use descriptive, semantic URLs
4. **Consistent Protection** - Wrap all protected routes with the ProtectedRoute component
5. **Route Constants** - Define route paths as constants when used in multiple places
6. **404 Handling** - Always include a fallback route for 404 pages
7. **Clean URLs** - Use clean, RESTful URL patterns
