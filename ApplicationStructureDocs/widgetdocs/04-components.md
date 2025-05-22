# Component Architecture

This guide explains how to structure, organize, and implement components within widgets. Proper component architecture leads to more maintainable, testable, and reusable code.

## Component Design Principles

Widget components should follow these principles:

1. **Single Responsibility**
   - Each component should focus on one specific task
   - Break complex components into smaller, focused ones

2. **Composability**
   - Design components to be combined into larger UIs
   - Use composition over inheritance

3. **Reusability**
   - Create components that can be used in multiple contexts
   - Avoid hardcoding values that would limit reuse

4. **Testability**
   - Components should be easy to test in isolation
   - Avoid complex side effects that make testing difficult

5. **Accessibility**
   - Ensure components are accessible by default
   - Follow WAI-ARIA guidelines

## Component Organization

### Directory Structure

Within the `components` directory, organize files as follows:

```
/components/
├── common/                  # Reusable utility components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   ├── Card/
│   └── ...
├── datadisplay/             # Components that display data
│   ├── List/
│   ├── Table/
│   └── ...
├── inputs/                  # Input and form components
│   ├── TextField/
│   ├── Select/
│   └── ...
├── feedback/                # User feedback components
│   ├── Alert/
│   ├── Toast/
│   └── ...
├── modals/                  # Modal components and dialogs
│   ├── DetailModal/
│   ├── ConfirmModal/
│   └── ...
└── compound/                # Complex components combining others
    ├── SearchPanel/
    ├── FilterBar/
    └── ...
```

### Component File Structure

Each component should follow this structure:

```
/ComponentName/
├── index.ts                 # Public exports
├── ComponentName.tsx        # Main component implementation
├── ComponentName.module.css # Structural styles
├── SubComponent.tsx         # Subcomponents (when needed)
└── types.ts                 # Component-specific types
```

## Implementing Components

### Basic Component Structure

```tsx
import React from 'react';
import styles from './ComponentName.module.css';
import themeStyles from '../../theme.module.css';
import { ComponentProps } from './types';

export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  children,
  className = '',
  ...restProps
}) => {
  // Component logic here
  
  return (
    <div 
      className={`${styles.container} ${themeStyles.container} ${className}`}
      {...restProps}
    >
      {/* Component content */}
      {children}
    </div>
  );
};

export default ComponentName;
```

### Component Types

Define component props in a separate types file for clarity:

```tsx
// types.ts
export interface ComponentProps {
  /** Description of prop1 */
  prop1: string;
  
  /** Description of prop2 */
  prop2?: number;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Children to render */
  children?: React.ReactNode;
}
```

### Subcomponents

For complex components, use the Compound Component pattern:

```tsx
// MenuComponent.tsx
import React, { createContext, useContext, useState } from 'react';
import styles from './Menu.module.css';
import themeStyles from '../../theme.module.css';

// Context for menu state
const MenuContext = createContext<{
  activeId: string | null;
  setActiveId: (id: string) => void;
} | undefined>(undefined);

// Main component
export const Menu: React.FC<{
  children: React.ReactNode;
  defaultActiveId?: string;
}> = ({ children, defaultActiveId = null }) => {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);
  
  return (
    <MenuContext.Provider value={{ activeId, setActiveId }}>
      <ul className={`${styles.menu} ${themeStyles.menuList}`}>
        {children}
      </ul>
    </MenuContext.Provider>
  );
};

// Subcomponent
export const MenuItem: React.FC<{
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ id, children, onClick }) => {
  const context = useContext(MenuContext);
  
  if (!context) {
    throw new Error('MenuItem must be used within a Menu');
  }
  
  const { activeId, setActiveId } = context;
  const isActive = activeId === id;
  
  const handleClick = () => {
    setActiveId(id);
    onClick?.();
  };
  
  return (
    <li 
      className={`
        ${styles.menuItem}
        ${isActive ? styles.active : ''}
        ${isActive ? themeStyles.activeMenuItem : themeStyles.menuItem}
      `}
      onClick={handleClick}
    >
      {children}
    </li>
  );
};

// Export as single component with subcomponents
Menu.Item = MenuItem;

export default Menu;
```

Usage:

```tsx
<Menu defaultActiveId="home">
  <Menu.Item id="home">Home</Menu.Item>
  <Menu.Item id="users">Users</Menu.Item>
  <Menu.Item id="settings">Settings</Menu.Item>
</Menu>
```

## Modal Components

Modal components require special attention due to their complexity:

### Modal Structure

```
/modals/
├── DetailModal/
│   ├── index.ts
│   ├── DetailModal.tsx
│   ├── DetailModal.module.css
│   └── sections/
│       ├── HeaderSection.tsx
│       ├── ContentSection.tsx
│       └── FooterSection.tsx
```

### Modal Implementation

```tsx
// DetailModal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './DetailModal.module.css';
import themeStyles from '../../../theme.module.css';
import HeaderSection from './sections/HeaderSection';
import ContentSection from './sections/ContentSection';
import FooterSection from './sections/FooterSection';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  item: any; // Replace with specific type
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  item
}) => {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  if (!isOpen) return null;
  
  // Portal to body to avoid z-index issues
  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={`${styles.modal} ${themeStyles.modalContainer}`}
        onClick={e => e.stopPropagation()}
      >
        <HeaderSection title={title} onClose={onClose} />
        <ContentSection item={item} />
        <FooterSection onClose={onClose} item={item} />
      </div>
    </div>,
    document.body
  );
};

// Attach section components for external usage
DetailModal.Header = HeaderSection;
DetailModal.Content = ContentSection;
DetailModal.Footer = FooterSection;

export default DetailModal;
```

