# Performance Optimization

This guide covers strategies and best practices for optimizing widget performance in the SoSocial CRM application.

## Core Principles

When optimizing widget performance, follow these principles:

1. **Minimize Rendering**
   - Avoid unnecessary re-renders
   - Optimize component structure
   - Use memoization effectively

2. **Optimize Data Flow**
   - Fetch only what you need
   - Implement efficient caching
   - Use pagination and virtualization

3. **Asset Optimization**
   - Optimize images and media
   - Use code splitting
   - Minimize bundle size

4. **Measure Performance**
   - Establish performance metrics
   - Test under realistic conditions
   - Monitor in production

## Render Optimization

### Component Memoization

Use React.memo for pure functional components:

```tsx
// Bad: Unmemoized component re-renders unnecessarily
const TaskItem = (props: TaskItemProps) => {
  return (
    <div className="task-item">
      <h3>{props.task.title}</h3>
      <p>{props.task.description}</p>
    </div>
  );
};

// Good: Memoized component only re-renders when props change
const TaskItem = React.memo((props: TaskItemProps) => {
  return (
    <div className="task-item">
      <h3>{props.task.title}</h3>
      <p>{props.task.description}</p>
    </div>
  );
});

// Better: Custom comparison function for complex props
const TaskItem = React.memo(
  (props: TaskItemProps) => {
    return (
      <div className="task-item">
        <h3>{props.task.title}</h3>
        <p>{props.task.description}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.title === nextProps.task.title &&
      prevProps.task.description === nextProps.task.description
    );
  }
);
```

### Memoizing Expensive Calculations

Use useMemo to avoid recalculating values:

```tsx
// Bad: Recalculates on every render
const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  
  return (
    <div>
      <h2>Pending Tasks: {pendingTasks.length}</h2>
      <h2>Completed Tasks: {completedTasks.length}</h2>
      {/* Render task lists */}
    </div>
  );
};

// Good: Memoizes filtered arrays
const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const completedTasks = useMemo(
    () => tasks.filter(task => task.status === 'completed'),
    [tasks]
  );
  
  const pendingTasks = useMemo(
    () => tasks.filter(task => task.status !== 'completed'),
    [tasks]
  );
  
  return (
    <div>
      <h2>Pending Tasks: {pendingTasks.length}</h2>
      <h2>Completed Tasks: {completedTasks.length}</h2>
      {/* Render task lists */}
    </div>
  );
};
```

### Optimizing Event Handlers

Use useCallback to prevent handler recreation:

```tsx
// Bad: Creates new function on every render
const TaskItem: React.FC<{ task: Task; onStatusChange: (id: string, status: string) => void }> = ({ 
  task, 
  onStatusChange 
}) => {
  const handleStatusChange = (status: string) => {
    onStatusChange(task.id, status);
  };
  
  return (
    <div>
      <h3>{task.title}</h3>
      <select 
        value={task.status} 
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};

// Good: Memoizes callback
const TaskItem: React.FC<{ task: Task; onStatusChange: (id: string, status: string) => void }> = ({ 
  task, 
  onStatusChange 
}) => {
  const handleStatusChange = useCallback(
    (status: string) => {
      onStatusChange(task.id, status);
    },
    [task.id, onStatusChange]
  );
  
  return (
    <div>
      <h3>{task.title}</h3>
      <select 
        value={task.status} 
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};
```

### State Optimization

Split state to avoid unnecessary re-renders:

```tsx
// Bad: Monolithic state causes unnecessary re-renders
const TaskManager = () => {
  const [state, setState] = useState({
    tasks: [],
    selectedTaskId: null,
    filter: 'all',
    isFormVisible: false,
    searchTerm: ''
  });
  
  const updateFilter = (filter) => {
    setState({
      ...state,
      filter
    });
  };
  
  // Other update functions...
  
  return (
    <div>
      {/* UI implementation */}
    </div>
  );
};

// Good: Split state for more granular updates
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isFormVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Each state has its own updater
  
  return (
    <div>
      {/* UI implementation */}
    </div>
  );
};
```

