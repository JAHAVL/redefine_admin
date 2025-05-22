# Page Integration & Backend Requirements

This guide outlines how widgets integrate with application pages and briefly covers backend requirements for widgets.

## Widget-Page Relationship

Widgets are designed to be embedded within application pages. Understanding this relationship is crucial for proper widget implementation.

### Core Principles

1. **Page as Container**
   - Pages provide the context and container for widgets
   - Widgets should adapt to the available space in their parent page
   - Multiple widgets can coexist on a single page

2. **Page-Specific Configuration**
   - Widgets should accept configuration from their parent page
   - The same widget may appear differently on different pages
   - Pages control widget visibility and placement

3. **Layout Considerations**
   - Widgets must respect the application's scrolling behavior
   - Only widget content areas should scroll vertically when needed
   - Horizontal scrolling should be avoided application-wide

## Page Structure

Create a clear page structure that can house widgets:

```tsx
// pages/DashboardPage/index.tsx
import React from 'react';
import { TaskWidget } from '../../widgets/TaskWidget';
import { MetricsWidget } from '../../widgets/MetricsWidget';
import { CalendarWidget } from '../../widgets/CalendarWidget';
import styles from './styles.module.css';

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboardPage}>
      <h1>Dashboard</h1>
      
      <div className={styles.widgetContainer}>
        <div className={styles.widgetRow}>
          <div className={styles.widgetCell}>
            <MetricsWidget 
              id="dashboard-metrics"
              title="Key Metrics"
              refreshInterval={300000} // 5 minutes
            />
          </div>
          
          <div className={styles.widgetCell}>
            <CalendarWidget 
              id="dashboard-calendar"
              title="Upcoming Events"
              view="week"
              showControls={true}
            />
          </div>
        </div>
        
        <div className={styles.widgetRow}>
          <div className={styles.widgetCell}>
            <TaskWidget 
              id="dashboard-tasks"
              title="My Tasks"
              filter="assignedToMe"
              showCompleted={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
```

### Page Organization

Follow these guidelines for organizing pages:

1. **Main Pages**
   - Place main pages directly in the `pages` directory
   - Example: `pages/DashboardPage`, `pages/ClientsPage`

2. **Detail Pages**
   - Organize detail pages as subfolders of their parent page
   - Example: `pages/ClientsPage/ClientDetailPage`

3. **Page Components**
   - Keep page-specific components in the page directory
   - Shared components should go in the global `components` directory

```
pages/
├── DashboardPage/
│   ├── index.tsx             # Main dashboard page
│   ├── styles.module.css     # Dashboard-specific styles
│   └── components/           # Dashboard-specific components
├── ClientsPage/
│   ├── index.tsx             # Clients list page
│   ├── ClientDetailPage/     # Detail page as subfolder
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── components/           # Client page-specific components
└── UsersPage/
    ├── index.tsx
    └── UserDetailPage/
        └── index.tsx
```

## Page-Widget Communication

Implement clear patterns for page-widget communication:

```tsx
// Example of page-to-widget communication
const ClientsPage: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Pass data and handlers to widgets
  return (
    <div className={styles.clientsPage}>
      <ClientListWidget 
        onClientSelect={setSelectedClient}
      />
      
      {selectedClient && (
        <ClientDetailsWidget 
          client={selectedClient}
          onClientUpdate={(updatedClient) => {
            // Handle client update
            setSelectedClient(updatedClient);
          }}
        />
      )}
    </div>
  );
};
```

## Widget Layout in Pages

Create flexible layouts for widgets:

```css
/* pages/DashboardPage/styles.module.css */
.dashboardPage {
  padding: 20px;
  height: 100%;
}

.widgetContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100% - 60px); /* Accounting for header */
}

.widgetRow {
  display: flex;
  gap: 20px;
  flex: 1;
}

.widgetCell {
  flex: 1;
  min-width: 0; /* Prevent flex items from overflowing */
  overflow: hidden; /* Contain widget within cell */
  display: flex;
  flex-direction: column;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .widgetRow {
    flex-direction: column;
  }
}
```

## Backend Requirements

Widgets often require backend services to function properly. While detailed backend implementation is covered in a separate guide, here's a brief overview of what widgets typically need:

### API Endpoints

Most widgets require dedicated API endpoints:

```typescript
// Example of typical API endpoints for a TaskWidget
GET    /api/tasks                  // List tasks with filtering
POST   /api/tasks                  // Create a new task
GET    /api/tasks/:id              // Get a single task
PUT    /api/tasks/:id              // Update a task
DELETE /api/tasks/:id              // Delete a task
PATCH  /api/tasks/:id/complete     // Mark a task as complete
```

### Data Models

Widgets need properly structured data models:

```typescript
// Example data model for tasks
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assigneeId: string | null;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
```

### Authentication & Authorization

Backend services must implement proper authentication and authorization:

```typescript
// Example of authorization middleware
const authorizeTaskAccess = async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  
  // Check if user has access to this task
  const hasAccess = await taskService.checkUserAccess(taskId, userId);
  
  if (!hasAccess) {
    return res.status(403).json({
      error: 'You do not have permission to access this task'
    });
  }
  
  next();
};

// Use middleware in routes
router.get('/tasks/:id', authenticate, authorizeTaskAccess, taskController.getTask);
```

## Conclusion

Widgets require properly structured pages to contain them and backend services to support their functionality. When designing widgets, always consider how they will integrate with pages and what backend requirements they have.

For detailed information on backend implementation, please refer to the backend documentation guide.
