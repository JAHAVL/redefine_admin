# Testing Strategy

This guide outlines the recommended approaches for testing widgets within the SoSocial CRM application.

## Core Principles

Widget testing should follow these core principles:

1. **Test Isolation**
   - Test components in isolation from their dependencies
   - Mock external services and APIs
   - Avoid testing implementation details

2. **Coverage Goals**
   - Aim for high coverage of business logic
   - Focus on user-facing functionality
   - Test edge cases and error states

3. **Test Types**
   - Unit tests for individual functions and components
   - Integration tests for component combinations
   - End-to-end tests for critical user flows

4. **Maintainability**
   - Keep tests readable and maintainable
   - Avoid test duplication
   - Structure tests like production code

## Test Directory Structure

Follow this structure for widget tests:

```
widgets/
└── WidgetName/
    ├── __tests__/                  # Test directory
    │   ├── unit/                   # Unit tests
    │   │   ├── components/         # Component unit tests
    │   │   │   ├── Component1.test.tsx
    │   │   │   └── Component2.test.tsx
    │   │   ├── hooks/              # Custom hooks tests
    │   │   │   └── useWidgetHook.test.ts
    │   │   └── utils/              # Utility function tests
    │   │       └── helpers.test.ts
    │   ├── integration/            # Integration tests
    │   │   └── WidgetIntegration.test.tsx
    │   └── e2e/                    # End-to-end tests
    │       └── WidgetFlow.test.tsx
    └── __mocks__/                  # Mock files
        ├── apiMocks.ts
        └── dataMocks.ts
```

## Unit Testing Components

Use React Testing Library for component testing:

```tsx
// __tests__/unit/components/TaskCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../../components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    dueDate: '2023-12-31'
  };
  
  const mockOnStatusChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders task details correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onStatusChange={mockOnStatusChange} 
      />
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2023')).toBeInTheDocument();
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });
  
  it('calls onStatusChange when status is changed', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onStatusChange={mockOnStatusChange} 
      />
    );
    
    // Find and click status dropdown
    const statusDropdown = screen.getByLabelText('Change status');
    fireEvent.click(statusDropdown);
    
    // Select new status
    const inProgressOption = screen.getByText('In Progress');
    fireEvent.click(inProgressOption);
    
    // Verify callback was called with correct arguments
    expect(mockOnStatusChange).toHaveBeenCalledWith('123', 'in-progress');
  });
  
  it('shows overdue indicator for past due tasks', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2021-01-01'
    };
    
    render(
      <TaskCard 
        task={overdueTask} 
        onStatusChange={mockOnStatusChange} 
      />
    );
    
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toHaveClass('overdue-badge');
  });
});
```

## Testing Custom Hooks

Use React Hooks Testing Library for testing hooks:

```tsx
// __tests__/unit/hooks/useTaskFilter.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTaskFilter } from '../../../hooks/useTaskFilter';

describe('useTaskFilter', () => {
  const tasks = [
    { id: '1', title: 'Task 1', status: 'todo', assignee: 'user1' },
    { id: '2', title: 'Task 2', status: 'in-progress', assignee: 'user2' },
    { id: '3', title: 'Complete', status: 'done', assignee: 'user1' }
  ];
  
  it('initializes with default filters', () => {
    const { result } = renderHook(() => useTaskFilter(tasks));
    
    expect(result.current.filteredTasks).toEqual(tasks);
    expect(result.current.filters).toEqual({
      status: null,
      assignee: null,
      searchTerm: ''
    });
  });
  
  it('filters tasks by status', () => {
    const { result } = renderHook(() => useTaskFilter(tasks));
    
    act(() => {
      result.current.setStatusFilter('todo');
    });
    
    expect(result.current.filteredTasks).toEqual([tasks[0]]);
    expect(result.current.filters.status).toBe('todo');
  });
  
  it('filters tasks by assignee', () => {
    const { result } = renderHook(() => useTaskFilter(tasks));
    
    act(() => {
      result.current.setAssigneeFilter('user1');
    });
    
    expect(result.current.filteredTasks).toEqual([tasks[0], tasks[2]]);
    expect(result.current.filters.assignee).toBe('user1');
  });
  
  it('filters tasks by search term', () => {
    const { result } = renderHook(() => useTaskFilter(tasks));
    
    act(() => {
      result.current.setSearchTerm('Complete');
    });
    
    expect(result.current.filteredTasks).toEqual([tasks[2]]);
    expect(result.current.filters.searchTerm).toBe('Complete');
  });
  
  it('combines multiple filters', () => {
    const { result } = renderHook(() => useTaskFilter(tasks));
    
    act(() => {
      result.current.setAssigneeFilter('user1');
      result.current.setStatusFilter('done');
    });
    
    expect(result.current.filteredTasks).toEqual([tasks[2]]);
  });
  
  it('clears all filters', () => {
    const { result } = renderHook(() => useTaskFilter(tasks));
    
    act(() => {
      result.current.setAssigneeFilter('user1');
      result.current.setStatusFilter('done');
      result.current.setSearchTerm('Complete');
    });
    
    expect(result.current.filteredTasks.length).toBe(1);
    
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.filteredTasks).toEqual(tasks);
    expect(result.current.filters).toEqual({
      status: null,
      assignee: null,
      searchTerm: ''
    });
  });
});
```

## Integration Testing

Test component combinations and interactions:

```tsx
// __tests__/integration/TaskBoardIntegration.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskBoard from '../../TaskBoard';
import { MockTaskProvider } from '../../__mocks__/MockTaskProvider';
import { mockTasks } from '../../__mocks__/dataMocks';

describe('TaskBoard Integration', () => {
  it('displays tasks and allows filtering', async () => {
    render(
      <MockTaskProvider initialTasks={mockTasks}>
        <TaskBoard />
      </MockTaskProvider>
    );
    
    // Verify all tasks are initially displayed
    expect(screen.getAllByTestId('task-card')).toHaveLength(mockTasks.length);
    
    // Filter by status
    const statusFilter = screen.getByLabelText('Filter by status');
    fireEvent.change(statusFilter, { target: { value: 'in-progress' } });
    
    // Verify only in-progress tasks are shown
    const inProgressTasks = mockTasks.filter(task => task.status === 'in-progress');
    await waitFor(() => {
      expect(screen.getAllByTestId('task-card')).toHaveLength(inProgressTasks.length);
    });
    
    // Verify task titles
    inProgressTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });
  
  it('allows adding and completing tasks', async () => {
    render(
      <MockTaskProvider initialTasks={mockTasks}>
        <TaskBoard />
      </MockTaskProvider>
    );
    
    // Add a new task
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    // Fill out task form
    const titleInput = screen.getByLabelText('Task Title');
    fireEvent.change(titleInput, { target: { value: 'New Integration Test Task' } });
    
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Testing task creation' } });
    
    const submitButton = screen.getByText('Save Task');
    fireEvent.click(submitButton);
    
    // Verify new task is added
    await waitFor(() => {
      expect(screen.getByText('New Integration Test Task')).toBeInTheDocument();
    });
    
    // Mark task as complete
    const taskCard = screen.getByText('New Integration Test Task').closest('[data-testid="task-card"]');
    const completeButton = within(taskCard).getByLabelText('Mark as complete');
    fireEvent.click(completeButton);
    
    // Verify task is marked as complete
    await waitFor(() => {
      expect(taskCard).toHaveClass('completed');
    });
  });
});
```

## Mocking APIs and Services

Create mock implementations for testing:

```tsx
// __mocks__/MockTaskProvider.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task } from '../../types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}>({
  state: { tasks: [], loading: false, error: null },
  dispatch: () => {}
});

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const MockTaskProvider: React.FC<{
  children: ReactNode;
  initialTasks?: Task[];
}> = ({ children, initialTasks = [] }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: initialTasks,
    loading: false,
    error: null
  });
  
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
```

