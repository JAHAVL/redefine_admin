# Data and API Integration

This guide outlines best practices for integrating widgets with data sources and APIs, ensuring clean separation of concerns and maintainable code.

## Core Principles

When integrating with APIs, widgets should follow these principles:

1. **Separation of Concerns**
   - API calls should be isolated from UI components
   - Data transformation should happen in dedicated layers
   - Error handling should be consistent and centralized

2. **Abstraction**
   - Create service layers to abstract API endpoints
   - Shield components from API implementation details
   - Make services replaceable without affecting components

3. **Error Handling**
   - Implement proper error boundaries
   - Provide clear error states for users
   - Add appropriate retry mechanisms

4. **Performance**
   - Implement caching strategies
   - Minimize redundant API calls
   - Use pagination and request optimization

## API Service Layer

Create a dedicated service layer for API communication:

```tsx
// api/apiService.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ErrorResponse } from '../types';

// Base API configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle expired tokens
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  async get<T>(
    url: string, 
    params?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(
        url, 
        { ...config, params }
      );
      return { 
        data: response.data, 
        status: response.status,
        success: true
      };
    } catch (error) {
      const errorResponse = handleApiError(error);
      return {
        data: null as unknown as T,
        status: errorResponse.status,
        success: false,
        error: errorResponse
      };
    }
  },
  
  async post<T>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(
        url, 
        data, 
        config
      );
      return { 
        data: response.data, 
        status: response.status,
        success: true
      };
    } catch (error) {
      const errorResponse = handleApiError(error);
      return {
        data: null as unknown as T,
        status: errorResponse.status,
        success: false,
        error: errorResponse
      };
    }
  },
  
  async put<T>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(
        url, 
        data, 
        config
      );
      return { 
        data: response.data, 
        status: response.status,
        success: true
      };
    } catch (error) {
      const errorResponse = handleApiError(error);
      return {
        data: null as unknown as T,
        status: errorResponse.status,
        success: false,
        error: errorResponse
      };
    }
  },
  
  async delete<T>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(
        url, 
        config
      );
      return { 
        data: response.data, 
        status: response.status,
        success: true
      };
    } catch (error) {
      const errorResponse = handleApiError(error);
      return {
        data: null as unknown as T,
        status: errorResponse.status,
        success: false,
        error: errorResponse
      };
    }
  }
};

// Error handler function
const handleApiError = (error: any): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      data: error.response?.data,
      code: error.code
    };
  }
  
  return {
    message: error.message || 'Unknown error occurred',
    status: 500,
    data: null,
    code: 'UNKNOWN_ERROR'
  };
};
```

## Domain-Specific Services

Create dedicated services for specific domains:

```tsx
// api/userService.ts
import { apiService } from './apiService';
import { User, UserCreate, UserUpdate, ApiResponse } from '../types';

const BASE_PATH = '/users';

export const userService = {
  async getAll(): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(BASE_PATH);
  },
  
  async getById(id: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(`${BASE_PATH}/${id}`);
  },
  
  async create(user: UserCreate): Promise<ApiResponse<User>> {
    return apiService.post<User>(BASE_PATH, user);
  },
  
  async update(id: string, user: UserUpdate): Promise<ApiResponse<User>> {
    return apiService.put<User>(`${BASE_PATH}/${id}`, user);
  },
  
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${BASE_PATH}/${id}`);
  },
  
  async search(query: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(`${BASE_PATH}/search`, { query });
  }
};
```

## Data Fetching Hooks

Create custom hooks for data fetching:

```tsx
// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, ErrorResponse } from '../types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ErrorResponse) => void;
  initialData?: T;
  autoFetch?: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const { 
    onSuccess, 
    onError, 
    initialData, 
    autoFetch = true 
  } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<ErrorResponse | null>(null);
  
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        setError(response.error || {
          message: 'Unknown error occurred',
          status: 500,
          data: null,
          code: 'UNKNOWN_ERROR'
        });
        onError?.(response.error!);
      }
    } catch (err) {
      const errorObj: ErrorResponse = {
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        status: 500,
        data: null,
        code: 'UNKNOWN_ERROR'
      };
      
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);
  
  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [execute, autoFetch]);
  
  return {
    data,
    loading,
    error,
    execute,
    setData
  };
}
```

## Data Fetching with React Query

For more advanced data fetching, consider React Query:

```tsx
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService } from '../api/userService';
import { User, UserCreate, UserUpdate } from '../types';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hooks for user data
export const useUsers = (filters?: any) => {
  return useQuery(
    userKeys.list(filters),
    async () => {
      const response = await userService.getAll();
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch users');
      }
      
      return response.data;
    }
  );
};