## Data Optimization

### Efficient Data Fetching

Use pagination and filtering on the server side:

```tsx
// hooks/usePaginatedTasks.ts
export function usePaginatedTasks(options: {
  page: number;
  limit: number;
  filters?: Record<string, any>;
}) {
  const { page, limit, filters } = options;
  
  const queryKey = ['tasks', page, limit, filters];
  
  return useQuery(
    queryKey,
    async () => {
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      // Add filters to params
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`/api/tasks?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      return response.json();
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  );
}
```

### Data Caching

Implement effective caching strategies:

```tsx
// Configure React Query for optimal caching
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true
    }
  }
});

// App.tsx
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Application content */}
    </QueryClientProvider>
  );
};
```

### Virtualized Lists

Use virtualization for long lists:

```tsx
// components/VirtualizedTaskList.tsx
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onTaskClick
}) => {
  const renderRow = useCallback(
    ({ index, style }) => {
      const task = tasks[index];
      return (
        <div style={style} className="task-row">
          <TaskItem 
            task={task}
            onClick={() => onTaskClick(task.id)}
          />
        </div>
      );
    },
    [tasks, onTaskClick]
  );
  
  return (
    <div className="task-list-container" style={{ height: '500px' }}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={tasks.length}
            itemSize={80} // Height of each item in pixels
          >
            {renderRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
```

### Debouncing User Input

Debounce rapidly changing inputs:

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in component
const SearchInput: React.FC<{ onSearch: (term: string) => void }> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

## Code Optimization

### Code Splitting

Split widget code to load only what's needed:

```tsx
// Dynamic import of widget components
import React, { Suspense, lazy } from 'react';

// Lazy load widgets
const TaskWidget = lazy(() => import('./widgets/TaskWidget'));
const CalendarWidget = lazy(() => import('./widgets/CalendarWidget'));
const AnalyticsWidget = lazy(() => import('./widgets/AnalyticsWidget'));

// Widget registry
const widgetComponents = {
  'task-widget': TaskWidget,
  'calendar-widget': CalendarWidget,
  'analytics-widget': AnalyticsWidget
};

// Dynamic widget loader
const WidgetLoader: React.FC<{ type: string }> = ({ type }) => {
  const WidgetComponent = widgetComponents[type];
  
  if (!WidgetComponent) {
    return <div>Widget type not found: {type}</div>;
  }
  
  return (
    <Suspense fallback={<div>Loading widget...</div>}>
      <WidgetComponent />
    </Suspense>
  );
};
```

### Tree Shaking

Write code that supports tree shaking:

```tsx
// Bad: Imports entire library
import moment from 'moment';

const formatDate = (date) => moment(date).format('YYYY-MM-DD');

// Good: Import only what you need
import { format, parseISO } from 'date-fns';

const formatDate = (dateString) => format(parseISO(dateString), 'yyyy-MM-dd');
```

### Optimizing Bundle Size

Monitor and reduce your bundle size:

```json
// package.json
{
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'",
    "build": "react-scripts build"
  },
  "dependencies": {
    "source-map-explorer": "^2.5.2"
  }
}
```

## DOM Performance

### Minimizing DOM Updates

Avoid direct DOM manipulation:

```tsx
// Bad: Directly manipulates DOM
useEffect(() => {
  const element = document.getElementById('task-list');
  if (element) {
    element.style.height = `${window.innerHeight - 200}px`;
  }
}, []);

// Good: Use refs and React's lifecycle
const taskListRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleResize = () => {
    if (taskListRef.current) {
      taskListRef.current.style.height = `${window.innerHeight - 200}px`;
    }
  };
  
  handleResize();
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Better: Use CSS when possible
// In your CSS:
// .task-list { height: calc(100vh - 200px); }
```

### Layout Optimization

Avoid layout thrashing:

```tsx
// Bad: Causes multiple layouts
const MeasureCards = () => {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const height = card.clientHeight;
    card.style.width = `${height * 1.5}px`;
  });
};