## Testing API Services

Test service layer functions:

```tsx
// __tests__/unit/services/taskService.test.ts
import { taskService } from '../../../services/taskService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('fetches tasks successfully', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' }
    ];
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockTasks });
    
    const result = await taskService.getTasks();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/tasks', expect.any(Object));
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockTasks);
  });
  
  it('handles errors when fetching tasks', async () => {
    const errorMessage = 'Network Error';
    
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    const result = await taskService.getTasks();
    
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(errorMessage);
  });
  
  it('creates a task successfully', async () => {
    const newTask = { title: 'New Task', description: 'Description' };
    const createdTask = { id: '3', ...newTask, createdAt: '2023-01-01T00:00:00Z' };
    
    mockedAxios.post.mockResolvedValueOnce({ data: createdTask });
    
    const result = await taskService.createTask(newTask);
    
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/tasks', newTask, expect.any(Object));
    expect(result.success).toBe(true);
    expect(result.data).toEqual(createdTask);
  });
  
  // More test cases...
});
```

## End-to-End Testing

Use Cypress for critical user flows:

```javascript
// cypress/integration/taskBoard.spec.js
describe('Task Board', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/tasks', { fixture: 'tasks.json' }).as('getTasks');
    cy.intercept('POST', '/api/tasks', (req) => {
      const id = Date.now().toString();
      req.reply({
        statusCode: 201,
        body: { id, ...req.body, createdAt: new Date().toISOString() }
      });
    }).as('createTask');
    
    // Visit the page
    cy.visit('/dashboard');
    cy.wait('@getTasks');
  });
  
  it('displays tasks and allows filtering', () => {
    // Check initial task list
    cy.get('[data-testid="task-card"]').should('have.length', 5);
    
    // Filter by status
    cy.get('[data-testid="status-filter"]').select('In Progress');
    cy.get('[data-testid="task-card"]').should('have.length', 2);
    
    // Filter by assignee
    cy.get('[data-testid="assignee-filter"]').select('Current User');
    cy.get('[data-testid="task-card"]').should('have.length', 1);
    
    // Clear filters
    cy.get('[data-testid="clear-filters"]').click();
    cy.get('[data-testid="task-card"]').should('have.length', 5);
  });
  
  it('allows creating a new task', () => {
    // Click add button
    cy.get('[data-testid="add-task-button"]').click();
    
    // Fill form
    cy.get('[data-testid="task-title-input"]').type('New E2E Test Task');
    cy.get('[data-testid="task-description-input"]').type('This is a test task created by Cypress');
    cy.get('[data-testid="task-status-select"]').select('To Do');
    
    // Submit form
    cy.get('[data-testid="save-task-button"]').click();
    cy.wait('@createTask');
    
    // Verify new task appears
    cy.get('[data-testid="task-card"]').should('have.length', 6);
    cy.contains('New E2E Test Task').should('exist');
  });
});
```

## Testing Permissions and Features

Test permission-based UI variations:

```tsx
// __tests__/unit/components/TaskActions.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PermissionProvider } from '../../../context/PermissionContext';
import TaskActions from '../../../components/TaskActions';

describe('TaskActions', () => {
  const task = {
    id: '123',
    title: 'Test Task',
    status: 'todo'
  };
  
  it('shows all actions when user has all permissions', () => {
    render(
      <PermissionProvider permissions={['tasks.edit', 'tasks.delete', 'tasks.assign']}>
        <TaskActions task={task} />
      </PermissionProvider>
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Assign')).toBeInTheDocument();
  });
  
  it('hides edit button when user lacks edit permission', () => {
    render(
      <PermissionProvider permissions={['tasks.delete', 'tasks.assign']}>
        <TaskActions task={task} />
      </PermissionProvider>
    );
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Assign')).toBeInTheDocument();
  });
  
  it('hides all actions when user has no permissions', () => {
    render(
      <PermissionProvider permissions={[]}>
        <TaskActions task={task} />
      </PermissionProvider>
    );
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Assign')).not.toBeInTheDocument();
  });
});
```

