/**
 * Type definitions for the RAI Chat API
 */

// Message types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  isLoading?: boolean;
  messageType?: 'error' | 'warning' | 'success' | 'info' | 'welcome' | 'search' | 'default';
}

// Chat session types
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  messages?: ChatMessage[];
}

// API response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  code?: number;
}

export interface CreateSessionResponse {
  session_id: string;
  title: string;
  created_at: string;
}

export interface SendMessageResponse {
  message_id: string;
  response: ChatMessage;
}

export interface MemorySearchResult {
  id: string;
  content: string;
  relevance: number;
  created_at: string;
  tags: string[];
}

export interface ListModelsResponse {
  models: {
    id: string;
    name: string;
    provider: string;
    capabilities: string[];
  }[];
}

export interface VersionInfo {
  version: string;
  build_date: string;
  api_version: string;
  llm_engine_status: 'connected' | 'disconnected';
}
