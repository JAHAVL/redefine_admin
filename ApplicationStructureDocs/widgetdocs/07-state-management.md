# State Management

This guide outlines the recommended approaches for state management within widgets, focusing on patterns that maintain clean architecture and separation of concerns.

## Core Principles

Widget state management should follow these core principles:

1. **Appropriate Scope**
   - Keep state at the lowest level possible
   - Lift state up only when needed for sharing
   - Avoid global state for widget-specific concerns

2. **Clear Ownership**
   - Each piece of state should have a single owner
   - State mutations come from one place
   - Props flow down, events flow up

3. **Predictable Updates**
   - State updates should be explicit and traceable
   - Use immutable update patterns
   - Implement unidirectional data flow

4. **Performance Consideration**
   - Minimize unnecessary re-renders
   - Use memoization techniques
   - Split state to avoid monolithic updates

## State Management Options

Widgets should use a combination of these state management approaches:

### 1. Local Component State

For component-specific state that doesn't need to be shared:

```tsx
// Simple component with local state
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};
```

### 2. React Context for Widget-Wide State

For state that needs to be shared across multiple components:

```tsx
// context/WidgetContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define state and action types
interface WidgetState {
  data: Item[];
  loading: boolean;
  error: string | null;
  selectedItemId: string | null;
}

type WidgetAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: string }
  | { type: 'DESELECT_ITEM' }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string };

// Create initial state
const initialState: WidgetState = {
  data: [],
  loading: false,
  error: null,
  selectedItemId: null
};

// Create context
const WidgetContext = createContext<{
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
} | undefined>(undefined);

// Create reducer
function widgetReducer(state: WidgetState, action: WidgetAction): WidgetState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedItemId: action.payload
      };
    case 'DESELECT_ITEM':
      return {
        ...state,
        selectedItemId: null
      };
    case 'ADD_ITEM':
      return {
        ...state,
        data: [...state.data, action.payload]
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        data: state.data.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload),
        selectedItemId: state.selectedItemId === action.payload 
          ? null 
          : state.selectedItemId
      };
    default:
      return state;
  }
}

// Create provider component
export const WidgetProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(widgetReducer, initialState);
  
  return (
    <WidgetContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetContext.Provider>
  );
};

// Create hook for consuming context
export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  
  if (context === undefined) {
    throw new Error('useWidgetContext must be used within a WidgetProvider');
  }
  
  return context;
};
```

### 3. Action Creators for Complex State Updates

Separate action creators to encapsulate complex state update logic:

```tsx
// actions.ts
import { WidgetAction } from '../types';
import { apiService } from '../api';

// Simple action creators
export const selectItem = (id: string): WidgetAction => ({
  type: 'SELECT_ITEM',
  payload: id
});

export const deselectItem = (): WidgetAction => ({
  type: 'DESELECT_ITEM'
});

// Async action creators (Thunk pattern)
export const fetchItems = async (dispatch: React.Dispatch<WidgetAction>) => {
  dispatch({ type: 'FETCH_START' });
  
  try {
    const items = await apiService.getItems();
    dispatch({ type: 'FETCH_SUCCESS', payload: items });
  } catch (error) {
    dispatch({ 
      type: 'FETCH_ERROR', 
      payload: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const addItem = async (
  dispatch: React.Dispatch<WidgetAction>,
  item: Omit<Item, 'id'>
) => {
  try {
    const newItem = await apiService.createItem(item);
    dispatch({ type: 'ADD_ITEM', payload: newItem });
    return newItem;
  } catch (error) {
    dispatch({ 
      type: 'FETCH_ERROR', 
      payload: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

export const updateItem = async (
  dispatch: React.Dispatch<WidgetAction>,
  item: Item
) => {
  try {
    const updatedItem = await apiService.updateItem(item);
    dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    return updatedItem;
  } catch (error) {
    dispatch({ 
      type: 'FETCH_ERROR', 
      payload: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

export const removeItem = async (
  dispatch: React.Dispatch<WidgetAction>,
  id: string
) => {
  try {
    await apiService.deleteItem(id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  } catch (error) {
    dispatch({ 
      type: 'FETCH_ERROR', 
      payload: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};
```

### 4. Custom Hooks for Feature-Specific State

Create custom hooks to encapsulate related state and logic:

```tsx
// hooks/useItemSelection.ts
import { useState, useCallback } from 'react';
import { Item } from '../types';

export function useItemSelection<T extends { id: string }>(
  items: T[], 
  onSelectionChange?: (selectedItems: T[]) => void
) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const selectedItems = items.filter(item => selectedIds.has(item.id));
  
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prevSelectedIds => {
      const newSelectedIds = new Set(prevSelectedIds);
      
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      
      // Call the callback if provided
      const newSelectedItems = items.filter(item => newSelectedIds.has(item.id));
      onSelectionChange?.(newSelectedItems);
      
      return newSelectedIds;
    });
  }, [items, onSelectionChange]);
  
  const selectAll = useCallback(() => {
    const allIds = new Set(items.map(item => item.id));
    setSelectedIds(allIds);
    onSelectionChange?.(items);
  }, [items, onSelectionChange]);
  
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);
  
  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );
  
  return {
    selectedItems,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected
  };
}
```

## Implementing Widget State Management

### Provider Pattern

Wrap your widget with the context provider:

```tsx
// WidgetName.tsx
import React from 'react';
import { WidgetProvider } from './context/WidgetContext';
import WidgetContent from './components/WidgetContent';
import { WidgetProps } from './types';

const WidgetName: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetProvider>
      <WidgetContent {...props} />
    </WidgetProvider>
  );
};

export default WidgetName;
```

### Using Context in Components

```tsx
// components/ItemList.tsx
import React, { useEffect } from 'react';
import { useWidgetContext } from '../context/WidgetContext';
import { fetchItems, selectItem } from '../actions';
import ItemCard from './ItemCard';

const ItemList: React.FC = () => {
  const { state, dispatch } = useWidgetContext();
  const { data, loading, error, selectedItemId } = state;
  
  useEffect(() => {
    fetchItems(dispatch);
  }, [dispatch]);
  
  const handleItemClick = (id: string) => {
    dispatch(selectItem(id));
  };
  
  if (loading) return <div>Loading...</div>;
  
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="item-list">
      {data.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          isSelected={item.id === selectedItemId}
          onClick={() => handleItemClick(item.id)}
        />
      ))}
    </div>
  );
};

export default ItemList;
```

### Custom Hook Integration

```tsx
// components/ItemSelectionList.tsx
import React from 'react';
import { useItemSelection } from '../hooks/useItemSelection';
import { Item } from '../types';

interface ItemSelectionListProps {
  items: Item[];
  onSelectionChange?: (selectedItems: Item[]) => void;
}

const ItemSelectionList: React.FC<ItemSelectionListProps> = ({
  items,
  onSelectionChange
}) => {
  const {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected
  } = useItemSelection(items, onSelectionChange);
  
  return (
    <div>
      <div className="controls">
        <button onClick={selectAll}>Select All</button>
        <button onClick={clearSelection}>Clear Selection</button>
        <span>{selectedItems.length} items selected</span>
      </div>
      
      <ul className="item-list">
        {items.map(item => (
          <li 
            key={item.id}
            className={isSelected(item.id) ? 'selected' : ''}
            onClick={() => toggleSelection(item.id)}
          >
            <input
              type="checkbox"
              checked={isSelected(item.id)}
              onChange={() => {}} // Handled by the onClick on the li
              onClick={e => e.stopPropagation()}
            />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemSelectionList;
```

## Advanced State Management Patterns

### Combining Context and Local State

Determine what belongs in context vs. local state:

| Context State | Local State |
|---------------|-------------|
| Shared data across components | UI state (open/closed) |
| Application domain data | Form input values before submission |
| User preferences | Animation states |
| Authentication state | Hover/focus states |
| Global settings | Temporary visual feedback |

### State Splitting for Performance

Split context to prevent unnecessary re-renders:

```tsx
// context/WidgetDataContext.tsx and context/WidgetUIContext.tsx

// Data context for less frequent updates
export const WidgetDataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialDataState);
  
  return (
    <WidgetDataContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetDataContext.Provider>
  );
};

// UI context for frequent updates
export const WidgetUIProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);
  
  return (
    <WidgetUIContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetUIContext.Provider>
  );
};

// Usage in widget
const WidgetName: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetDataProvider>
      <WidgetUIProvider>
        <WidgetContent {...props} />
      </WidgetUIProvider>
    </WidgetDataProvider>
  );
};
```

