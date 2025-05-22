# Common Patterns

This document outlines common UI and functionality patterns used throughout the application to ensure consistency and reusability.

## Loading States

The application handles loading states consistently using a standardized approach:

### Component-Level Loading States

```tsx
// Example of component-level loading state
import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DataDisplay: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (data.length === 0) {
    return <div className="empty-state">No data available</div>;
  }
  
  return (
    <div className="data-display">
      {/* Render data */}
    </div>
  );
};
```

### Application-Level Loading States

For application-level loading, such as during initial load or route transitions:

```tsx
// App.tsx
import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';

// Lazy-loaded routes
const ProtectedRoutes = React.lazy(() => import('./routes/ProtectedRoutes'));

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (initialLoading) {
    return <LoadingScreen message="Loading application..." />;
  }
  
  return (
    <Router>
      <Suspense fallback={<LoadingScreen message="Loading content..." />}>
        <ProtectedRoutes />
      </Suspense>
    </Router>
  );
};
```

## Error Handling

The application uses a consistent approach to error handling:

### Error Boundaries for Component Trees

```tsx
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    // Here you could also log to an error reporting service
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Error Display Components

```tsx
// src/components/ErrorMessage.tsx
import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <p>{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
```

### Try-Catch Pattern for API Calls

```tsx
// src/services/api.ts
export async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle HTTP errors
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

## Authentication Flow

The application implements a standard authentication flow:

### Authentication Context

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, logoutUser, checkSession } from '../services/authService';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        setLoading(true);
        const userData = await checkSession();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    verifySession();
  }, []);
  
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(username, password);
      setUser(userData);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Protected Route Component

```tsx
// src/routes/ProtectedRoutes.tsx (excerpt)
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Component />;
};
```

## Form Handling

The application uses a consistent approach to form handling:

```tsx
// src/components/GenericForm.tsx
import React, { useState } from 'react';
import './GenericForm.css';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: (value: string) => string | null;
}

interface GenericFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonText: string;
  initialValues?: Record<string, any>;
}

const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  submitButtonText,
  initialValues = {}
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const fieldValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: fieldValue
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    fields.forEach(field => {
      // Check required fields
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
      
      // Run custom validation if provided
      if (field.validation && formData[field.name]) {
        const validationError = field.validation(formData[field.name]);
        if (validationError) {
          newErrors[field.name] = validationError;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form className="generic-form" onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field.name} className="form-field">
          <label htmlFor={field.name}>{field.label}</label>
          
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className={errors[field.name] ? 'error' : ''}
            >
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleChange}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className={errors[field.name] ? 'error' : ''}
              required={field.required}
            />
          )}
          
          {errors[field.name] && (
            <div className="error-text">{errors[field.name]}</div>
          )}
        </div>
      ))}
      
      <button type="submit" className="submit-button">
        {submitButtonText}
      </button>
    </form>
  );
};

export default GenericForm;
```

## Data Fetching Pattern

The application implements a consistent data fetching pattern:

```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string, options?: RequestInit): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  
  const refetch = () => {
    setRefetchIndex(prevIndex => prevIndex + 1);
  };
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch data');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [url, refetchIndex]);
  
  return { data, loading, error, refetch };
}
```

## Best Practices

1. **Consistent Patterns** - Use the same patterns for similar functionality throughout the app
2. **Component Composition** - Build complex components from smaller, specialized components
3. **Custom Hooks** - Extract reusable logic into custom hooks
4. **Error Handling** - Implement comprehensive error handling at multiple levels
5. **Loading States** - Show appropriate loading indicators during async operations
6. **Form Validation** - Use consistent form validation approaches
7. **API Abstraction** - Abstract API calls behind service functions
