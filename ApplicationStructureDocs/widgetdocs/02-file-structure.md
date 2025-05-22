# File Structure and Responsibilities

This document provides a detailed breakdown of each file in the widget architecture, explaining their specific responsibilities and relationships.

## Core Files

### Documentation Files

#### `README.md`
**Purpose**: Provides a comprehensive overview of the widget, its functionality, and usage
**Contents**:
- Widget description and purpose
- Installation instructions (if applicable)
- Usage examples with code snippets
- API documentation (props, methods)
- Dependencies
- Known issues or limitations
- Future enhancement plans

#### `REQUIREMENTS.md`
**Purpose**: Documents the functional and non-functional requirements of the widget
**Contents**:
- User stories
- Functional requirements
- Non-functional requirements (performance, accessibility, etc.)
- Acceptance criteria
- User flow diagrams
- API dependencies

### Entry Points

#### `index.tsx`
**Purpose**: Serves as the main entry point for the widget
**Responsibilities**:
- Re-export the main widget component as the default export
- Re-export public types, hooks, and utilities
- Should be minimal and focused on exports only
- No actual component or business logic

Example:
```tsx
export { default } from './WidgetName';
export * from './types';
export * from './actions';
// Export any public utility functions or hooks that may be used elsewhere
```

#### `WidgetName.tsx`
**Purpose**: Primary widget component that serves as the composition root
**Responsibilities**:
- Initialize the widget's context/state providers
- Compose the widget from its various components
- Handle top-level props and delegate to sub-components
- Serve as the public API surface for the widget
- No direct UI rendering beyond composition

Example:
```tsx
import React from 'react';
import { WidgetNameProvider } from './context/WidgetContext';
import MainComponent from './components/MainComponent';
import { WidgetProps } from './types';

const WidgetName: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetNameProvider>
      <MainComponent {...props} />
    </WidgetNameProvider>
  );
};

export default WidgetName;
```

### Data Management Files

#### `types.ts`
**Purpose**: Centralized type definitions for the widget
**Responsibilities**:
- Define widget props interface
- Define data model interfaces/types
- Define state management types
- Define event and callback types
- Export all types for use in other files
- No implementation code, just type definitions

Example:
```tsx
export interface WidgetProps {
  initialData?: WidgetData;
  onDataChange?: (data: WidgetData) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface WidgetData {
  id: string;
  title: string;
  // other data properties
}

export interface WidgetState {
  data: WidgetData[];
  loading: boolean;
  error: string | null;
}

export type WidgetAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WidgetData[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: WidgetData };
```

#### `actions.ts`
**Purpose**: Define actions and action creators for state management
**Responsibilities**:
- Implement action creator functions
- Define action constants (if using Redux-style actions)
- Handle side effects like API calls within actions
- Maintain pure functions that return action objects
- No UI or rendering logic

Example:
```tsx
import { WidgetAction, WidgetData } from './types';
import { fetchWidgetData, updateWidgetItem } from './api';

export const fetchData = async (dispatch: React.Dispatch<WidgetAction>) => {
  dispatch({ type: 'FETCH_START' });
  try {
    const data = await fetchWidgetData();
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error.message });
  }
};

export const updateItem = async (
  dispatch: React.Dispatch<WidgetAction>, 
  item: WidgetData
) => {
  try {
    const updatedItem = await updateWidgetItem(item);
    dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    return updatedItem;
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error.message });
    throw error;
  }
};
```

#### `api.ts`
**Purpose**: Handle all API communication
**Responsibilities**:
- Implement functions for API requests
- Handle error responses and retries
- Format request data and parse responses
- Manage authentication tokens if needed
- No UI or state management logic

Example:
```tsx
import axios from 'axios';
import { WidgetData } from './types';

const API_BASE_URL = '/api/v1';

export const fetchWidgetData = async (): Promise<WidgetData[]> => {
  const response = await axios.get(`${API_BASE_URL}/widget-data`);
  return response.data;
};

export const updateWidgetItem = async (item: WidgetData): Promise<WidgetData> => {
  const response = await axios.put(`${API_BASE_URL}/widget-data/${item.id}`, item);
  return response.data;
};

export const deleteWidgetItem = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/widget-data/${id}`);
};
```

### Utility Files

#### `utils.ts`
**Purpose**: Utility functions for the widget
**Responsibilities**:
- Implement pure utility functions
- Handle data transformations
- Provide helper functions
- No UI, state management, or API calls

Example:
```tsx
/**
 * Formats a date according to the application standard
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Sort array of objects by a specific field
 */