// Good: Batch reads, then writes
const MeasureCards = () => {
  const cards = document.querySelectorAll('.card');
  const measurements = [];
  
  // Read phase
  cards.forEach(card => {
    measurements.push(card.clientHeight);
  });
  
  // Write phase
  cards.forEach((card, i) => {
    card.style.width = `${measurements[i] * 1.5}px`;
  });
};
```

### Scrolling Performance

Optimize scrolling containers:

```css
/* styles.module.css */
.scrollContainer {
  /* Enable hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
  
  /* Ensure smooth scrolling */
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  
  /* Follow application scrolling preferences */
  height: 100%;
  max-height: 100%;
}
```

## Resource Optimization

### Image Optimization

Optimize images for better performance:

```tsx
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true
}) => {
  // Determine correct image URL based on size
  const imageUrl = useMemo(() => {
    if (!width || !height) return src;
    return `${src}?w=${width}&h=${height}&fit=crop`;
  }, [src, width, height]);
  
  return (
    <img
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : 'eager'}
    />
  );
};
```

### Font Optimization

Optimize font loading:

```html
<!-- In your HTML head -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  /* Font fallback */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>
```

## Performance Monitoring

### React DevTools Profiler

Use React DevTools Profiler to identify performance issues:

```tsx
// Enable profiling in development
// index.tsx
if (process.env.NODE_ENV === 'development') {
  const { createRoot } = require('react-dom/profiling');
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
} else {
  const { createRoot } = require('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
}
```

### Custom Performance Measurements

Add custom performance measurements:

```tsx
// hooks/usePerformanceTracking.ts
import { useEffect } from 'react';

export function usePerformanceTracking(
  componentName: string,
  dependencies: any[] = []
) {
  useEffect(() => {
    // Only track in development
    if (process.env.NODE_ENV !== 'development') return;
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      
      // Log slow renders
      if (renderTime > 50) {
        console.warn(`[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, dependencies);
}

// Usage in component
const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  usePerformanceTracking('TaskList', [tasks]);
  
  // Component implementation
};
```

### Web Vitals Monitoring

Monitor core web vitals:

```tsx
// index.tsx
import { createRoot } from 'react-dom/client';
import { reportWebVitals } from './reportWebVitals';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

// Send web vitals to analytics
reportWebVitals(({ name, value, id }) => {
  // Send metrics to your analytics service
  console.log(`Web Vital: ${name} - ${value}`);
  
  // Example: send to Google Analytics
  window.gtag?.('event', name, {
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_id: id,
    metric_value: value,
    metric_delta: 0
  });
});
```

## Performance Testing

### Lighthouse CI

Set up Lighthouse CI for automated performance testing:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://staging.example.com/dashboard
            https://staging.example.com/clients
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### Performance Budgets

Set performance budgets:

```json
// lighthouse-budget.json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run serve",
      "url": [
        "http://localhost:3000/dashboard",
        "http://localhost:3000/clients"
      ]
    },
    "assert": {
      "assertions": {
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "interactive": ["error", {"maxNumericValue": 3500}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}]
      }
    }
  }
}
```

## Best Practices

1. **Start with Measurement**
   - Identify performance bottlenecks before optimizing
   - Use DevTools and profiling tools
   - Measure user-centric metrics

2. **Focus on Critical Rendering Path**
   - Optimize initial load time
   - Prioritize above-the-fold content
   - Defer non-critical resources

3. **Implement Progressive Loading**
   - Show useful content quickly
   - Load data incrementally
   - Use loading states and skeleton screens

4. **Optimize for User Interaction**
   - Ensure UI responsiveness
   - Maintain 60fps scrolling
   - Keep the main thread clear

5. **Follow React Best Practices**
   - Implement proper memoization
   - Use production builds
   - Split code effectively

## Conclusion

Performance optimization is an ongoing process, not a one-time task. By following these patterns and regularly measuring performance, you can ensure your widgets provide a smooth, responsive experience even as your application grows in complexity.

For information on building accessible widgets, see the [Accessibility Guidelines](./12-accessibility.md) guide.
