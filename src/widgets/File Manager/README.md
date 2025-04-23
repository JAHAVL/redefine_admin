# File Manager Widget

## Overview

The File Manager Widget is a comprehensive file management system integrated into the Admin-React application. It provides functionality for organizing, uploading, downloading, and sharing files and folders, with support for tagging, permissions, and group-based access control.

## Architecture

The File Manager Widget follows a modular architecture with the following key components:

```
/widgets/File Manager/
├── actions.ts              # Standardized actions for AI integration
├── components/             # Reusable UI components
│   ├── FileList.tsx        # List view of files and folders
│   ├── FilePreview.tsx     # File preview component
│   ├── Breadcrumbs.tsx     # Navigation breadcrumbs
│   └── ...                 # Other components
├── GroupsPage/             # Group management
│   └── GroupsPage.tsx      # Groups management component
├── theme.ts                # Theme configuration
├── types.ts                # TypeScript interfaces
└── index.ts                # Main export file
```

## Features

- **File Operations**: Upload, download, rename, move, and delete files
- **Folder Management**: Create, navigate, and organize folders
- **File Preview**: Preview various file types directly in the browser
- **Sharing**: Share files with users and groups with different permission levels
- **Tags**: Organize files with customizable tags
- **Search**: Find files by name, type, tags, and content
- **Groups**: Manage user groups for shared access to files

## Theme System

The File Manager Widget uses a dedicated theme system defined in `theme.ts`. This ensures consistent styling throughout the widget and allows for easy customization.

### Theme Structure

```typescript
// Example of theme usage
import FileManagerTheme from '../theme';

const StyledComponent = styled.div`
  background-color: ${FileManagerTheme.colors.background.main};
  color: ${FileManagerTheme.colors.text.primary};
  padding: ${FileManagerTheme.spacing.md};
  border-radius: ${FileManagerTheme.borderRadius.md};
`;
```

### Theme Properties

- **Colors**: Background, text, interactive elements, status indicators
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Borders**: Border styles and radii
- **Shadows**: Elevation shadows
- **Transitions**: Animation timing

## Data Types

The File Manager Widget uses several key data types defined in `types.ts`:

### FileItem

```typescript
interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'pdf' | 'image' | 'doc' | 'excel';
  size: number | null;
  modified: string;
  shared: boolean;
  parentId?: string;
  access: 'private' | 'shared' | 'public';
  owner_id?: string;
  shared_with?: string[];
  shared_groups?: ShareGroup[];
}
```

### Tag

```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}
```

### ShareGroup

```typescript
interface ShareGroup {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  member_count?: number;
  permission_level?: 'read' | 'write' | 'admin';
  members?: User[];
  owner?: User;
}
```

### User

```typescript
interface User {
  id: string;
  name: string;
  email?: string;
}
```

## API Endpoints

The File Manager Widget interacts with the following API endpoints:

### Files and Folders

- `GET /api/files` - Get files and folders (with optional filters)
- `GET /api/files/{id}` - Get a specific file or folder
- `POST /api/files` - Upload a new file
- `PUT /api/files/{id}` - Update a file (rename, move, etc.)
- `DELETE /api/files/{id}` - Delete a file
- `GET /api/files/{id}/download` - Download a file
- `POST /api/folders` - Create a new folder
- `DELETE /api/folders/{id}` - Delete a folder

### Tags

- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/{id}` - Update a tag
- `DELETE /api/tags/{id}` - Delete a tag
- `POST /api/files/{id}/tags/{tagId}` - Add a tag to a file
- `DELETE /api/files/{id}/tags/{tagId}` - Remove a tag from a file

### Sharing

- `POST /api/files/{id}/share` - Share a file with users or groups
- `DELETE /api/files/{id}/share/{userId}` - Remove sharing for a user
- `PUT /api/files/{id}/share/{userId}` - Update sharing permissions for a user

### Groups

- `GET /api/groups` - Get all groups
- `GET /api/groups/{id}` - Get a specific group
- `POST /api/groups` - Create a new group
- `PUT /api/groups/{id}` - Update a group
- `DELETE /api/groups/{id}` - Delete a group
- `POST /api/groups/{id}/members` - Add members to a group
- `DELETE /api/groups/{id}/members/{userId}` - Remove a member from a group

## AI Integration

The File Manager Widget is fully integrated with the application's AI assistant through standardized actions defined in `actions.ts`. These actions allow the AI to control the File Manager Widget programmatically.

### Navigation Actions

```typescript
// Navigate to file manager
viewFileManager(): void

// Navigate to file manager groups
viewFileManagerGroups(): void

// Navigate to a specific folder
viewFolder(folderId: string): void
```

### File Operations

```typescript
// Get all files in a folder
getFiles(folderId: string): Promise<FileItem[]>

// Upload a file
uploadFile(folderId: string, file: File): Promise<FileItem | null>