export const sortByField = <T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...items].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};
```

#### `pathConfig.ts`
**Purpose**: Centralize all file paths and asset references used within the widget
**Responsibilities**:
- Define constants for all internal file and component paths
- Provide a single source of truth for imports
- Make widget structure refactoring easier
- Facilitate dynamic imports and code-splitting

For detailed implementation of pathConfig.ts, see the [Path Configuration Guide](./path-config.md).

## Subdirectories and Their Contents

### Context Directory (`context/`)

#### `context/WidgetContext.tsx`
**Purpose**: Implement React Context for state management
**Responsibilities**:
- Define context with proper TypeScript types
- Create provider component with state management
- Implement reducer pattern for state updates
- Provide actions and state to children
- Export custom hook for consuming the context

Example:
```tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { WidgetState, WidgetAction } from '../types';

const initialState: WidgetState = {
  data: [],
  loading: false,
  error: null
};

const reducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_ITEM':
      return {
        ...state,
        data: state.data.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    default:
      return state;
  }
};

const WidgetContext = createContext<{
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
} | undefined>(undefined);

export const WidgetProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <WidgetContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error('useWidgetContext must be used within a WidgetProvider');
  }
  return context;
};
```

### Hooks Directory (`hooks/`)

#### `hooks/useWidgetState.ts`
**Purpose**: Custom hook for managing widget state
**Responsibilities**:
- Encapsulate complex state management logic
- Provide simplified API for components
- Handle side effects (data fetching, etc.)
- Connect to context and expose only what's needed
- Abstract implementation details from components

Example:
```tsx
import { useEffect } from 'react';
import { useWidgetContext } from '../context/WidgetContext';
import { fetchData, updateItem } from '../actions';
import { WidgetData } from '../types';

export const useWidgetState = () => {
  const { state, dispatch } = useWidgetContext();
  
  useEffect(() => {
    // Load initial data when the hook is first used
    fetchData(dispatch);
  }, [dispatch]);
  
  const updateWidgetItem = async (item: WidgetData) => {
    return await updateItem(dispatch, item);
  };
  
  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    updateWidgetItem
  };
};
```

### Components Directory (`components/`)

#### Component Organization

Components should be organized as follows:

1. **Flat Structure for Simple Widgets**
   - Place all component files directly in the components directory
   - Use clear, descriptive names that reflect component purpose

2. **Nested Structure for Complex Widgets**
   - Group related components in subdirectories
   - Use index.ts files for clean exports

3. **Component-Specific Types**
   - Place in a types.ts file within the component directory
   - Only export types needed by other components

#### Modal Components

For complex modal components, use a dedicated directory structure:

```
/components/modals/
├── DetailModal/
│   ├── index.tsx
│   ├── DetailModal.tsx
│   ├── DetailModal.module.css
│   └── sections/
│       ├── HeaderSection.tsx
│       ├── ContentSection.tsx
│       └── FooterSection.tsx
```

## File Relationships and Dependencies

Understanding the relationships between files is crucial for maintaining a clean architecture:

### Dependency Flow

1. **Outward-In Dependencies**
   - `index.tsx` → `WidgetName.tsx` → contexts → components
   - This ensures that inner components can be changed without affecting outer components

2. **Data Flow**
   - Data typically flows: API → actions → context → hooks → components
   - This creates a clean, unidirectional data flow

3. **Import Rules**
   - Components should only import from their own directory or "upward"
   - No circular dependencies
   - Use pathConfig.ts for import paths

## Conclusion

Following this file structure and respecting the responsibilities of each file creates a maintainable, scalable widget architecture. Each file has a clear purpose, which makes the codebase easier to understand and modify.

For more specific guidance on themes and styling, see the [Theming and Styling](./03-theming-styling.md) guide.