## Testing Layout and Visual Appearance

Test that layouts respect application scrolling behavior:

```tsx
// __tests__/unit/components/TaskBoard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskBoard from '../../../TaskBoard';

describe('TaskBoard Layout', () => {
  it('has correct max height and scrolling behavior', () => {
    render(<TaskBoard />);
    
    const taskBoardElement = screen.getByTestId('task-board');
    const taskListElement = screen.getByTestId('task-list');
    
    // Check that the main container has fixed height and no overflow
    expect(taskBoardElement).toHaveStyle({
      height: '100%',
      maxHeight: '100%',
      overflowX: 'hidden'
    });
    
    // Check that the content area has vertical scrolling
    expect(taskListElement).toHaveStyle({
      overflowY: 'auto',
      overflowX: 'hidden'
    });
  });
});
```

## Snapshot Testing

Use snapshots for UI regression testing:

```tsx
// __tests__/unit/components/TaskCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import TaskCard from '../../../components/TaskCard';

describe('TaskCard snapshots', () => {
  it('matches snapshot for todo task', () => {
    const task = {
      id: '1',
      title: 'Todo Task',
      description: 'Description',
      status: 'todo',
      dueDate: '2023-12-31'
    };
    
    const { container } = render(<TaskCard task={task} />);
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot for in-progress task', () => {
    const task = {
      id: '2',
      title: 'In Progress Task',
      description: 'Description',
      status: 'in-progress',
      dueDate: '2023-12-31'
    };
    
    const { container } = render(<TaskCard task={task} />);
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot for completed task', () => {
    const task = {
      id: '3',
      title: 'Completed Task',
      description: 'Description',
      status: 'done',
      dueDate: '2023-12-31'
    };
    
    const { container } = render(<TaskCard task={task} />);
    expect(container).toMatchSnapshot();
  });
});
```

## Test Coverage

Analyze and maintain test coverage:

```json
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    },
    './src/widgets/*/hooks/': {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    },
    './src/widgets/*/services/': {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95
    }
  }
};
```

## Continuous Integration

Set up automated testing in CI/CD pipeline:

```yaml
# .github/workflows/widget-tests.yml
name: Widget Tests

on:
  push:
    paths:
      - 'src/widgets/**'
      - 'package.json'
      - 'yarn.lock'
  pull_request:
    paths:
      - 'src/widgets/**'
      - 'package.json'
      - 'yarn.lock'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'yarn'
      
      - name: Install Dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run Unit Tests
        run: yarn test:widgets
      
      - name: Run E2E Tests
        run: yarn cypress:run
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          directory: ./coverage/
```

## Best Practices

1. **Write Tests First**
   - Consider test-driven development (TDD)
   - Define test cases before implementation
   - Focus on behaviors, not implementation details

2. **Keep Tests Fast**
   - Minimize external dependencies
   - Use mocks appropriately
   - Avoid unnecessary setup/teardown

3. **Structure Tests Well**
   - Group related tests
   - Use descriptive test names
   - Follow the AAA pattern (Arrange, Act, Assert)

4. **Test Real User Scenarios**
   - Test from the user's perspective
   - Focus on user-visible outcomes
   - Test accessibility

5. **Regularly Review Coverage**
   - Identify untested areas
   - Focus on complex logic
   - Don't aim for 100% coverage at all costs

## Conclusion

A thorough testing strategy ensures that widgets remain reliable and maintainable as the application evolves. By implementing a mix of unit, integration, and end-to-end tests, you can catch issues early and maintain high-quality widgets.

For information on optimizing widget performance, see the [Performance Optimization](./11-performance.md) guide.
