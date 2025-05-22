# State Management

This document outlines the state management approach used in the application, covering both local component state and application-wide state management.

## State Management Principles

The application follows these core principles for state management:

1. **Locality** - State should be kept as close as possible to where it's used
2. **Minimal shared state** - Only share state when truly necessary
3. **Clear ownership** - Each piece of state should have a clear owner
4. **Predictable updates** - State updates should be predictable and traceable

## Local Component State

For component-specific state that doesn't need to be shared, React's built-in state management is used:

```tsx
import React, { useState, useEffect } from 'react';

const Counter: React.FC = () => {
  // Local component state
  const [count, setCount] = useState(0);
  
  // Effect for side effects
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## Context API for Shared State

For state that needs to be shared across multiple components, React's Context API is used:

### 1. Context Definition

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  username: string;
  role: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (username: string, password: string) => {
    // Authentication logic
    const userData = await fetchUserData(username, password);
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Context Usage

```tsx
// App.tsx - Provider setup
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoutes from './routes/ProtectedRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
};

// Component usage
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  
  if (!user) return <p>Not logged in</p>;
  
  return (
    <div>
      <h2>Profile: {user.username}</h2>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Theme Context Example

For application-wide theming:

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-container ${theme}-theme`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Feature-Specific State

For complex features with their own state requirements, create feature-specific contexts:

```tsx
// src/contexts/FinanceContext.tsx
import React, { createContext, useReducer, useContext } from 'react';

// Define state and actions
interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

type Action = 
  | { type: 'FETCH_TRANSACTIONS_START' }
  | { type: 'FETCH_TRANSACTIONS_SUCCESS', payload: Transaction[] }
  | { type: 'FETCH_TRANSACTIONS_ERROR', payload: string }
  | { type: 'ADD_TRANSACTION', payload: Transaction }
  // More actions...

// Create reducer function
const financeReducer = (state: FinanceState, action: Action): FinanceState => {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_TRANSACTIONS_SUCCESS':
      return { ...state, loading: false, transactions: action.payload };
    case 'FETCH_TRANSACTIONS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [...state.transactions, action.payload] 
      };
    default:
      return state;
  }
};

// Create context
const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Create provider
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: FinanceState = {
    transactions: [],
    accounts: [],
    loading: false,
    error: null
  };
  
  const [state, dispatch] = useReducer(financeReducer, initialState);
  
  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
```

## Global State Organization

For applications with complex state requirements, organize state into domains:

```
/src/contexts
  /auth         # Authentication state
    index.tsx
    types.ts
    reducer.ts
    actions.ts
  /theme        # Theme/UI state
    index.tsx
    types.ts
  /finance      # Finance feature state
    index.tsx
    types.ts
    reducer.ts
    actions.ts
```

## Best Practices

1. **State Colocation** - Keep state as close as possible to where it's used
2. **Custom Hooks** - Create custom hooks for accessing context state
3. **Memoization** - Use useMemo and useCallback to prevent unnecessary re-renders
4. **Reducer Pattern** - Use useReducer for complex state logic
5. **Context Composition** - Compose multiple context providers rather than creating a single global state
6. **Type Safety** - Use TypeScript to ensure type safety for state and actions
7. **Error Boundaries** - Implement error boundaries around context providers
8. **Testing** - Write tests for state management logic separately from UI
