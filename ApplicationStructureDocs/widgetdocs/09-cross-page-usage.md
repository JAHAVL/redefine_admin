# Cross-Page Widget Usage

This guide covers strategies for implementing widgets that can be used across multiple pages in the SoSocial CRM application, ensuring consistency, maintainability, and performance.

## Core Principles

When creating widgets for cross-page usage, follow these principles:

1. **Configuration Flexibility**
   - Make widgets configurable for different contexts
   - Allow page-specific overrides of default behavior
   - Support dynamic feature enabling/disabling

2. **State Persistence**
   - Define clear strategies for state sharing
   - Avoid unexpected state resets during navigation
   - Use appropriate storage mechanisms for shared state

3. **Performance Optimization**
   - Minimize render overhead for shared widgets
   - Implement proper memoization
   - Consider code-splitting for large widgets

4. **Consistent User Experience**
   - Maintain visual coherence across pages
   - Provide contextual actions based on page
   - Support smooth transitions between states

## Widget Configuration

Create a configuration system that allows pages to customize widget behavior:

```tsx
// types/widget.ts
export interface WidgetConfig {
  id: string;
  title?: string;
  icon?: string;
  permissions?: string[];
  features?: Record<string, boolean>;
  appearance?: {
    showHeader?: boolean;
    showFooter?: boolean;
    maxHeight?: string;
    variant?: 'default' | 'compact' | 'expanded';
  };
  callbacks?: Record<string, (...args: any[]) => void>;
  pageSpecific?: Record<string, any>;
}

// Partial configuration for updates
export type WidgetConfigUpdate = Partial<WidgetConfig>;
```

Create a configuration provider that pages can use to configure widgets:

```tsx
// context/WidgetConfigContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WidgetConfig, WidgetConfigUpdate } from '../types/widget';

// Context for widget configuration
const WidgetConfigContext = createContext<{
  configs: Record<string, WidgetConfig>;
  updateConfig: (widgetId: string, config: WidgetConfigUpdate) => void;
  getConfig: (widgetId: string) => WidgetConfig | undefined;
}>({
  configs: {},
  updateConfig: () => {},
  getConfig: () => undefined
});

// Provider component
export const WidgetConfigProvider: React.FC<{
  children: ReactNode;
  initialConfigs?: Record<string, WidgetConfig>;
}> = ({ children, initialConfigs = {} }) => {
  const [configs, setConfigs] = useState<Record<string, WidgetConfig>>(initialConfigs);
  
  const updateConfig = (widgetId: string, configUpdate: WidgetConfigUpdate) => {
    setConfigs(prev => {
      const currentConfig = prev[widgetId] || { id: widgetId };
      return {
        ...prev,
        [widgetId]: {
          ...currentConfig,
          ...configUpdate,
          // Deep merge for nested objects
          appearance: {
            ...(currentConfig.appearance || {}),
            ...(configUpdate.appearance || {})
          },
          features: {
            ...(currentConfig.features || {}),
            ...(configUpdate.features || {})
          },
          callbacks: {
            ...(currentConfig.callbacks || {}),
            ...(configUpdate.callbacks || {})
          }
        }
      };
    });
  };
  
  const getConfig = (widgetId: string) => configs[widgetId];
  
  return (
    <WidgetConfigContext.Provider value={{ configs, updateConfig, getConfig }}>
      {children}
    </WidgetConfigContext.Provider>
  );
};

// Hook for accessing widget configuration
export const useWidgetConfig = (widgetId: string) => {
  const { getConfig, updateConfig } = useContext(WidgetConfigContext);
  const config = getConfig(widgetId);
  
  return {
    config,
    updateConfig: (update: WidgetConfigUpdate) => updateConfig(widgetId, update)
  };
};
```

## Page-Specific Wrappers

Create page-specific wrappers around shared widgets:

