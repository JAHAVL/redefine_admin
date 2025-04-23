# Real Backend Integration Guide

This guide explains how to integrate the improved API connection utilities with your File Manager widget to connect to the real backend.

## Overview of Changes

We've implemented a robust solution to address the API connection issues:

1. **Authentication Utilities** (`utils/authUtils.js`)
   - Handles multiple token formats (JWT, Bearer, etc.)
   - Supports CSRF token detection
   - Provides consistent authentication headers

2. **API Connection Utilities** (`utils/apiConnectionUtils.js`)
   - Implements intelligent endpoint discovery
   - Tries multiple URL combinations systematically
   - Handles both development and production environments
   - Saves successful configurations for future use

3. **Improved AddGroupMembersModal** (`components/AddGroupMembersModalV2.tsx`)
   - Uses the new utilities for robust authentication
   - Provides detailed error information
   - Includes connection testing functionality

## Integration Steps

### Step 1: Import the New Modal Component

Replace the import for the old AddGroupMembersModal with the new version:

```tsx
// Before
import AddGroupMembersModal from './components/AddGroupMembersModal';

// After
import AddGroupMembersModal from './components/AddGroupMembersModalV2';
```

### Step 2: Update Props (if needed)

The new component expects these props:

```tsx
interface AddGroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  onMembersAdded?: (users: User[]) => void;
  selectedUsers?: User[];
}
```

Make sure you're passing the correct props when using the component.

### Step 3: Test the Connection

When the modal opens, you can use the "Test API Connection" button to verify connectivity to the real backend. The component will:

1. Try multiple endpoint combinations
2. Check for authentication tokens
3. Display detailed connection status

## Troubleshooting

If you're still experiencing connection issues:

1. **Check Authentication**
   - Open your browser console
   - Run the script in `checkAuthToken.js` to verify token availability
   - Ensure you're logged in to the application

2. **Verify CORS Settings**
   - The component now tries both with and without credentials
   - Check browser console for CORS-related errors

3. **Test Specific Endpoints**
   - Use the `testRealBackend.js` script to test specific API endpoints
   - Look for detailed error messages in the console

## How It Works with Your AI Integration

This solution aligns perfectly with your AI chat integration architecture:

1. **Consistent API Interface**: The utilities provide a standardized way to interact with API endpoints, making it easier for AI to discover and use them.

2. **Flexible Navigation**: The robust endpoint discovery mechanism supports both web and mobile interfaces, allowing the AI to navigate users to different parts of the application.

3. **Security Boundaries**: Authentication is handled consistently, ensuring the AI operates within proper security boundaries.

4. **State Synchronization**: Successful configurations are saved, allowing the AI to maintain state between sessions.

## Next Steps

1. Integrate the new modal component in your FileManagerWidget
2. Test the connection to the real backend
3. If successful, consider applying the same pattern to other API calls in your application