export const useUser = (id: string) => {
  return useQuery(
    userKeys.detail(id),
    async () => {
      const response = await userService.getById(id);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch user');
      }
      
      return response.data;
    },
    {
      enabled: !!id // Only run if id is provided
    }
  );
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (user: UserCreate) => {
      const response = await userService.create(user);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create user');
      }
      
      return response.data;
    },
    {
      // Invalidate and refetch after mutation
      onSuccess: () => {
        queryClient.invalidateQueries(userKeys.lists());
      }
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ id, user }: { id: string; user: UserUpdate }) => {
      const response = await userService.update(id, user);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update user');
      }
      
      return response.data;
    },
    {
      // Update queries after mutation
      onSuccess: (data) => {
        queryClient.invalidateQueries(userKeys.lists());
        queryClient.invalidateQueries(userKeys.detail(data.id));
      }
    }
  );
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (id: string) => {
      const response = await userService.delete(id);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete user');
      }
      
      return id;
    },
    {
      // Update queries after mutation
      onSuccess: (id) => {
        queryClient.invalidateQueries(userKeys.lists());
        queryClient.removeQueries(userKeys.detail(id));
      }
    }
  );
};
```

## Using Data Hooks in Components

```tsx
// components/UserList.tsx
import React from 'react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';

const UserList: React.FC = () => {
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = useUsers();
  
  const deleteUser = useDeleteUser();
  
  if (isLoading) return <div>Loading users...</div>;
  
  if (error) {
    return (
      <div className="error">
        <p>Error loading users: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  
  if (!users || users.length === 0) {
    return <div>No users found</div>;
  }
  
  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };
  
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
```

## Data Types and Schemas

Define clear data types for API responses:

```tsx
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  error?: ErrorResponse;
}

export interface ErrorResponse {
  message: string;
  status: number;
  data: any;
  code?: string;
}

// types/entities.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UserUpdate = Partial<UserCreate>;
```

## Data Transformation Layer

Create data transformation functions to convert between API and UI models:

```tsx
// utils/transformers.ts
import { User, UserViewModel } from '../types';

export const transformUserToViewModel = (user: User): UserViewModel => ({
  id: user.id,
  displayName: user.name,
  email: user.email,
  isAdmin: user.role === 'admin',
  isActive: user.status === 'active',
  joinDate: new Date(user.createdAt).toLocaleDateString()
});

export const transformViewModelToUser = (viewModel: UserViewModel): Partial<User> => ({
  name: viewModel.displayName,
  email: viewModel.email,
  role: viewModel.isAdmin ? 'admin' : 'user',
  status: viewModel.isActive ? 'active' : 'inactive'
});
```

## Mocking APIs for Development

Create mock API implementations for development:

```tsx
// api/mockUserService.ts
import { v4 as uuidv4 } from 'uuid';
import { User, UserCreate, UserUpdate, ApiResponse } from '../types';

// Mock data
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  // More mock users...
];

// Mock implementation
export const mockUserService = {
  async getAll(): Promise<ApiResponse<User[]>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: [...users],
      status: 200,
      success: true
    };
  },
  
  async getById(id: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return {
        data: null as unknown as User,
        status: 404,
        success: false,
        error: {
          message: `User with ID ${id} not found`,
          status: 404,
          data: null,
          code: 'USER_NOT_FOUND'
        }
      };
    }
    
    return {
      data: { ...user },
      status: 200,
      success: true
    };
  },
  
  async create(userData: UserCreate): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    users.push(newUser);
    
    return {
      data: { ...newUser },
      status: 201,
      success: true
    };
  },
  
  // Implement other methods: update, delete, search...
};
```

## Environment-Based API Selection

Configure API service based on environment:

```tsx
// api/index.ts
import { userService } from './userService';
import { mockUserService } from './mockUserService';

