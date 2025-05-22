/**
 * RAI Chat API Service
 * Handles all communication with the RAI Chat backend
 */

import { 
  ChatMessage, 
  ChatSession, 
  ApiResponse, 
  CreateSessionResponse,
  SendMessageResponse,
  MemorySearchResult,
  ListModelsResponse,
  VersionInfo
} from './types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6102';
const API_ENDPOINTS = {
  CREATE_SESSION: '/api/chat/sessions',
  LIST_SESSIONS: '/api/chat/sessions',
  GET_SESSION: (id: string) => `/api/chat/sessions/${id}`,
  DELETE_SESSION: (id: string) => `/api/chat/sessions/${id}`,
  SEND_MESSAGE: '/api/chat/message',
  GET_MESSAGES: (sessionId: string) => `/api/chat/sessions/${sessionId}/messages`,
  REMEMBER: '/api/memory/remember',
  SEARCH_MEMORY: '/api/memory/search',
  LIST_MODELS: '/api/models',
  VERSION: '/api/version'
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }

    // Create URL with query parameters for GET requests
    let url = API_BASE_URL + endpoint;
    if (method === 'GET' && data) {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      url += `?${params.toString()}`;
    }

    // Make the request
    const response = await fetch(url, options);
    
    // Parse the JSON response
    const responseData = await response.json();
    
    // Handle API error responses
    if (!response.ok) {
      return {
        status: 'error',
        message: responseData.message || 'API request failed',
        code: response.status,
      };
    }
    
    // Return successful response
    return {
      status: 'success',
      data: responseData,
    };
    
  } catch (error) {
    // Handle network or JSON parsing errors
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Chat Session API Methods
 */
export const chatSessionApi = {
  createSession: async (userId: string = 'anonymous', title: string = 'New Chat'): Promise<ApiResponse<CreateSessionResponse>> => {
    return apiRequest<CreateSessionResponse>(API_ENDPOINTS.CREATE_SESSION, 'POST', { user_id: userId, title });
  },
  
  listSessions: async (userId: string = 'anonymous'): Promise<ApiResponse<ChatSession[]>> => {
    return apiRequest<ChatSession[]>(API_ENDPOINTS.LIST_SESSIONS, 'GET', { user_id: userId });
  },
  
  getSession: async (sessionId: string): Promise<ApiResponse<ChatSession>> => {
    return apiRequest<ChatSession>(API_ENDPOINTS.GET_SESSION(sessionId), 'GET');
  },
  
  deleteSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(API_ENDPOINTS.DELETE_SESSION(sessionId), 'DELETE');
  }
};

/**
 * Message API Methods
 */
export const messageApi = {
  sendMessage: async (
    sessionId: string, 
    content: string, 
    userId: string = 'anonymous'
  ): Promise<ApiResponse<SendMessageResponse>> => {
    return apiRequest<SendMessageResponse>(API_ENDPOINTS.SEND_MESSAGE, 'POST', {
      session_id: sessionId,
      user_id: userId,
      content,
    });
  },
  
  getMessages: async (sessionId: string): Promise<ApiResponse<ChatMessage[]>> => {
    return apiRequest<ChatMessage[]>(API_ENDPOINTS.GET_MESSAGES(sessionId), 'GET');
  }
};

/**
 * Memory API Methods
 */
export const memoryApi = {
  remember: async (
    content: string, 
    userId: string = 'anonymous', 
    tags: string[] = []
  ): Promise<ApiResponse<{ memory_id: string }>> => {
    return apiRequest<{ memory_id: string }>(API_ENDPOINTS.REMEMBER, 'POST', {
      user_id: userId,
      content,
      tags,
    });
  },
  
  search: async (
    query: string, 
    userId: string = 'anonymous', 
    limit: number = 10
  ): Promise<ApiResponse<MemorySearchResult[]>> => {
    return apiRequest<MemorySearchResult[]>(API_ENDPOINTS.SEARCH_MEMORY, 'GET', {
      user_id: userId,
      query,
      limit,
    });
  }
};

/**
 * System API Methods
 */
export const systemApi = {
  listModels: async (): Promise<ApiResponse<ListModelsResponse>> => {
    return apiRequest<ListModelsResponse>(API_ENDPOINTS.LIST_MODELS, 'GET');
  },
  
  getVersion: async (): Promise<ApiResponse<VersionInfo>> => {
    return apiRequest<VersionInfo>(API_ENDPOINTS.VERSION, 'GET');
  }
};
