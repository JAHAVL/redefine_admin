# Layout Management

This guide focuses on layout components and patterns within widgets, with special attention to the system-wide scrolling behavior preferences in the SoSocial CRM application.

## Layout Principles

Widget layouts should adhere to these core principles:

1. **Respect System Boundaries**
   - Widgets must fit within their container bounds
   - No horizontal scrolling allowed within widgets
   - Vertical scrolling only happens in designated scroll containers
   - Fixed elements stay fixed, scrollable elements scroll

2. **Content Adaptability**
   - Content should adapt to available space
   - Use flexible layouts that work across screen sizes
   - Implement graceful overflow handling

3. **Predictable Behavior**
   - Scrolling behavior should be consistent across widgets
   - Layout shifts should be minimized
   - Fixed elements must remain accessible

4. **Performance Focus**
   - Optimize DOM structure for layout performance
   - Avoid layout thrashing
   - Use CSS properties that don't trigger reflow

## System-Wide Scrolling Behavior

The SoSocial CRM application implements a specific scrolling behavior pattern:

1. **Application Structure**
   - Top menu remains fixed at the top
   - Left navigation remains fixed on the left
   - Right sidebar (AI assistant) remains fixed on the right
   - Only the main content area scrolls vertically

2. **Implementation Requirements**
   - Main container uses 100vh height with overflow: hidden
   - Content wrapper prevents overflow beyond bounds
   - Only inner content areas have overflow-y: auto for vertical scrolling
   - All areas enforce overflow-x: hidden to prevent horizontal scrolling

3. **Widget Implications**
   - Widgets must respect this system and never break out of bounds
   - Widgets with a lot of content must implement their own scrolling containers
   - Fixed elements within widgets should be used sparingly

## Layout Directory Structure

The `layouts/` directory in the widget should be structured as follows:

```
/layouts/
├── MainLayout.tsx          # Primary widget layout
├── MainLayout.module.css
├── DetailLayout.tsx        # Detail view layout
├── DetailLayout.module.css
├── GridLayout.tsx          # Grid-based layout
├── GridLayout.module.css
└── ...
```

## Common Layout Components

### Main Layout

This component provides the primary layout structure for the widget:

```tsx
// MainLayout.tsx
import React from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
}

const MainLayout: React.FC<MainLayoutProps> = ({
  header,
  sidebar,
  footer,
  children,
  sidebarPosition = 'left'
}) => {
  return (
    <div className={styles.container}>
      {/* Fixed header if provided */}
      {header && <div className={styles.header}>{header}</div>}
      
      {/* Main content area with optional sidebar */}
      <div className={`${styles.content} ${sidebar ? styles.withSidebar : ''} ${styles[sidebarPosition]}`}>
        {sidebar && <div className={styles.sidebar}>{sidebar}</div>}
        <div className={styles.mainContent}>{children}</div>
      </div>
      
      {/* Fixed footer if provided */}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default MainLayout;
```

```css
/* MainLayout.module.css */
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevent overflow at container level */
}

.header {
  flex: 0 0 auto;
  width: 100%;
  z-index: 10;
}

.content {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden; /* Container doesn't scroll */
  width: 100%;
  min-height: 0; /* Important for Firefox */
}

.withSidebar {
  /* Styles when sidebar is present */
}

.left {
  flex-direction: row;
}

.right {
  flex-direction: row-reverse;
}

.sidebar {
  flex: 0 0 auto;
  overflow-y: auto; /* Sidebar scrolls independently */
  width: 250px;
}

.mainContent {
  flex: 1 1 auto;
  overflow-y: auto; /* Main content scrolls independently */
  min-width: 0; /* Prevent flex items from expanding beyond container */
}

.footer {
  flex: 0 0 auto;
  width: 100%;
  z-index: 10;
}
```

### Grid Layout

For content that needs to be displayed in a grid:

```tsx
// GridLayout.tsx
import React from 'react';
import styles from './GridLayout.module.css';

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: number | 'auto-fill' | 'auto-fit';
  minItemWidth?: string;
  gap?: string;
  className?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 'auto-fill',
  minItemWidth = '250px',
  gap = '16px',
  className = ''
}) => {
  // Determine grid-template-columns value
  let gridTemplateColumns: string;
  
  if (columns === 'auto-fill') {
    gridTemplateColumns = `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`;
  } else if (columns === 'auto-fit') {
    gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
  } else {
    gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
  
  return (
    <div 
      className={`${styles.grid} ${className}`}
      style={{ 
        gridTemplateColumns,
        gap
      }}
    >
      {children}
    </div>
  );
};

export default GridLayout;
```

```css
/* GridLayout.module.css */
.grid {
  display: grid;
  width: 100%;
  overflow: hidden;
}
```

### Split Layout

For side-by-side content with resizable panels:

```tsx
// SplitLayout.tsx
import React, { useState, useRef, useCallback } from 'react';
import styles from './SplitLayout.module.css';

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialSplit?: number; // 0-100, percentage for left panel
  minLeftWidth?: number; // Minimum pixel width for left panel
  minRightWidth?: number; // Minimum pixel width for right panel
  direction?: 'horizontal' | 'vertical';
}

const SplitLayout: React.FC<SplitLayoutProps> = ({
  left,
  right,
  initialSplit = 50,
  minLeftWidth = 200,
  minRightWidth = 200,
  direction = 'horizontal'
}) => {
  const [splitPosition, setSplitPosition] = useState(initialSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  
  const startResize = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
    e.preventDefault(); // Prevent text selection
  }, []);
  
  const stopResize = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    if (direction === 'horizontal') {
      const mousePosition = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      
      // Calculate percentage with constraints
      const leftWidth = Math.max(minLeftWidth, Math.min(containerWidth - minRightWidth, mousePosition));
      const percentage = (leftWidth / containerWidth) * 100;
      
      setSplitPosition(percentage);
    } else {
      const mousePosition = e.clientY - containerRect.top;
      const containerHeight = containerRect.height;
      
      // Calculate percentage with constraints
      const topHeight = Math.max(minLeftWidth, Math.min(containerHeight - minRightWidth, mousePosition));
      const percentage = (topHeight / containerHeight) * 100;
      
      setSplitPosition(percentage);
    }
  }, [direction, minLeftWidth, minRightWidth]);
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${styles[direction]}`}
    >
      <div 
        className={styles.leftPanel}
        style={
          direction === 'horizontal' 
            ? { width: `${splitPosition}%` }
            : { height: `${splitPosition}%` }
        }
      >
        {left}
      </div>
      
      <div 
        className={styles.resizeHandle}
        onMouseDown={startResize}
      />
      
      <div 
        className={styles.rightPanel}
        style={
          direction === 'horizontal' 
            ? { width: `${100 - splitPosition}%` }
            : { height: `${100 - splitPosition}%` }
        }
      >
        {right}
      </div>
    </div>
  );
};

export default SplitLayout;
```

```css
/* SplitLayout.module.css */
.container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.horizontal {
  flex-direction: row;
}

.vertical {
  flex-direction: column;
}

.leftPanel, .rightPanel {
  overflow: auto;
  min-width: 0; /* Important for Firefox */
  min-height: 0; /* Important for Firefox */
}

.resizeHandle {
  flex: 0 0 6px;
  background-color: #f0f0f0;
  cursor: col-resize;
  position: relative;
  z-index: 10;
}

.vertical .resizeHandle {
  cursor: row-resize;
  height: 6px;
  width: 100%;
}

.resizeHandle:hover, .resizeHandle:active {
  background-color: #ddd;
}
```

## Scroll Containers

Proper scroll container implementation is critical:

```tsx
// ScrollContainer.tsx
import React from 'react';
import styles from './ScrollContainer.module.css';

interface ScrollContainerProps {
  children: React.ReactNode;
  maxHeight?: string;
  horizontal?: boolean;
  className?: string;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  maxHeight = '100%',
  horizontal = false,
  className = ''
}) => {
  return (
    <div 
      className={`
        ${styles.scrollContainer} 
        ${horizontal ? styles.horizontal : ''} 
        ${className}
      `}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
```

```css
/* ScrollContainer.module.css */
.scrollContainer {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  position: relative;
}

.horizontal {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
```

## Fixed Element Management

For fixed elements within widgets, follow these patterns:

### Sticky Headers

```tsx
// ListWithStickyHeader.tsx
import React from 'react';
import styles from './ListWithStickyHeader.module.css';

interface ListWithStickyHeaderProps {
  header: React.ReactNode;
  children: React.ReactNode;
  maxHeight?: string;
}

const ListWithStickyHeader: React.FC<ListWithStickyHeaderProps> = ({
  header,
  children,
  maxHeight = '400px'
}) => {
  return (
    <div className={styles.container} style={{ maxHeight }}>
      <div className={styles.stickyHeader}>{header}</div>
      <div className={styles.scrollContent}>{children}</div>
    </div>
  );
};

export default ListWithStickyHeader;
```

```css
/* ListWithStickyHeader.module.css */
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.stickyHeader {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white; /* Should use theme variable */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Should use theme variable */
}

.scrollContent {
  overflow-y: auto;
  flex: 1;
  min-height: 0; /* Important for Firefox */
}
```

### Bottom Action Bars

```tsx
// ContentWithActionBar.tsx
import React from 'react';
import styles from './ContentWithActionBar.module.css';

interface ContentWithActionBarProps {
  children: React.ReactNode;
  actions: React.ReactNode;
  maxHeight?: string;
}

const ContentWithActionBar: React.FC<ContentWithActionBarProps> = ({
  children,
  actions,
  maxHeight = '100%'
}) => {
  return (
    <div className={styles.container} style={{ maxHeight }}>
      <div className={styles.scrollContent}>{children}</div>
      <div className={styles.actionBar}>{actions}</div>
    </div>
  );
};

export default ContentWithActionBar;
```

```css
/* ContentWithActionBar.module.css */
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.scrollContent {
  overflow-y: auto;
  flex: 1;
  min-height: 0; /* Important for Firefox */
}

.actionBar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background-color: white; /* Should use theme variable */
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1); /* Should use theme variable */
  padding: 12px 16px;
}
```

## Responsive Layout Techniques

### Container Queries

For components that need to adapt based on their container size:

```tsx
// ResponsiveCard.tsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './ResponsiveCard.module.css';

interface ResponsiveCardProps {
  children: React.ReactNode;
  compactThreshold?: number; // Width in pixels
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  compactThreshold = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const checkSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsCompact(width < compactThreshold);
      }
    };
    
    // Check initial size
    checkSize();
    
    // Create ResizeObserver
    const resizeObserver = new ResizeObserver(checkSize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [compactThreshold]);
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.card} ${isCompact ? styles.compact : ''}`}
    >
      {children}
    </div>
  );
};

export default ResponsiveCard;
```