// Environment detection
const isTestEnvironment = process.env.NODE_ENV === 'test';
const useMocks = process.env.REACT_APP_USE_MOCKS === 'true';

// Export the appropriate implementation
export const UserService = (isTestEnvironment || useMocks)
  ? mockUserService
  : userService;
```

## Error Handling Patterns

Implement consistent error handling:

```tsx
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## API Testing

Test your API services:

```tsx
// api/userService.test.ts
import { userService } from './userService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should fetch all users', async () => {
    const users = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' }
    ];
    
    mockedAxios.get.mockResolvedValueOnce({ data: users });
    
    const result = await userService.getAll();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/users', expect.any(Object));
    expect(result.success).toBe(true);
    expect(result.data).toEqual(users);
  });
  
  it('should handle errors when fetching users', async () => {
    const error = {
      response: {
        data: { message: 'Server error' },
        status: 500
      }
    };
    
    mockedAxios.get.mockRejectedValueOnce(error);
    
    const result = await userService.getAll();
    
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Server error');
    expect(result.error?.status).toBe(500);
  });
  
  // More tests...
});
```

## Pagination and Infinite Scrolling

Implement pagination for large data sets:

```tsx
// hooks/usePaginatedData.ts
import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { ApiResponse, PaginatedResponse } from '../types';

interface UsePaginatedDataOptions<T> {
  pageSize?: number;
  initialPage?: number;
  onSuccess?: (data: PaginatedResponse<T>) => void;
  onError?: (error: any) => void;
}

export function usePaginatedData<T>(
  fetchFunction: (page: number, pageSize: number) => Promise<ApiResponse<PaginatedResponse<T>>>,
  options: UsePaginatedDataOptions<T> = {}
) {
  const {
    pageSize = 10,
    initialPage = 1,
    onSuccess,
    onError
  } = options;
  
  const [page, setPage] = useState(initialPage);
  const [allItems, setAllItems] = useState<T[]>([]);
  
  const fetchPage = useCallback((pageNumber: number) => {
    return fetchFunction(pageNumber, pageSize);
  }, [fetchFunction, pageSize]);
  
  const { 
    data, 
    loading, 
    error, 
    execute: refetch 
  } = useApi<PaginatedResponse<T>>(
    () => fetchPage(page),
    {
      onSuccess: (data) => {
        setAllItems(prev => page === 1 ? data.items : [...prev, ...data.items]);
        onSuccess?.(data);
      },
      onError
    }
  );
  
  const loadMore = useCallback(() => {
    if (!data || page >= data.totalPages) return;
    setPage(prev => prev + 1);
  }, [data, page]);
  
  const refresh = useCallback(() => {
    setPage(1);
    setAllItems([]);
    refetch();
  }, [refetch]);
  
  return {
    items: allItems,
    loading,
    error,
    page,
    totalPages: data?.totalPages || 0,
    totalItems: data?.totalItems || 0,
    hasMore: data ? page < data.totalPages : false,
    loadMore,
    refresh
  };
}
```

## Best Practices

1. **API Service Design**
   - Create a domain-specific service layer
   - Use proper error handling
   - Document expected responses

2. **Data Fetching**
   - Extract data fetching into custom hooks
   - Use SWR or React Query for complex cases
   - Implement proper loading and error states

3. **Error Handling**
   - Create consistent error responses
   - Use error boundaries for component failures
   - Provide clear user feedback

4. **Performance**
   - Implement caching strategies
   - Use pagination for large datasets
   - Consider request batching for related data

5. **Testing**
   - Mock API responses for unit tests
   - Create testable service interfaces
   - Test error handling and edge cases

## Conclusion

Following these patterns for data and API integration creates a clean, maintainable architecture for widgets. The separation of API services, data transformation, and UI components ensures your code remains flexible and testable.

For more information on using widgets across multiple pages, see the [Cross-Page Widget Usage](./09-cross-page-usage.md) guide.
