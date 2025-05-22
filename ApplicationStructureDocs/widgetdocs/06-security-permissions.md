# Security and Permissions Integration

This guide explains how widgets should integrate with the application's user permissions system to ensure proper security controls and feature availability.

## Core Principles

When integrating with the application's permission system, widgets should follow these principles:

1. **Respect Application Permissions**
   - Widgets should never bypass application-level permissions
   - UI elements should adapt based on user permissions
   - Operations that require specific permissions should be disabled/hidden when unavailable

2. **Defense in Depth**
   - Client-side permission checks for UI rendering
   - Server-side permission enforcement for all operations
   - No security-sensitive business logic on the client

3. **Clear Feedback**
   - Users should understand why certain features are unavailable
   - Permission-related errors should be clearly communicated
   - Guidance for obtaining necessary permissions when possible

## Permission Integration Patterns

### Permission Context Access

Widgets should access permissions through the application's permission context:

```tsx
// Using the application's permission context
import { usePermissions } from 'app/auth/PermissionContext';

const MyWidgetComponent = () => {
  const { hasPermission, userRoles } = usePermissions();
  
  const canCreateUsers = hasPermission('users:create');
  const canEditUsers = hasPermission('users:edit');
  const canDeleteUsers = hasPermission('users:delete');
  const canViewReports = hasPermission('reports:view');
  
  // Render UI based on permissions
  return (
    <div>
      {canViewReports && <ReportSection />}
      
      <UserList users={users} />
      
      {canCreateUsers && (
        <Button onClick={handleCreateUser}>
          Add User
        </Button>
      )}
    </div>
  );
};
```

### Permission-Aware Components

Create reusable permission-aware components:

```tsx
// PermissionGate.tsx
import React from 'react';
import { usePermissions } from 'app/auth/PermissionContext';

interface PermissionGateProps {
  permission: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { hasPermission } = usePermissions();
  
  // Check if the user has any of the required permissions
  const hasRequiredPermission = Array.isArray(permission)
    ? permission.some(p => hasPermission(p))
    : hasPermission(permission);
  
  if (!hasRequiredPermission) {
    return fallback;
  }
  
  return <>{children}</>;
};

export default PermissionGate;
```

Usage:

```tsx
<PermissionGate 
  permission="users:create"
  fallback={<p>You don't have permission to create users</p>}
>
  <CreateUserForm />
</PermissionGate>

{/* Check multiple permissions */}
<PermissionGate permission={['reports:view', 'reports:export']}>
  <ReportControls />
</PermissionGate>
```

### Permission-Based Component Props

Enhance components with permission-based props:

```tsx
// Enhanced Button with permission check
interface PermissionButtonProps extends ButtonProps {
  requiredPermission?: string | string[];
  disableOnNoPermission?: boolean;
  hideOnNoPermission?: boolean;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  requiredPermission,
  disableOnNoPermission = true,
  hideOnNoPermission = false,
  children,
  ...buttonProps
}) => {
  const { hasPermission } = usePermissions();
  
  if (!requiredPermission) {
    return <Button {...buttonProps}>{children}</Button>;
  }
  
  const hasRequiredPermission = Array.isArray(requiredPermission)
    ? requiredPermission.some(p => hasPermission(p))
    : hasPermission(requiredPermission);
  
  if (!hasRequiredPermission && hideOnNoPermission) {
    return null;
  }
  
  return (
    <Button
      {...buttonProps}
      disabled={!hasRequiredPermission && disableOnNoPermission || buttonProps.disabled}
      title={!hasRequiredPermission ? 'You do not have permission for this action' : buttonProps.title}
    >
      {children}
    </Button>
  );
};
```

Usage:

```tsx
<PermissionButton
  requiredPermission="users:delete"
  onClick={handleDeleteUser}
  variant="danger"
>
  Delete User
</PermissionButton>
```

## API and Data Access Controls

Handle permissions for API calls and data access:

```tsx
// api.ts with permission checks
import { store } from 'app/store';
import { hasPermission } from 'app/auth/permissionUtils';

export const fetchUserData = async () => {
  // Check client-side first to prevent unnecessary API calls
  if (!hasPermission(store.getState(), 'users:view')) {
    throw new Error('You do not have permission to view users');
  }
  
  // Make the API call (server will also check permissions)
  const response = await fetch('/api/users');
  
  if (response.status === 403) {
    throw new Error('Permission denied: You do not have access to view users');
  }
  
  return await response.json();
};
```

## Role-Based Component Variations

Adapt component behavior based on roles:

```tsx
// Using roles to determine component behavior
const UserCard = ({ user }) => {
  const { userRoles, hasPermission } = usePermissions();
  
  const isAdmin = userRoles.includes('admin');
  const isSupervisor = userRoles.includes('supervisor');
  const canModifyUser = hasPermission('users:edit');
  
  // More features for admins
  if (isAdmin) {
    return <AdminUserCard user={user} />;
  }
  
  // Supervisors see additional controls
  if (isSupervisor) {
    return <SupervisorUserCard user={user} />;
  }
  
  // Regular view for others with edit permission
  if (canModifyUser) {
    return <EditableUserCard user={user} />;
  }
  
  // Read-only for everyone else
  return <ReadOnlyUserCard user={user} />;
};
```

## Handling Permission Changes

React to permission changes (e.g., role updates):