### State Derivation

Derive secondary state rather than storing it:

```tsx
// Bad: storing derived state
const ItemStats: React.FC<{items: Item[]}> = ({ items }) => {
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  
  useEffect(() => {
    setTotalCount(items.length);
    setCompletedCount(items.filter(item => item.completed).length);
    setIncompleteCount(items.filter(item => !item.completed).length);
  }, [items]);
  
  return (
    <div>
      <p>Total: {totalCount}</p>
      <p>Completed: {completedCount}</p>
      <p>Incomplete: {incompleteCount}</p>
    </div>
  );
};

// Good: deriving state on render
const ItemStats: React.FC<{items: Item[]}> = ({ items }) => {
  const totalCount = items.length;
  const completedCount = items.filter(item => item.completed).length;
  const incompleteCount = totalCount - completedCount;
  
  return (
    <div>
      <p>Total: {totalCount}</p>
      <p>Completed: {completedCount}</p>
      <p>Incomplete: {incompleteCount}</p>
    </div>
  );
};
```

### Memoized Selectors

Use memoization for expensive computations:

```tsx
// hooks/useWidgetSelectors.ts
import { useMemo } from 'react';
import { useWidgetContext } from '../context/WidgetContext';

export const useWidgetSelectors = () => {
  const { state } = useWidgetContext();
  
  const completedItems = useMemo(() => {
    return state.data.filter(item => item.completed);
  }, [state.data]);
  
  const incompleteItems = useMemo(() => {
    return state.data.filter(item => !item.completed);
  }, [state.data]);
  
  const itemsByCategory = useMemo(() => {
    return state.data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof state.data>);
  }, [state.data]);
  
  const selectedItem = useMemo(() => {
    if (!state.selectedItemId) return null;
    return state.data.find(item => item.id === state.selectedItemId) || null;
  }, [state.data, state.selectedItemId]);
  
  return {
    completedItems,
    incompleteItems,
    itemsByCategory,
    selectedItem,
    isLoading: state.loading,
    error: state.error
  };
};
```

### State Persistence

Persist widget state across sessions:

```tsx
// hooks/usePersistedReducer.ts
import { useReducer, useEffect } from 'react';

export function usePersistedReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  storageKey: string
): [S, React.Dispatch<A>] {
  // Get initial state from localStorage or use provided initialState
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error('Error loading persisted state:', error);
      return initialState;
    }
  });
  
  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [state, storageKey]);
  
  return [state, dispatch];
}

// Usage in context
export const WidgetProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = usePersistedReducer(
    widgetReducer, 
    initialState,
    'widget-state'
  );
  
  return (
    <WidgetContext.Provider value={{ state, dispatch }}>
      {children}
    </WidgetContext.Provider>
  );
};
```

## Testing State Management

### Testing Reducers

Test pure reducer functions directly:

```tsx
// reducer.test.ts
import { widgetReducer } from '../context/WidgetContext';
import { initialState } from '../context/WidgetContext';

describe('widgetReducer', () => {
  it('should return the initial state', () => {
    expect(widgetReducer(undefined, {} as any)).toEqual(initialState);
  });
  
  it('should handle FETCH_START', () => {
    const action = { type: 'FETCH_START' as const };
    const nextState = widgetReducer(initialState, action);
    
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });
  
  it('should handle FETCH_SUCCESS', () => {
    const items = [{ id: '1', name: 'Test Item' }];
    const action = { 
      type: 'FETCH_SUCCESS' as const, 
      payload: items 
    };
    
    const nextState = widgetReducer(
      { ...initialState, loading: true }, 
      action
    );
    
    expect(nextState.loading).toBe(false);
    expect(nextState.data).toEqual(items);
  });
  
  // Additional reducer tests...
});
```

### Testing Context with React Testing Library

```tsx
// WidgetContext.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WidgetProvider, useWidgetContext } from '../context/WidgetContext';

// Test component that uses the context
const TestComponent = () => {
  const { state, dispatch } = useWidgetContext();
  
  return (
    <div>
      <div data-testid="loading">{state.loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="item-count">{state.data.length}</div>
      <button 
        onClick={() => dispatch({ type: 'FETCH_START' })}
        data-testid="fetch-button"
      >
        Fetch
      </button>
    </div>
  );
};

describe('WidgetContext', () => {
  it('provides the initial state', () => {
    render(
      <WidgetProvider>
        <TestComponent />
      </WidgetProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
  });
  
  it('updates state when actions are dispatched', () => {
    render(
      <WidgetProvider>
        <TestComponent />
      </WidgetProvider>
    );
    
    fireEvent.click(screen.getByTestId('fetch-button'));
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
  });
});
```

