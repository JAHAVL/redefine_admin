import axios from 'axios';

// Define file and folder types
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

interface User {
  id: string;
  name: string;
  email?: string;
}

interface FileManagerAPI {
  // File operations
  getFiles: (directoryId?: string | null) => Promise<FileItem[]>;
  getFileById: (fileId: string) => Promise<FileItem>;
  createFolder: (name: string, parentId?: string) => Promise<FileItem>;
  uploadFile: (file: File, path?: string, projectId?: string | number | null) => Promise<any>;
  uploadFiles: (files: File[], path?: string) => Promise<any[]>;
  deleteFile: (fileId: string) => Promise<void>;
  deleteFiles: (fileIds: string[]) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<FileItem>;
  moveFile: (fileId: string, newParentId: string) => Promise<FileItem>;
  shareFile: (fileId: string, isShared: boolean) => Promise<FileItem>;
  downloadFile: (fileId: string) => Promise<Blob>;
  searchFiles: (query: string) => Promise<FileItem[]>;
  updateFilePermissions: (fileId: string, access: 'private' | 'shared' | 'public', sharedWith?: string[]) => Promise<FileItem>;
  getFileUsers: (fileId: string) => Promise<User[]>;
  getSharedWithMe: () => Promise<FileItem[]>;
  getSharedByMe: () => Promise<FileItem[]>;
  
  // User search function
  searchUsers: (query: string) => Promise<{ success: boolean; users: User[]; message?: string }>;
  
  // Share Group functions
  getShareGroups: () => Promise<{ owned_groups: ShareGroup[], member_groups: ShareGroup[] }>;
  createShareGroup: (name: string, description?: string, members?: string[]) => Promise<ShareGroup>;
  getShareGroup: (groupId: string) => Promise<ShareGroup>;
  updateShareGroup: (groupId: string, name?: string, description?: string) => Promise<ShareGroup>;
  deleteShareGroup: (groupId: string) => Promise<void>;
  addGroupMembers: (groupId: string, members: string[]) => Promise<{ success: boolean; users: User[]; message?: string }>;
  removeGroupMembers: (groupId: string, members: string[]) => Promise<{ success: boolean; users: User[]; message?: string }>;
  
  // Document-Group sharing functions
  shareDocumentWithGroup: (documentId: string, shareGroupId: string, permissionLevel?: "read" | "write" | "admin") => Promise<any>;
  removeGroupDocumentAccess: (documentId: string, groupId: string) => Promise<void>;
  getDocumentGroups: (documentId: string) => Promise<ShareGroup[]>;
  updateGroupDocumentPermission: (documentId: string, shareGroupId: string, permissionLevel: "read" | "write" | "admin") => Promise<any>;
};

// Base API URL - points to the Laravel backend
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';
const FILE_API_PATH = '';

// For debugging
console.log('Using API base URL:', API_BASE_URL);

// API Interface for TypeScript type checking