### Modal Sections

```tsx
// HeaderSection.tsx
import React from 'react';
import styles from './HeaderSection.module.css';
import themeStyles from '../../../../theme.module.css';

interface HeaderSectionProps {
  title: string;
  onClose: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, onClose }) => {
  return (
    <div className={`${styles.header} ${themeStyles.modalHeader}`}>
      <h2 className={themeStyles.modalTitle}>{title}</h2>
      <button 
        className={`${styles.closeButton} ${themeStyles.closeButton}`}
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default HeaderSection;
```

## Component Communication Patterns

### Props and Callbacks

The primary way components should communicate:

```tsx
// Parent component
const Parent = () => {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <ChildInput 
        value={value}
        onChange={setValue}
      />
      <ChildDisplay value={value} />
    </div>
  );
};

// Child components
const ChildInput = ({ value, onChange }) => (
  <input 
    value={value} 
    onChange={e => onChange(e.target.value)} 
  />
);

const ChildDisplay = ({ value }) => (
  <div>Current value: {value}</div>
);
```

### Context API

For deeply nested components to share state:

```tsx
// Create context
const ValueContext = createContext<{
  value: string;
  setValue: (value: string) => void;
} | undefined>(undefined);

// Provider in parent
const Parent = () => {
  const [value, setValue] = useState('');
  
  return (
    <ValueContext.Provider value={{ value, setValue }}>
      <DeepComponent />
    </ValueContext.Provider>
  );
};

// Consumer in deeply nested child
const DeepChildComponent = () => {
  const context = useContext(ValueContext);
  
  if (!context) {
    throw new Error('Must be used within ValueContext');
  }
  
  const { value, setValue } = context;
  
  return (
    <button onClick={() => setValue('new value')}>
      Update value: {value}
    </button>
  );
};
```

### Custom Events

For component communication across different branches:

```tsx
// EventBus.ts
type EventHandler = (...args: any[]) => void;

class EventBus {
  private events: Record<string, EventHandler[]> = {};
  
  on(event: string, handler: EventHandler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }
  
  off(event: string, handler: EventHandler): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }
  
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => handler(...args));
  }
}

export const widgetEventBus = new EventBus();

// Using in components
const ComponentA = () => {
  useEffect(() => {
    widgetEventBus.emit('itemSelected', { id: '123' });
  }, []);
  
  return <div>Component A</div>;
};

const ComponentB = () => {
  useEffect(() => {
    const handler = (item) => {
      console.log('Item selected:', item);
    };
    
    widgetEventBus.on('itemSelected', handler);
    return () => widgetEventBus.off('itemSelected', handler);
  }, []);
  
  return <div>Component B</div>;
};
```

## Component Performance Optimization

### Memoization

Use React.memo for component memoization:

```tsx
const ExpensiveComponent = React.memo(({ value }) => {
  // Complex rendering logic
  return <div>{value}</div>;
});
```

### Callback Memoization

Use useCallback to prevent unnecessary re-renders:

```tsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  // Memoized callback
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <div>Count: {count}</div>
    </div>
  );
};
```

### Value Memoization

Use useMemo for expensive calculations:

```tsx
const DataComponent = ({ items }) => {
  // Memoize expensive calculation
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  
  return (
    <div>
      {sortedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## Common Component Patterns

### Controlled vs. Uncontrolled Components

Support both patterns for flexibility:

```tsx
// TextField.tsx
interface TextFieldProps {
  // Controlled props
  value?: string;
  onChange?: (value: string) => void;
  
  // Uncontrolled props
  defaultValue?: string;
  
  // Common props
  label: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  defaultValue,
  label,
  placeholder
}) => {
  // For uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // Determine if controlled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    // Call external handler if provided
    onChange?.(newValue);
  };
  
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};
```

### Render Props Pattern

Allows flexible customization of rendering:

```tsx
// DataProvider.tsx
interface DataProviderProps<T> {
  fetchData: () => Promise<T[]>;
  render: (props: {
    data: T[] | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataProvider<T>({ fetchData, render }: DataProviderProps<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetchData]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  return <>{render({ data, loading, error, refetch: loadData })}</>;
}
```

Usage:

```tsx
<DataProvider
  fetchData={() => api.fetchUsers()}
  render={({ data, loading, error, refetch }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;
    if (!data) return <EmptyState />;
    
    return (
      <div>
        {data.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
        <button onClick={refetch}>Refresh</button>
      </div>
    );
  }}
/>
```

## Component Documentation

Every component should include proper documentation:

```tsx
/**
 * Button component with multiple variants and sizes.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="large" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
};
```

Use prop comments for better IDE support:

```tsx
interface ButtonProps {
  /** The button's visual style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  
  /** The button's size */
  size?: 'small' | 'medium' | 'large';
  
  /** Called when the button is clicked */
  onClick?: () => void;
  
  /** Button content */
  children: React.ReactNode;
}
```

## Conclusion

This component architecture creates a system of reusable, maintainable UI elements. Following these patterns ensures consistency across the widget and makes components easier to test and modify.

For guidelines on layout components specifically, see the [Layout Management](./05-layouts.md) guide.