// Download a file
downloadFile(fileId: string): Promise<boolean>

// Delete a file
deleteFile(fileId: string): Promise<boolean>
```

### Folder Operations

```typescript
// Create a new folder
createFolder(parentFolderId: string, folderName: string): Promise<FileItem | null>

// Delete a folder
deleteFolder(folderId: string): Promise<boolean>
```

### Tag Operations

```typescript
// Create a new tag
createTag(tagName: string, color: string): Promise<Tag | null>

// Add a tag to a file
addTagToFile(fileId: string, tagId: string): Promise<boolean>
```

### Sharing Operations

```typescript
// Share a file with users or groups
shareFile(fileId: string, shareWith: string[]): Promise<boolean>
```

## Usage Examples

### Basic Component Integration

```tsx
import { FileManager } from 'widgets/File Manager';

const MyComponent = () => {
  return (
    <div>
      <h1>File Management System</h1>
      <FileManager />
    </div>
  );
};
```

### Using File Manager Actions

```tsx
import { useEffect, useState } from 'react';
import fileManagerActions from 'widgets/File Manager/actions';

const FolderContents = ({ folderId }) => {
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    const loadFiles = async () => {
      const files = await fileManagerActions.getFiles(folderId);
      setFiles(files);
    };
    
    loadFiles();
  }, [folderId]);
  
  const handleCreateFolder = async (name) => {
    const newFolder = await fileManagerActions.createFolder(folderId, name);
    if (newFolder) {
      setFiles([...files, newFolder]);
    }
  };
  
  const handleUploadFile = async (file) => {
    const newFile = await fileManagerActions.uploadFile(folderId, file);
    if (newFile) {
      setFiles([...files, newFile]);
    }
  };
  
  // Component rendering...
};
```

### Programmatic Navigation

```tsx
import { useAI } from 'contexts/AIContext';

const FileManagerNavigation = () => {
  const { navigateToFileManager } = useAI();
  
  return (
    <div>
      <button onClick={() => navigateToFileManager()}>All Files</button>
      <button onClick={() => navigateToFileManager('groups')}>Manage Groups</button>
    </div>
  );
};
```

## File Type Handling

The File Manager includes a helper function to determine the appropriate file type based on MIME types:

```typescript
const determineFileType = (mimeType: string): FileItem['type'] => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType === 'application/pdf') {
    return 'pdf';
  } else if (mimeType === 'application/msword' || 
             mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'doc';
  } else if (mimeType === 'application/vnd.ms-excel' || 
             mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return 'excel';
  } else {
    return 'file';
  }
};
```

## Best Practices

1. **Theme Consistency**: Always use the File Manager theme for styling components
2. **Type Safety**: Leverage the provided TypeScript interfaces for type checking
3. **Action Standardization**: Use the standardized actions for operations
4. **Error Handling**: Implement proper error handling for API calls
5. **Responsive Design**: Ensure components work well on different screen sizes
6. **Permission Checking**: Always verify user permissions before performing operations

## For AI Integration

When integrating with the AI assistant, follow these guidelines:

1. **Use Intent Mapping**: Map user intents to specific File Manager actions
2. **Provide Context**: Include relevant context with navigation actions
3. **Track Operations**: Register background operations for tracking
4. **Handle Errors**: Provide meaningful error messages
5. **Update UI**: Reflect operation status in the UI
6. **Consider File Size**: Be aware of file size limitations for uploads

Example of AI handling a file-related request:

```typescript
// User asks: "Show me my files"
const handleShowFilesRequest = () => {
  // Navigate to the file manager
  navigateByIntent('view_file_manager');
};

// User asks: "Create a new folder called 'Project Documents' in my Documents folder"
const handleCreateFolderRequest = async (folderName, parentFolderId) => {
  // Register the operation
  const operationId = `create_folder_${Date.now()}`;
  operationService.registerOperation(operationId, 'create_folder', { folderName, parentFolderId });
  
  try {
    // Create the folder
    const result = await fileManagerActions.createFolder(parentFolderId, folderName);
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'Folder created successfully');
    
    // Navigate to show the result
    navigateByIntent('view_folder', { folderId: result.id });
    
    return result;
  } catch (error) {
    operationService.updateStatus(operationId, 'failed', error.message);
    throw error;
  }
};

// User asks: "Upload this image to my Photos folder"
const handleUploadFileRequest = async (file, folderId) => {
  // Register the operation
  const operationId = `upload_file_${Date.now()}`;
  operationService.registerOperation(operationId, 'upload_file', { fileName: file.name, folderId });
  
  try {
    // Upload the file
    const result = await fileManagerActions.uploadFile(folderId, file);
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'File uploaded successfully');
    
    return result;
  } catch (error) {
    operationService.updateStatus(operationId, 'failed', error.message);
    throw error;
  }
};
```