```tsx
// widgets/TaskBoard/index.tsx
// Base shared widget component
const TaskBoard: React.FC<TaskBoardProps> = (props) => {
  const { config } = useWidgetConfig('taskBoard');
  
  // Apply configuration
  const effectiveProps = {
    ...props,
    showHeader: config?.appearance?.showHeader ?? props.showHeader,
    maxHeight: config?.appearance?.maxHeight ?? props.maxHeight,
    // Other property adaptations
  };
  
  return <TaskBoardContent {...effectiveProps} />;
};

// pages/ClientsPage/widgets/ClientTaskBoard.tsx
// Page-specific wrapper
const ClientTaskBoard: React.FC<{ clientId: string }> = ({ clientId }) => {
  const { updateConfig } = useWidgetConfig('taskBoard');
  
  // Set up page-specific configuration
  useEffect(() => {
    updateConfig({
      title: 'Client Tasks',
      appearance: {
        showHeader: true,
        maxHeight: '500px'
      },
      callbacks: {
        onTaskCreate: (task) => {
          // Client-specific task creation handling
          task.clientId = clientId;
          return task;
        }
      },
      pageSpecific: {
        filterByClient: true,
        clientId
      }
    });
  }, [updateConfig, clientId]);
  
  return <TaskBoard />;
};

// pages/DashboardPage/widgets/DashboardTaskBoard.tsx
// Another page-specific wrapper
const DashboardTaskBoard: React.FC = () => {
  const { updateConfig } = useWidgetConfig('taskBoard');
  
  // Set up dashboard-specific configuration
  useEffect(() => {
    updateConfig({
      title: 'My Tasks',
      appearance: {
        showHeader: true,
        maxHeight: '300px',
        variant: 'compact'
      },
      features: {
        showCompletedTasks: false,
        enableBulkActions: false
      },
      pageSpecific: {
        filterByCurrentUser: true,
        showPriority: true
      }
    });
  }, [updateConfig]);
  
  return <TaskBoard />;
};
```

## State Persistence Strategies

Implement different state persistence strategies based on widget needs:

### 1. URL Parameters

For state that should be part of navigation:

```tsx
// hooks/useUrlState.ts
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export function useUrlState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
) {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Get value from URL or default
  const getValue = useCallback(() => {
    const paramValue = searchParams.get(key);
    if (paramValue === null) return defaultValue;
    try {
      return deserialize(paramValue);
    } catch (error) {
      console.error(`Error deserializing URL param ${key}:`, error);
      return defaultValue;
    }
  }, [searchParams, key, defaultValue, deserialize]);
  
  // Set value in URL
  const setValue = useCallback((value: T) => {
    const newSearchParams = new URLSearchParams(location.search);
    try {
      const serialized = serialize(value);
      newSearchParams.set(key, serialized);
      history.push({
        pathname: location.pathname,
        search: newSearchParams.toString()
      });
    } catch (error) {
      console.error(`Error serializing value for URL param ${key}:`, error);
    }
  }, [history, location, key, serialize]);
  
  return [getValue(), setValue] as const;
}
```

### 2. Session Storage

For ephemeral state that should persist only for the current session:

```tsx
// hooks/useSessionState.ts
import { useState, useEffect } from 'react';

export function useSessionState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Get initial state from sessionStorage or default
  const [state, setState] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });
  
  // Update sessionStorage when state changes
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to sessionStorage key "${key}":`, error);
    }
  }, [key, state]);
  
  return [state, setState];
}
```

### 3. Global State Management

For state that needs to be shared across the entire application:

```tsx
// state/sharedWidgetState.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetState {
  expandedWidgets: Set<string>;
  widgetData: Record<string, any>;
  expandWidget: (widgetId: string) => void;
  collapseWidget: (widgetId: string) => void;
  toggleWidget: (widgetId: string) => void;
  setWidgetData: (widgetId: string, data: any) => void;
  clearWidgetData: (widgetId: string) => void;
}

