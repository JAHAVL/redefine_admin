import axios from 'axios';

// Type definitions
export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface ShareGroup {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  member_count?: number;
  permission_level?: 'read' | 'write' | 'admin';
  members?: User[];
  owner?: User;
}

// Base API URL
const API_URL = '/api/v1/widgets/file-manager';

// File Manager API
export const fileManagerApi = {
  // Get files and folders
  getFiles: async (params: Record<string, any> = {}) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  },

  // Upload a file
  uploadFile: async (file: File, path: string = '/', projectId: number | string | null = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('path', path);
      
      if (projectId) {
        formData.append('project_id', String(projectId));
      }

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Create a new folder
  createFolder: async (name: string, path: string = '/', projectId: number | string | null = null) => {
    try {
      const data = {
        name,
        path,
        project_id: projectId,
      };

      const response = await axios.post(`${API_URL}/create-folder`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },

  // Update a file or folder
  updateFile: async (id: number | string, data: Record<string, any>) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  },

  // Delete a file or folder
  deleteFile: async (id: number | string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Add a tag to a file
  addTag: async (fileId: number | string, tagId: number | string) => {
    try {
      const response = await axios.post(`${API_URL}/add-tag`, {
        file_id: fileId,
        tag_id: tagId,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  },

  // Remove a tag from a file
  removeTag: async (fileId: number | string, tagId: number | string) => {
    try {
      const response = await axios.post(`${API_URL}/remove-tag`, {
        file_id: fileId,
        tag_id: tagId,
      });
      return response.data;
    } catch (error) {
      console.error('Error removing tag:', error);
      throw error;
    }
  },

  // Create a new tag
  createTag: async (name: string, color: string) => {
    try {
      const response = await axios.post(`${API_URL}/create-tag`, {
        name,
        color,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  // Get all groups that have access to a document
  getDocumentGroups: async (documentId: string | number) => {
    try {
      const response = await axios.get(`${API_URL}/${documentId}/groups`);
      return response.data.groups;
    } catch (error) {
      console.error(`Error fetching groups for document:`, error);
      throw error;
    }
  },

  // Get all share groups for the current user
  getShareGroups: async () => {
    try {
      const response = await axios.get(`${API_URL}/share-groups`);
      return response.data;
    } catch (error) {
      console.error('Error fetching share groups:', error);
      throw error;
    }
  },

  // Create a new share group
  createShareGroup: async (name: string, description?: string, members?: string[]) => {
    try {
      const data = { name, description, members };
      const response = await axios.post(`${API_URL}/share-groups`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating share group:', error);
      throw error;
    }
  },
};

export default fileManagerApi;