// Create axios instance with default config
const fileManagerApi = axios.create({
  baseURL: `${API_BASE_URL}${FILE_API_PATH}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
fileManagerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Functions

/**
 * Get all files and folders for a specific directory
 * @param directoryId - ID of the directory to list contents of (null for root)
 */
const getFiles: FileManagerAPI['getFiles'] = async (directoryId: string | null = null): Promise<FileItem[]> => {
  try {
    const params = directoryId ? { parentId: directoryId } : {};
    const response = await fileManagerApi.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

/**
 * Get a single file or folder by ID
 * @param fileId - ID of the file or folder to get
 */
const getFileById: FileManagerAPI['getFileById'] = async (fileId: string): Promise<FileItem> => {
  try {
    const response = await fileManagerApi.get(`/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

/**
 * Create a new folder
 * @param name - Name of the new folder
 * @param parentId - ID of the parent folder (null for root)
 */
const createFolder: FileManagerAPI['createFolder'] = async (name: string, parentId?: string): Promise<FileItem> => {
  try {
    const folderData = {
      name,
      type: 'folder',
      parentId: parentId || undefined,
    };
    const response = await fileManagerApi.post('/folder', folderData);
    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

/**
 * Upload a file
 * @param file - File to upload
 * @param parentId - ID of the parent folder (null for root)
 */
const uploadFile: FileManagerAPI['uploadFile'] = async (file: File, parentId?: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) {
      formData.append('parentId', parentId);
    }

    const response = await fileManagerApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload multiple files
 * @param files - Array of files to upload
 * @param parentId - ID of the parent folder (null for root)
 */
const uploadFiles: FileManagerAPI['uploadFiles'] = async (files: File[], parentId?: string): Promise<any[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (parentId) {
      formData.append('parentId', parentId);
    }

    const response = await fileManagerApi.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

/**
 * Delete a file or folder
 * @param fileId - ID of the file or folder to delete
 */
const deleteFile: FileManagerAPI['deleteFile'] = async (fileId: string): Promise<void> => {
  try {
    await fileManagerApi.delete(`/${fileId}`);
  } catch (error) {
    console.error(`Error deleting file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Delete multiple files or folders
 * @param fileIds - Array of file or folder IDs to delete
 */
const deleteFiles: FileManagerAPI['deleteFiles'] = async (fileIds: string[]): Promise<void> => {
  try {
    await fileManagerApi.post('/delete/multiple', { fileIds });
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    throw error;
  }
};

/**
 * Rename a file or folder
 * @param fileId - ID of the file or folder to rename
 * @param newName - New name for the file or folder
 */
const renameFile: FileManagerAPI['renameFile'] = async (fileId: string, newName: string): Promise<FileItem> => {
  try {
    const response = await fileManagerApi.patch(`/${fileId}`, { name: newName });
    return response.data;
  } catch (error) {
    console.error(`Error renaming file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Move a file or folder to a new parent folder
 * @param fileId - ID of the file or folder to move
 * @param newParentId - ID of the new parent folder (null for root)
 */
const moveFile: FileManagerAPI['moveFile'] = async (fileId: string, newParentId: string): Promise<FileItem> => {
  try {
    const response = await fileManagerApi.patch(`/${fileId}/move`, { 
      parentId: newParentId || null 
    });
    return response.data;
  } catch (error) {
    console.error(`Error moving file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Share a file or folder
 * @param fileId - ID of the file or folder to share
 * @param isShared - Whether the file should be shared (true) or unshared (false)
 */
const shareFile: FileManagerAPI['shareFile'] = async (fileId: string, isShared: boolean): Promise<FileItem> => {
  try {
    const response = await fileManagerApi.patch(`/${fileId}/share`, { shared: isShared });
    return response.data;
  } catch (error) {
    console.error(`Error ${isShared ? 'sharing' : 'unsharing'} file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Download a file
 * @param fileId - ID of the file to download
 */
const downloadFile: FileManagerAPI['downloadFile'] = async (fileId: string): Promise<Blob> => {
  try {
    const response = await fileManagerApi.get(`/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Search for files and folders
 * @param query - Search query
 * @param parentId - Optional parent folder ID to limit search scope
 */
const searchFiles: FileManagerAPI['searchFiles'] = async (query: string, parentId?: string): Promise<FileItem[]> => {
  try {
    const params: any = { query };
    if (parentId) {
      params.parentId = parentId;
    }
    const response = await fileManagerApi.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
};

/**
 * Search for users
 * @param query - Search query
 */
const searchUsers: FileManagerAPI['searchUsers'] = async (query: string): Promise<{ success: boolean; users: User[]; message?: string }> => {
  try {
    // Log the search attempt
    console.log(`Searching for users with query: ${query}`);
    
    // Use the fileManagerApi instance which already has auth headers configured
    // The endpoint should match your Laravel backend route for user search
    const response = await fileManagerApi.post('/users/search', { search: query });
    
    console.log('User search response:', response.data);
    
    if (response.data && Array.isArray(response.data.users)) {
      return {
        success: true,
        users: response.data.users,
        message: undefined
      };
    } else if (response.data && response.data.success) {
      return {
        success: true,
        users: response.data.users || [],
        message: undefined
      };
    } else {
      // Handle unexpected response format
      console.error('Unexpected response format from user search API:', response.data);
      return {
        success: false,
        users: [],
        message: response.data?.message || 'Invalid response from server'
      };
    }
  } catch (error: any) {
    console.error('Error searching users:', error);
    
    // Provide more helpful error message based on status code
    let errorMessage = 'Failed to search users';
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to search users.';
      } else if (error.response.status === 404) {
        errorMessage = 'User search endpoint not found.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.response.data?.message || 'Failed to search users';
      }
    }
    
    return {
      success: false,
      users: [],
      message: errorMessage
    };
  }
};

/**
 * Add members to a share group
 * @param groupId - ID of the share group
 * @param members - Array of user IDs to add
 */
const addGroupMembersFunc: FileManagerAPI['addGroupMembers'] = async (groupId: string, members: string[]): Promise<{ success: boolean; users: User[]; message?: string }> => {
  try {
    const response = await fileManagerApi.post(`/share-groups/${groupId}/add-members`, { members });
    return response.data;
  } catch (error) {
    console.error(`Error adding members to share group with ID ${groupId}:`, error);
    throw error;
  }
};

/**
 * Remove members from a share group
 * @param groupId - ID of the share group
 * @param members - Array of user IDs to remove
 */
const removeGroupMembersFunc: FileManagerAPI['removeGroupMembers'] = async (groupId: string, members: string[]): Promise<{ success: boolean; users: User[]; message?: string }> => {
  try {
    const response = await fileManagerApi.post(`/share-groups/${groupId}/remove-members`, { members });
    return response.data;
  } catch (error) {
    console.error(`Error removing members from share group with ID ${groupId}:`, error);
    throw error;
  }
};

// Permission management functions

/**
 * Update file access permissions
 * @param fileId - ID of the file to update permissions for
 * @param access - New access level ('private', 'shared', or 'public')
 * @param sharedWith - Array of user IDs to share with (only needed for 'shared' access)
 */
const updateFilePermissions: FileManagerAPI['updateFilePermissions'] = async (fileId: string, access: 'private' | 'shared' | 'public', sharedWith?: string[]): Promise<FileItem> => {
  try {
    const data = { access, shared_with: sharedWith };
    const response = await fileManagerApi.patch(`/${fileId}/permissions`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating permissions for file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Get users who have access to a file
 * @param fileId - ID of the file to get users for
 */
const getFileUsers: FileManagerAPI['getFileUsers'] = async (fileId: string): Promise<User[]> => {
  try {
    const response = await fileManagerApi.get(`/${fileId}/users`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching users for file with ID ${fileId}:`, error);
    throw error;
  }
};

/**
 * Get files shared with the current user
 */
const getSharedWithMe: FileManagerAPI['getSharedWithMe'] = async (): Promise<FileItem[]> => {
  try {
    const response = await fileManagerApi.get('/shared-with-me');
    return response.data;
  } catch (error) {
    console.error('Error fetching shared files:', error);
    throw error;
  }
};

/**
 * Get files shared by the current user
 */
const getSharedByMe: FileManagerAPI['getSharedByMe'] = async (): Promise<FileItem[]> => {
  try {
    const response = await fileManagerApi.get('/shared-by-me');
    return response.data;
  } catch (error) {
    console.error('Error fetching files shared by me:', error);
    throw error;
  }
};

// Share Group functions

/**
 * Get all share groups for the current user
 */
const getShareGroups: FileManagerAPI['getShareGroups'] = async (): Promise<{ owned_groups: ShareGroup[], member_groups: ShareGroup[] }> => {
  try {
    const response = await fileManagerApi.get('/share-groups');
    return response.data;
  } catch (error) {
    console.error('Error fetching share groups:', error);
    throw error;
  }
};

/**
 * Create a new share group
 * @param name - Name of the share group
 * @param description - Optional description of the share group
 * @param members - Optional array of user IDs to add as members
 */
const createShareGroup: FileManagerAPI['createShareGroup'] = async (name: string, description?: string, members?: string[]): Promise<ShareGroup> => {
  try {
    const data = { name, description, members };
    const response = await fileManagerApi.post('/share-groups', data);
    return response.data;
  } catch (error) {
    console.error('Error creating share group:', error);
    throw error;
  }
};

/**
 * Get details of a specific share group
 * @param groupId - ID of the share group to get
 */
const getShareGroup: FileManagerAPI['getShareGroup'] = async (groupId: string): Promise<ShareGroup> => {
  try {
    const response = await fileManagerApi.get(`/share-groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching share group with ID ${groupId}:`, error);
    throw error;
  }
};

/**
 * Update a share group
 * @param groupId - ID of the share group to update
 * @param name - New name for the share group
 * @param description - New description for the share group
 */
const updateShareGroup: FileManagerAPI['updateShareGroup'] = async (groupId: string, name?: string, description?: string): Promise<ShareGroup> => {
  try {
    const data: { name?: string; description?: string } = {};
    if (name) data.name = name;
    if (description) data.description = description;
    
    const response = await fileManagerApi.put(`/share-groups/${groupId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating share group with ID ${groupId}:`, error);
    throw error;
  }
};

/**
 * Delete a share group
 * @param groupId - ID of the share group to delete
 */
const deleteShareGroup: FileManagerAPI['deleteShareGroup'] = async (groupId: string): Promise<void> => {
  try {
    await fileManagerApi.delete(`/share-groups/${groupId}`);
  } catch (error) {
    console.error(`Error deleting share group with ID ${groupId}:`, error);
    throw error;
  }
};

/**
 * Add members to a share group
 * @param groupId - ID of the share group
 * @param members - Array of user IDs to add as members
 */
const addGroupMembers: FileManagerAPI['addGroupMembers'] = async (groupId: string, members: string[]): Promise<{ success: boolean; users: User[]; message?: string }> => {
  try {
    console.log(`Adding members to group ${groupId}:`, members);
    
    // The endpoint should match your Laravel backend route for adding group members
    const response = await fileManagerApi.post(`/share-groups/${groupId}/members`, { members });
    
    console.log('Add members response:', response.data);
    
    if (response.data && (response.data.success || Array.isArray(response.data.users))) {
      return {
        success: true,
        users: response.data.users || [],
        message: response.data.message
      };
    } else {
      console.error('Unexpected response format from add members API:', response.data);
      return {
        success: false,
        users: [],
        message: response.data?.message || 'Invalid response from server'
      };
    }
  } catch (error: any) {
    console.error(`Error adding members to share group with ID ${groupId}:`, error);
    
    // Provide more helpful error message based on status code
    let errorMessage = 'Failed to add members to the group';
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to add members to this group.';
      } else if (error.response.status === 404) {
        errorMessage = 'Group not found.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.response.data?.message || 'Failed to add members to the group';
      }
    }
    
    return {
      success: false,
      users: [],
      message: errorMessage
    };
  }
};

/**
 * Share a document with a group
 * @param documentId - ID of the document to share
 * @param shareGroupId - ID of the share group to share with
 * @param permissionLevel - Permission level for the group
 */
const shareDocumentWithGroup: FileManagerAPI['shareDocumentWithGroup'] = async (documentId: string, shareGroupId: string, permissionLevel?: "read" | "write" | "admin"): Promise<any> => {
  try {
    console.log(`Sharing document ${documentId} with group ${shareGroupId}, permission: ${permissionLevel || 'read'}`);
    
    const data = {
      group_id: shareGroupId,
      permission_level: permissionLevel || 'read'
    };
    
    // The endpoint should match your Laravel backend route for sharing documents with groups
    const response = await fileManagerApi.post(`/documents/${documentId}/share/group`, data);
    
    console.log('Share document with group response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.warn('Unexpected response format from shareDocumentWithGroup API:', response.data);
      return { success: false, message: 'Invalid response from server' };
    }
  } catch (error: any) {
    console.error(`Error sharing document with group:`, error);
    
    // Log specific error details to help with debugging
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
    
    // Return error object instead of throwing to prevent UI crashes
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Failed to share document with group'
    };
  }
};

/**
 * Remove a group's access to a document
 * @param documentId - ID of the document
 * @param shareGroupId - ID of the share group
 */
const removeGroupDocumentAccess: FileManagerAPI['removeGroupDocumentAccess'] = async (documentId: string, shareGroupId: string): Promise<void> => {
  try {
    const data = {
      document_id: documentId,
      share_group_id: shareGroupId
    };
    const response = await fileManagerApi.post('/file-manager/remove-group-access', data);
    return response.data;
  } catch (error) {
    console.error(`Error removing group access from document:`, error);
    throw error;
  }
};

/**
 * Get all groups that have access to a document
 * @param documentId - ID of the document
 */
const getDocumentGroups: FileManagerAPI['getDocumentGroups'] = async (documentId: string): Promise<ShareGroup[]> => {
  try {
    console.log(`Fetching groups for document ${documentId}`);
    
    // The endpoint should match your Laravel backend route for getting document groups
    const response = await fileManagerApi.get(`/documents/${documentId}/groups`);
    
    console.log('Document groups response:', response.data);
    
    if (response.data && Array.isArray(response.data.groups)) {
      return response.data.groups;
    } else if (response.data && Array.isArray(response.data)) {
      // Handle case where API returns array directly
      return response.data;
    } else {
      console.warn('Unexpected response format from getDocumentGroups API:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error(`Error fetching groups for document ${documentId}:`, error);
    
    // Log specific error details to help with debugging
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
    
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

/**
 * Update a group's permission level for a document
 * @param documentId - ID of the document
 * @param shareGroupId - ID of the share group
 * @param permissionLevel - New permission level
 */
const updateGroupDocumentPermission: FileManagerAPI['updateGroupDocumentPermission'] = async (documentId: string, shareGroupId: string, permissionLevel: "read" | "write" | "admin"): Promise<any> => {
  try {
    const data = {
      document_id: documentId,
      share_group_id: shareGroupId,
      permission_level: permissionLevel
    };
    const response = await fileManagerApi.post('/file-manager/update-group-permission', data);
    return response.data;
  } catch (error) {
    console.error(`Error updating group permission for document:`, error);
    throw error;
  }
};

// Create a complete API object with all functions that implements FileManagerAPI interface
const api: FileManagerAPI = {
  getFiles,
  getFileById,
  createFolder,
  uploadFile,
  uploadFiles,
  deleteFile,
  deleteFiles,
  renameFile,
  moveFile,
  shareFile,
  downloadFile,
  searchFiles,
  updateFilePermissions,
  getFileUsers,
  getSharedWithMe,
  getSharedByMe,
  searchUsers,
  getShareGroups,
  createShareGroup,
  getShareGroup,
  updateShareGroup,
  deleteShareGroup,
  addGroupMembers,
  removeGroupMembers: removeGroupMembersFunc,
  shareDocumentWithGroup,
  removeGroupDocumentAccess,
  getDocumentGroups,
  updateGroupDocumentPermission,
};

// Export types
export type { FileItem, ShareGroup, User, FileManagerAPI };

// Export fileManagerApi for direct use in components
export { fileManagerApi };

// Export the complete API object as default
export default api;