// Create global store with persistence
export const useWidgetStore = create<WidgetState>(
  persist(
    (set) => ({
      expandedWidgets: new Set<string>(),
      widgetData: {},
      
      expandWidget: (widgetId) => set((state) => ({
        expandedWidgets: new Set([...state.expandedWidgets, widgetId])
      })),
      
      collapseWidget: (widgetId) => set((state) => {
        const newSet = new Set(state.expandedWidgets);
        newSet.delete(widgetId);
        return { expandedWidgets: newSet };
      }),
      
      toggleWidget: (widgetId) => set((state) => {
        const newSet = new Set(state.expandedWidgets);
        if (newSet.has(widgetId)) {
          newSet.delete(widgetId);
        } else {
          newSet.add(widgetId);
        }
        return { expandedWidgets: newSet };
      }),
      
      setWidgetData: (widgetId, data) => set((state) => ({
        widgetData: {
          ...state.widgetData,
          [widgetId]: data
        }
      })),
      
      clearWidgetData: (widgetId) => set((state) => {
        const newData = { ...state.widgetData };
        delete newData[widgetId];
        return { widgetData: newData };
      })
    }),
    {
      name: 'widget-store',
      getStorage: () => localStorage,
      serialize: (state) => {
        // Handle Set serialization
        return JSON.stringify({
          ...state,
          expandedWidgets: Array.from(state.expandedWidgets)
        });
      },
      deserialize: (str) => {
        const state = JSON.parse(str);
        return {
          ...state,
          expandedWidgets: new Set(state.expandedWidgets)
        };
      }
    }
  )
);
```

## Widget Discovery and Registry

Create a widget registry that allows discovering and dynamically loading widgets:

```tsx
// registry/widgetRegistry.ts
import React, { lazy, Suspense } from 'react';
import { WidgetDefinition, WidgetConfig } from '../types/widget';

// Map of registered widgets
export const widgetRegistry: Record<string, WidgetDefinition> = {
  taskBoard: {
    id: 'taskBoard',
    name: 'Task Board',
    description: 'View and manage tasks',
    icon: 'task-list',
    permissions: ['tasks.view'],
    component: lazy(() => import('../widgets/TaskBoard')),
    defaultConfig: {
      id: 'taskBoard',
      appearance: {
        showHeader: true,
        showFooter: true
      },
      features: {
        enableDragDrop: true,
        showCompletedTasks: true
      }
    }
  },
  // Other widgets...
};

// Component to render a widget by ID
export const DynamicWidget: React.FC<{
  widgetId: string;
  config?: Partial<WidgetConfig>;
}> = ({ widgetId, config }) => {
  const widget = widgetRegistry[widgetId];
  
  if (!widget) {
    return <div>Widget not found: {widgetId}</div>;
  }
  
  // Merge default config with provided config
  const mergedConfig = {
    ...widget.defaultConfig,
    ...config
  };
  
  return (
    <Suspense fallback={<div>Loading widget...</div>}>
      <widget.component {...mergedConfig} />
    </Suspense>
  );
};