### Testing Custom Hooks

```tsx
// useItemSelection.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useItemSelection } from '../hooks/useItemSelection';

describe('useItemSelection', () => {
  const testItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ];
  
  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useItemSelection(testItems));
    
    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.selectedIds.size).toBe(0);
  });
  
  it('should toggle item selection', () => {
    const { result } = renderHook(() => useItemSelection(testItems));
    
    act(() => {
      result.current.toggleSelection('1');
    });
    
    expect(result.current.selectedItems).toEqual([testItems[0]]);
    expect(result.current.isSelected('1')).toBe(true);
    
    act(() => {
      result.current.toggleSelection('1');
    });
    
    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.isSelected('1')).toBe(false);
  });
  
  it('should select all items', () => {
    const { result } = renderHook(() => useItemSelection(testItems));
    
    act(() => {
      result.current.selectAll();
    });
    
    expect(result.current.selectedItems).toEqual(testItems);
    expect(result.current.selectedIds.size).toBe(3);
  });
  
  it('should clear selection', () => {
    const { result } = renderHook(() => useItemSelection(testItems));
    
    act(() => {
      result.current.selectAll();
    });
    
    expect(result.current.selectedItems.length).toBe(3);
    
    act(() => {
      result.current.clearSelection();
    });
    
    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.selectedIds.size).toBe(0);
  });
  
  it('should call onSelectionChange when selection changes', () => {
    const handleSelectionChange = jest.fn();
    
    const { result } = renderHook(() => 
      useItemSelection(testItems, handleSelectionChange)
    );
    
    act(() => {
      result.current.toggleSelection('1');
    });
    
    expect(handleSelectionChange).toHaveBeenCalledWith([testItems[0]]);
    
    act(() => {
      result.current.selectAll();
    });
    
    expect(handleSelectionChange).toHaveBeenCalledWith(testItems);
  });
});
```

## Handling Form State

Forms require special consideration for state management:

### Controlled Components

```tsx
// components/ItemForm.tsx
import React, { useState } from 'react';
import { useWidgetContext } from '../context/WidgetContext';
import { addItem } from '../actions';

const ItemForm: React.FC = () => {
  const { dispatch } = useWidgetContext();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await addItem(dispatch, formState);
      
      // Reset form
      setFormState({
        name: '',
        description: '',
        category: 'general'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formState.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          value={formState.description}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formState.category}
          onChange={handleChange}
        >
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
};

export default ItemForm;
```

### Form Libraries

For complex forms, consider using Formik or React Hook Form:

```tsx
// Using React Hook Form
import { useForm } from 'react-hook-form';
import { useWidgetContext } from '../context/WidgetContext';
import { addItem } from '../actions';

const ItemForm: React.FC = () => {
  const { dispatch } = useWidgetContext();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await addItem(dispatch, data);
      reset(); // Reset form after successful submission
    } catch (error) {
      // Error is handled by React Hook Form
      return Promise.reject(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          {...register('description')}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          {...register('category')}
        >
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
};
```

## Best Practices

1. **Start Small**
   - Begin with local state
   - Move to context only when needed
   - Avoid premature abstraction

2. **Optimize for Change**
   - Group related state together
   - Design interfaces with future requirements in mind
   - Keep reducers extensible

3. **Isolate Side Effects**
   - Keep reducers pure
   - Handle side effects in action creators or custom hooks
   - Use consistent patterns for async operations

4. **Document State Structure**
   - Add comments explaining state shape and purpose
   - Document reducer actions
   - Include examples of state transitions

5. **Plan for Error Handling**
   - Include error state in all async operations
   - Provide user-friendly error messages
   - Recover gracefully from failures

## Conclusion

By following these state management patterns, widgets can maintain a clean architecture with clear separation of concerns. The combination of local state, React Context, and custom hooks provides a flexible, performant approach that scales with widget complexity.

For more information on data fetching and API integration, see the [Data and API Integration](./08-data-api.md) guide.