```css
/* ResponsiveCard.module.css */
.card {
  width: 100%;
  padding: 16px;
}

.compact {
  /* Styles for compact mode */
  padding: 8px;
}

.compact h3 {
  font-size: 0.9em;
}
```

### Media Query Breakpoints

Define consistent breakpoints for media queries:

```css
/* breakpoints.css */
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;
}

/* Usage example */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}
```

## Layout Performance Optimization

### DOM Optimization

Optimize DOM structure for better layout performance:

1. **Minimize DOM Depth**
   - Keep DOM trees shallow
   - Avoid unnecessary wrapper elements

2. **Use Fragment for Multiple Elements**
   ```tsx
   return (
     <>
       <div>Element 1</div>
       <div>Element 2</div>
     </>
   );
   ```

3. **Use CSS Grid and Flexbox**
   - Use modern CSS layout tools instead of older techniques
   - Reduce need for layout calculations

### Reducing Layout Thrashing

Prevent multiple layout recalculations:

```tsx
// Bad: Causes multiple layouts
function updateElementPositions() {
  const elements = document.querySelectorAll('.item');
  
  elements.forEach(el => {
    const height = el.offsetHeight; // Forces layout calculation
    el.style.marginTop = height + 'px'; // Forces another layout calculation
  });
}

// Good: Batches reads and writes
function updateElementPositions() {
  const elements = document.querySelectorAll('.item');
  const heights = [];
  
  // Read phase (all measurements)
  elements.forEach(el => {
    heights.push(el.offsetHeight);
  });
  
  // Write phase (all updates)
  elements.forEach((el, i) => {
    el.style.marginTop = heights[i] + 'px';
  });
}
```

### Will-Change Property

For elements that will animate or change:

```css
.sidebar-transition {
  will-change: transform;
  transition: transform 0.3s ease;
}
```

## Common Layout Challenges and Solutions

### Content Height Management

Handle dynamic content height:

```tsx
// AutoHeightTransition.tsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './AutoHeightTransition.module.css';

interface AutoHeightTransitionProps {
  children: React.ReactNode;
  isExpanded: boolean;
}

const AutoHeightTransition: React.FC<AutoHeightTransitionProps> = ({
  children,
  isExpanded
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(0);
  
  useEffect(() => {
    if (!contentRef.current) return;
    
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
      
      // After transition, set to 'auto' to handle content changes
      const timer = setTimeout(() => setHeight('auto'), 300);
      return () => clearTimeout(timer);
    } else {
      // First get current height to enable transition from auto
      if (height === 'auto') {
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(contentHeight);
        
        // Force reflow
        contentRef.current.offsetHeight;
      }
      
      // Then animate to 0
      setTimeout(() => setHeight(0), 0);
    }
  }, [isExpanded, height]);
  
  return (
    <div 
      ref={contentRef}
      className={styles.container}
      style={{ height: height === 'auto' ? 'auto' : `${height}px` }}
    >
      {children}
    </div>
  );
};

export default AutoHeightTransition;
```

```css
/* AutoHeightTransition.module.css */
.container {
  overflow: hidden;
  transition: height 0.3s ease-in-out;
}
```

### Layout Shifts Prevention

Prevent content jumps:

```tsx
// ContentWithPlaceholder.tsx
import React, { useState, useEffect } from 'react';
import styles from './ContentWithPlaceholder.module.css';

interface ContentWithPlaceholderProps {
  children: React.ReactNode;
  isLoading: boolean;
  placeholderHeight?: number;
}

const ContentWithPlaceholder: React.FC<ContentWithPlaceholderProps> = ({
  children,
  isLoading,
  placeholderHeight = 200
}) => {
  const [showContent, setShowContent] = useState(!isLoading);
  
  useEffect(() => {
    if (!isLoading) {
      // Delay showing content to prevent layout shift
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);
  
  return (
    <div className={styles.container}>
      {isLoading && (
        <div 
          className={styles.placeholder}
          style={{ height: `${placeholderHeight}px` }}
        >
          <div className={styles.shimmer} />
        </div>
      )}
      
      <div className={`${styles.content} ${showContent ? styles.visible : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ContentWithPlaceholder;
```

## Conclusion

Proper layout management ensures widgets behave consistently and respect the system-wide scrolling behavior preferences. By using these layout components and patterns, widgets will maintain their visual integrity while providing a smooth user experience.

For state management techniques, see the [State Management](./06-state-management.md) guide.