```tsx
// Using permission changes to update UI
const DataDashboard = () => {
  const { hasPermission, userRoles, permissionsLoaded } = usePermissions();
  const [visibleSections, setVisibleSections] = useState([]);
  
  // Update visible sections when permissions change
  useEffect(() => {
    if (!permissionsLoaded) return;
    
    const sections = [];
    
    if (hasPermission('metrics:view')) {
      sections.push('metrics');
    }
    
    if (hasPermission('reports:view')) {
      sections.push('reports');
    }
    
    if (hasPermission('users:view')) {
      sections.push('users');
    }
    
    setVisibleSections(sections);
  }, [hasPermission, permissionsLoaded]);
  
  if (!permissionsLoaded) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {visibleSections.map(section => (
        <Section key={section} type={section} />
      ))}
    </div>
  );
};
```

## Feature Flags and Permissions

Integrate feature flags with permissions:

```tsx
// Combining feature flags with permissions
import { useFeatureFlags } from 'app/features/FeatureFlagContext';
import { usePermissions } from 'app/auth/PermissionContext';

const FeatureComponent = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const { hasPermission } = usePermissions();
  
  const showNewFeature = 
    isFeatureEnabled('new-analytics-feature') && 
    hasPermission('analytics:access');
  
  return (
    <div>
      {showNewFeature ? (
        <NewAnalyticsFeature />
      ) : (
        <LegacyAnalyticsView />
      )}
    </div>
  );
};
```

## Implementing Permission-Aware Routes

Control access to widget views with permission-based routing:

```tsx
// Permission-aware routing
import { Navigate } from 'react-router-dom';
import { usePermissions } from 'app/auth/PermissionContext';

interface ProtectedRouteProps {
  permission: string | string[];
  redirectPath?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  redirectPath = '/unauthorized',
  children
}) => {
  const { hasPermission, permissionsLoaded } = usePermissions();
  
  // Show loading while permissions are being loaded
  if (!permissionsLoaded) {
    return <LoadingSpinner />;
  }
  
  const hasRequiredPermission = Array.isArray(permission)
    ? permission.some(p => hasPermission(p))
    : hasPermission(permission);
  
  if (!hasRequiredPermission) {
    return <Navigate to={redirectPath} />;
  }
  
  return <>{children}</>;
};
```

Usage inside the widget's routing:

```tsx
<Routes>
  <Route 
    path="/"
    element={<WidgetDashboard />} 
  />
  <Route 
    path="/admin"
    element={
      <ProtectedRoute permission="widget:admin">
        <WidgetAdminPanel />
      </ProtectedRoute>
    } 
  />
</Routes>
```

## Implementing Permission Hooks

Create custom hooks for permission-related logic:

```tsx
// useRequirePermission.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from 'app/auth/PermissionContext';

export const useRequirePermission = (
  permission: string | string[],
  redirectPath = '/unauthorized'
) => {
  const { hasPermission, permissionsLoaded } = usePermissions();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!permissionsLoaded) return;
    
    const hasRequiredPermission = Array.isArray(permission)
      ? permission.some(p => hasPermission(p))
      : hasPermission(permission);
    
    if (!hasRequiredPermission) {
      navigate(redirectPath);
    }
  }, [permission, hasPermission, permissionsLoaded, navigate, redirectPath]);
  
  return {
    permissionsLoaded,
    hasPermission: Array.isArray(permission)
      ? permission.some(p => hasPermission(p))
      : hasPermission(permission)
  };
};
```

Usage:

```tsx
const SettingsPanel = () => {
  const { permissionsLoaded, hasPermission } = useRequirePermission('settings:view');
  
  if (!permissionsLoaded) {
    return <LoadingSpinner />;
  }
  
  if (!hasPermission) {
    return null; // Will redirect via the hook
  }
  
  return <div>Settings Panel Content</div>;
};
```

## Permission Debugging and Development

Tools for debugging permission issues:

```tsx
// PermissionDebugger.tsx (for development only)
import React from 'react';
import { usePermissions } from 'app/auth/PermissionContext';

const PermissionDebugger = () => {
  const { userRoles, allPermissions, hasPermission } = usePermissions();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0,
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      zIndex: 9999,
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <h4>Permission Debugger</h4>
      <div>
        <strong>Roles:</strong> {userRoles.join(', ')}
      </div>
      <div>
        <strong>Permissions:</strong>
        <ul>
          {allPermissions.map(perm => (
            <li key={perm} style={{ 
              color: hasPermission(perm) ? 'green' : 'red'
            }}>
              {perm}: {hasPermission(perm) ? '✓' : '✗'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PermissionDebugger;
```

## Best Practices for Permission Management

1. **Document Required Permissions**
   - Clearly document required permissions in component JSDoc
   - List all permissions used in the widget's README

2. **Fail Closed, Not Open**
   - Default to denying access when permission checks fail
   - Don't assume permissions exist if not explicitly granted

3. **Handle Permission Loading States**
   - Show appropriate loading indicators while permissions load
   - Don't render sensitive content until permissions are confirmed

4. **Perform Deep Permission Checks**
   - Check permissions at all levels (UI, API calls, data access)
   - Never rely solely on hiding UI elements for security

5. **Keep Permission Logic Centralized**
   - Use hooks and utility functions for permission checks
   - Avoid duplicating permission logic across components

6. **Test Permission Scenarios**
   - Create tests for each permission level
   - Verify both positive and negative permission cases

## Conclusion

By properly integrating with the application's permission system, widgets can ensure that users only have access to features and data they're authorized to use. Following these patterns creates a secure, consistent experience that respects application-wide security controls.

For more information on API integration, see the [Data and API Integration](./07-data-api.md) guide.