// Widget registration function
export function registerWidget(definition: WidgetDefinition) {
  widgetRegistry[definition.id] = definition;
}
```

## Page-Specific Data Loading

Load only the data needed for the current page context:

```tsx
// widgets/TaskBoard/TaskBoardContent.tsx
const TaskBoardContent: React.FC<TaskBoardContentProps> = (props) => {
  const { config } = useWidgetConfig('taskBoard');
  const pageContext = config?.pageSpecific || {};
  
  // Determine what data to load based on page context
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      limit: props.limit || 20
    };
    
    if (pageContext.filterByClient) {
      params.clientId = pageContext.clientId;
    }
    
    if (pageContext.filterByCurrentUser) {
      params.assignedToCurrentUser = true;
    }
    
    if (pageContext.taskType) {
      params.type = pageContext.taskType;
    }
    
    return params;
  }, [props.limit, pageContext]);
  
  // Load data with page-specific parameters
  const { data, isLoading, error } = useTasks(queryParams);
  
  // Render content
  // ...
};
```

## Widget Communication

Implement communication between widgets on the same page:

```tsx
// hooks/useWidgetCommunication.ts
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Event bus for widget communication
const eventBus = {
  listeners: {} as Record<string, Record<string, (data: any) => void>>,
  
  emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    
    Object.values(this.listeners[event]).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in widget event listener for ${event}:`, error);
      }
    });
  },
  
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = {};
    }
    
    const id = uuidv4();
    this.listeners[event][id] = callback;
    
    return () => {
      if (this.listeners[event]) {
        delete this.listeners[event][id];
      }
    };
  }
};

// Hook for widget communication
export function useWidgetCommunication() {
  const emit = useCallback((event: string, data: any) => {
    eventBus.emit(event, data);
  }, []);
  
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    return eventBus.on(event, callback);
  }, []);
  
  return { emit, subscribe };
}
```

Example usage in widgets:

```tsx
// In TaskCreatorWidget
const TaskCreatorWidget: React.FC = () => {
  const { emit } = useWidgetCommunication();
  
  const handleTaskCreated = (task: Task) => {
    // Notify other widgets
    emit('task:created', task);
  };
  
  // Render content
  // ...
};

// In TaskBoardWidget
const TaskBoardWidget: React.FC = () => {
  const { subscribe } = useWidgetCommunication();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Subscribe to task creation events
    const unsubscribe = subscribe('task:created', (newTask: Task) => {
      setTasks(prevTasks => [...prevTasks, newTask]);
    });
    
    return unsubscribe;
  }, [subscribe]);
  
  // Render content
  // ...
};
```

## Performance Optimizations

Optimize cross-page widgets for performance:

### 1. Component Memoization

```tsx
// Example of memoizing a widget component
const TaskCard = React.memo(
  ({ task, onStatusChange }: TaskCardProps) => {
    // Component implementation
    return (
      <div className="task-card">
        <h3>{task.title}</h3>
        <StatusDropdown 
          value={task.status}
          onChange={(status) => onStatusChange(task.id, status)}
        />
      </div>
    );
  },
  // Custom comparison function for props
  (prevProps, nextProps) => {
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.title === nextProps.task.title &&
      prevProps.task.status === nextProps.task.status
    );
  }
);
```

### 2. Data Caching

```tsx
// Using React Query for efficient cross-page data caching
export const useUserTasks = (userId: string | undefined) => {
  return useQuery(
    ['tasks', { userId }],
    () => api.tasks.getByUserId(userId!),
    {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Don't fetch if no userId is provided
      enabled: !!userId,
      // Keep data in cache for 10 minutes after unmounting
      cacheTime: 10 * 60 * 1000
    }
  );
};
```

### 3. Virtualization for Large Lists

```tsx
// Using react-window for efficient rendering of large lists
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const renderRow = useCallback(
    ({ index, style }) => (
      <div style={style}>
        <TaskCard task={tasks[index]} />
      </div>
    ),
    [tasks]
  );
  
  return (
    <div className="task-list-container" style={{ height: '500px' }}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={tasks.length}
            itemSize={80}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
```

## Testing Cross-Page Widgets

Test widgets in different page contexts:

```tsx
// TaskBoard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { WidgetConfigProvider } from '../context/WidgetConfigContext';
import TaskBoard from './TaskBoard';

describe('TaskBoard Widget', () => {
  it('renders with dashboard-specific configuration', () => {
    // Set up with dashboard context
    const initialConfigs = {
      taskBoard: {
        id: 'taskBoard',
        title: 'My Tasks',
        appearance: {
          variant: 'compact',
          maxHeight: '300px'
        },
        pageSpecific: {
          filterByCurrentUser: true
        }
      }
    };
    
    render(
      <WidgetConfigProvider initialConfigs={initialConfigs}>
        <TaskBoard />
      </WidgetConfigProvider>
    );
    
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    // Other dashboard-specific assertions
  });
  
  it('renders with client-specific configuration', () => {
    // Set up with client page context
    const initialConfigs = {
      taskBoard: {
        id: 'taskBoard',
        title: 'Client Tasks',
        appearance: {
          variant: 'default',
          maxHeight: '500px'
        },
        pageSpecific: {
          filterByClient: true,
          clientId: 'client-123'
        }
      }
    };
    
    render(
      <WidgetConfigProvider initialConfigs={initialConfigs}>
        <TaskBoard />
      </WidgetConfigProvider>
    );
    
    expect(screen.getByText('Client Tasks')).toBeInTheDocument();
    // Other client-specific assertions
  });
});
```

## Best Practices

1. **Widget Configuration**
   - Define clear configuration interfaces
   - Set sensible defaults
   - Document all configurable options

2. **State Management**
   - Choose the appropriate persistence mechanism
   - Avoid unexpected state resets
   - Clear persistent state when appropriate

3. **Performance**
   - Implement proper memoization
   - Use virtualization for large lists
   - Consider code splitting for large widgets

4. **Code Organization**
   - Create page-specific wrappers
   - Use a consistent naming convention
   - Keep shared business logic separate from UI

5. **Testing**
   - Test widgets in different contexts
   - Verify configuration works as expected
   - Mock page-specific dependencies

## Conclusion

Creating widgets that work seamlessly across multiple pages requires careful attention to configuration, state management, and performance optimization. By following these patterns, your widgets will provide consistent user experiences while respecting the specific needs of each page context.

For information on testing widgets, see the [Testing Strategy](./10-testing.md) guide.
