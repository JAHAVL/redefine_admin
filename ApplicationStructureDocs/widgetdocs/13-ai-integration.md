# AI Integration

This guide outlines approaches for integrating AI capabilities into widgets within the SoSocial CRM application, with a focus on making widgets controllable by AI assistants.

## Core Principles

When designing AI-controllable widgets, follow these principles:

1. **Command-Based Architecture**
   - Design widgets to expose explicit commands
   - Create standardized interfaces for AI interaction
   - Implement predictable state changes

2. **Programmatic Control**
   - Make all widget functions accessible via code
   - Avoid widget behaviors that only work with direct user interaction
   - Support both AI-driven and user-driven interactions

3. **State Observability**
   - Expose widget state for AI monitoring
   - Implement event systems to notify AI of changes
   - Provide methods for querying widget capabilities

4. **Graceful Fallbacks**
   - Design widgets to function properly without AI
   - Handle unexpected AI inputs elegantly
   - Provide user override capabilities

## Making Widgets AI-Controllable

### Command Registry Pattern

Register widget commands that AI can discover and execute:

```tsx
// types/aiControlled.ts
export interface WidgetCommand {
  id: string;              // Unique command identifier
  widgetId: string;        // Widget this command belongs to
  name: string;            // Human-readable name
  description: string;     // Description for AI context
  parameters: {            // Command parameters
    [name: string]: {
      type: string;        // Parameter type
      description: string; // Parameter purpose
      required: boolean;   // Whether parameter is required
    }
  };
  execute: (params: any) => Promise<any>; // Command implementation
}

// widgets/TaskWidget/commands.ts
import { registerWidgetCommand } from '../../services/widgetCommandRegistry';

// Register commands this widget exposes to AI
export function registerTaskWidgetCommands(widgetId: string) {
  registerWidgetCommand({
    id: `${widgetId}:addTask`,
    widgetId,
    name: 'Add Task',
    description: 'Creates a new task in the task list',
    parameters: {
      title: {
        type: 'string',
        description: 'Title of the task',
        required: true
      },
      description: {
        type: 'string',
        description: 'Description of the task',
        required: false
      },
      dueDate: {
        type: 'string',
        description: 'Due date in ISO format (YYYY-MM-DD)',
        required: false
      },
      priority: {
        type: 'string',
        description: 'Priority of the task (low, medium, high)',
        required: false
      }
    },
    execute: async (params) => {
      // Implementation to add a task
      return { success: true, taskId: 'new-task-id' };
    }
  });
  
  registerWidgetCommand({
    id: `${widgetId}:completeTask`,
    widgetId,
    name: 'Complete Task',
    description: 'Marks a task as completed',
    parameters: {
      taskId: {
        type: 'string',
        description: 'ID of the task to complete',
        required: true
      }
    },
    execute: async (params) => {
      // Implementation to complete a task
      return { success: true };
    }
  });
  
  // Additional commands...
}
```

### Command Registry Service

Create a central registry for all widget commands:

```tsx
// services/widgetCommandRegistry.ts
import { WidgetCommand } from '../types/aiControlled';

// Registry for all widget commands
const commandRegistry = new Map<string, WidgetCommand>();

// Command registration
export function registerWidgetCommand(command: WidgetCommand) {
  commandRegistry.set(command.id, command);
  console.log(`Registered widget command: ${command.id}`);
}

// Get commands for a specific widget
export function getWidgetCommands(widgetId: string): WidgetCommand[] {
  return Array.from(commandRegistry.values())
    .filter(command => command.widgetId === widgetId);
}

// Get all available commands
export function getAllWidgetCommands(): WidgetCommand[] {
  return Array.from(commandRegistry.values());
}

// Find and execute a command
export async function executeWidgetCommand(
  commandId: string, 
  params: any
): Promise<any> {
  const command = commandRegistry.get(commandId);
  
  if (!command) {
    throw new Error(`Widget command not found: ${commandId}`);
  }
  
  return command.execute(params);
}
```

### Designing Widget APIs for AI Control

Create widgets with explicit APIs for AI control:

```tsx
// widgets/ChartWidget/ChartWidget.tsx
import React, { useEffect, useRef, useState } from 'react';
import { registerWidgetCommand } from '../../services/widgetCommandRegistry';
import Chart from 'chart.js';

interface ChartWidgetProps {
  id: string;
  title: string;
  initialType?: 'bar' | 'line' | 'pie';
  initialData?: any;
}

// Widget that exposes APIs for AI control
const ChartWidget: React.FC<ChartWidgetProps> = ({
  id,
  title,
  initialType = 'bar',
  initialData = {}
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState(initialType);
  const [chartData, setChartData] = useState(initialData);
  
  // Register commands when widget mounts
  useEffect(() => {
    // Register a command to change chart type
    registerWidgetCommand({
      id: `${id}:setChartType`,
      widgetId: id,
      name: 'Change Chart Type',
      description: 'Changes the visualization type of the chart',
      parameters: {
        type: {
          type: 'string',
          description: 'Chart type (bar, line, pie)',
          required: true
        }
      },
      execute: async (params) => {
        const { type } = params;
        if (!['bar', 'line', 'pie'].includes(type)) {
          throw new Error(`Invalid chart type: ${type}`);
        }
        
        setChartType(type);
        return { success: true, newType: type };
      }
    });
    
    // Register a command to update chart data
    registerWidgetCommand({
      id: `${id}:updateData`,
      widgetId: id,
      name: 'Update Chart Data',
      description: 'Updates the data displayed in the chart',
      parameters: {
        data: {
          type: 'object',
          description: 'Chart data object',
          required: true
        }
      },
      execute: async (params) => {
        const { data } = params;
        setChartData(data);
        return { success: true };
      }
    });
    
    // Clean up commands when widget unmounts
    return () => {
      // Logic to unregister commands
    };
  }, [id]);
  
  // Initialize and update chart when data or type changes
  useEffect(() => {
    if (chartRef.current) {
      // Create or update chart with current data and type
    }
  }, [chartData, chartType]);
  
  return (
    <div className="chart-widget">
      <h2>{title}</h2>
      <canvas ref={chartRef} />
      
      {/* User controls for the chart */}
      <div className="chart-controls">
        <select 
          value={chartType}
          onChange={(e) => setChartType(e.target.value as any)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
    </div>
  );
};

export default ChartWidget;
```

### Widget Event Broadcasting

Allow widgets to broadcast events that AI can monitor:

```tsx
// services/widgetEventBus.ts
type EventCallback = (data: any) => void;

class WidgetEventBus {
  private listeners: Map<string, Map<string, EventCallback>> = new Map();
  
  // Subscribe to widget events
  subscribe(eventType: string, subscriberId: string, callback: EventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Map());
    }
    
    this.listeners.get(eventType)!.set(subscriberId, callback);
    
    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners) {
        eventListeners.delete(subscriberId);
        if (eventListeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }
  
  // Publish widget events
  publish(eventType: string, data: any) {
    const eventListeners = this.listeners.get(eventType);
    
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in widget event listener for ${eventType}:`, error);
        }
      });
    }
  }
}

// Singleton instance
export const widgetEventBus = new WidgetEventBus();

// Hook for components to use the event bus
import { useEffect } from 'react';

export function useWidgetEvents(
  widgetId: string,
  eventHandlers: Record<string, (data: any) => void>
) {
  useEffect(() => {
    // Create array to hold unsubscribe functions
    const unsubscribers: Array<() => void> = [];
    
    // Subscribe to each event
    Object.entries(eventHandlers).forEach(([eventType, handler]) => {
      const unsubscribe = widgetEventBus.subscribe(
        eventType,
        `${widgetId}:${eventType}`,
        handler
      );
      
      unsubscribers.push(unsubscribe);
    });
    
    // Clean up subscriptions on unmount
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [widgetId, eventHandlers]);
}
```

## AI-Widget Communication Patterns

### 1. Direct Command Execution

Allow AI to execute widget commands directly:

```tsx
// Example of AI directly executing widget commands
import { executeWidgetCommand } from '../services/widgetCommandRegistry';

// AI assistant function
async function handleAIRequest(request) {
  // Parse AI request to determine intent
  const { intent, params } = parseAIRequest(request);
  
  if (intent === 'add_task') {
    // Execute widget command based on AI intent
    try {
      const result = await executeWidgetCommand('taskWidget:addTask', {
        title: params.taskName,
        description: params.taskDescription,
        dueDate: params.dueDate
      });
      
      return {
        success: true,
        message: `Task added successfully with ID: ${result.taskId}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add task: ${error.message}`
      };
    }
  }
  
  // Handle other intents...
}
```

### 2. Widget State Observation

Enable the AI to observe widget state changes:

```tsx
// Connecting AI assistant to widget events
import { widgetEventBus } from '../services/widgetEventBus';

// Subscribe AI to widget events
function connectAIToWidgetEvents(aiInstance) {
  // Listen for task creation events
  widgetEventBus.subscribe(
    'task:created',
    'ai-assistant',
    (taskData) => {
      aiInstance.processEvent({
        type: 'TASK_CREATED',
        data: taskData
      });
    }
  );
  
  // Listen for task completion events
  widgetEventBus.subscribe(
    'task:completed',
    'ai-assistant',
    (taskData) => {
      aiInstance.processEvent({
        type: 'TASK_COMPLETED',
        data: taskData
      });
    }
  );
  
  // Additional event subscriptions...
}
```

### 3. Widget Capability Discovery

Allow AI to discover widget capabilities dynamically:

```tsx
// services/widgetCapabilityRegistry.ts
import { getAllWidgetCommands } from './widgetCommandRegistry';

// Generate capability description for AI to understand widget functions
export function generateWidgetCapabilityDescription() {
  const commands = getAllWidgetCommands();
  const capabilities = commands.map(command => ({
    id: command.id,
    name: command.name,
    description: command.description,
    widget: command.widgetId,
    parameters: Object.entries(command.parameters).map(([name, param]) => ({
      name,
      type: param.type,
      description: param.description,
      required: param.required
    }))
  }));
  
  return {
    availableCommands: capabilities,
    commandCount: capabilities.length,
    widgetCount: new Set(commands.map(cmd => cmd.widgetId)).size
  };
}

// AI can query this to understand what widgets can do
async function getAIActionContext() {
  const capabilities = generateWidgetCapabilityDescription();
  
  return {
    context: {
      availableWidgets: capabilities.widgetCount,
      availableCommands: capabilities.commandCount,
      commandDetails: capabilities.availableCommands
    }
  };
}
```

## Building AI-Ready Widgets

### Design Patterns for AI-Ready Widgets

1. **Command Controller Pattern**

```tsx
// widgets/DataGrid/DataGridCommandController.ts
import { registerWidgetCommand } from '../../services/widgetCommandRegistry';

// Separate controller for widget commands
export class DataGridCommandController {
  private widgetId: string;
  private dataHandler: any;
  
  constructor(widgetId: string, dataHandler: any) {
    this.widgetId = widgetId;
    this.dataHandler = dataHandler;
    this.registerCommands();
  }
  
  // Register all commands this widget supports
  private registerCommands() {
    registerWidgetCommand({
      id: `${this.widgetId}:filter`,
      widgetId: this.widgetId,
      name: 'Filter Data',
      description: 'Filter the data grid by column values',
      parameters: {
        column: {
          type: 'string',
          description: 'Column name to filter',
          required: true
        },
        value: {
          type: 'string',
          description: 'Value to filter by',
          required: true
        }
      },
      execute: async (params) => this.filterData(params)
    });
    
    // Register other commands...
  }
  
  // Command implementation
  private async filterData(params: any) {
    const { column, value } = params;
    return this.dataHandler.filter(column, value);
  }
  
  // Other command implementations...
}

// Usage in widget component
const DataGridWidget = ({ id }) => {
  // Widget implementation
};

// Enhanced with AI control
const AIControlledDataGridWidget = withAIControl(DataGridWidget, {
  capabilities: ['filterData', 'sortData', 'updateData']
});

// Use in your application
<AIControlledDataGridWidget 
  id="dashboard-data-grid" 
  type="dataGridWidget"
  initialState={{ data: [] }}
/>
```

2. **Stateful Widget Registry**

```tsx
// services/widgetRegistry.ts
// Keep track of active widget instances and their state
const activeWidgets = new Map<string, {
  type: string;
  state: any;
  commands: string[];
}>();

export function registerWidget(id: string, type: string, initialState: any) {
  activeWidgets.set(id, {
    type,
    state: initialState,
    commands: []
  });
}

export function updateWidgetState(id: string, newState: any) {
  const widget = activeWidgets.get(id);
  if (widget) {
    activeWidgets.set(id, {
      ...widget,
      state: { ...widget.state, ...newState }
    });
  }
}

export function getWidgetState(id: string) {
  return activeWidgets.get(id)?.state;
}

export function getAllWidgetsOfType(type: string) {
  return Array.from(activeWidgets.entries())
    .filter(([_, widget]) => widget.type === type)
    .map(([id, widget]) => ({
      id,
      state: widget.state
    }));
}
```

### Widget Integration with AI Assistant

Design widgets to work seamlessly with the AI assistant:

```tsx
// components/AIControlled/AIControlledWidget.tsx
import React, { useEffect } from 'react';
import { registerWidget, updateWidgetState } from '../../services/widgetRegistry';
import { widgetEventBus } from '../../services/widgetEventBus';

// HOC to make widgets AI-controllable
export function withAIControl(WrappedComponent, options = {}) {
  return function AIControlledWidget(props) {
    const { id, type } = props;
    
    // Register widget when mounted
    useEffect(() => {
      registerWidget(id, type, props.initialState || {});
      
      // Notify AI that a new widget is available
      widgetEventBus.publish('widget:mounted', {
        id,
        type,
        capabilities: options.capabilities || []
      });
      
      return () => {
        // Notify AI that widget is being removed
        widgetEventBus.publish('widget:unmounted', { id, type });
      };
    }, [id, type]);
    
    // Update widget registry when state changes
    const handleStateChange = (newState) => {
      updateWidgetState(id, newState);
      
      // Notify AI about state change
      widgetEventBus.publish('widget:stateChanged', {
        id,
        type,
        state: newState
      });
      
      // Call original onStateChange if provided
      if (props.onStateChange) {
        props.onStateChange(newState);
      }
    };
    
    return (
      <WrappedComponent
        {...props}
        onStateChange={handleStateChange}
      />
    );
  };
}

// Usage example
const TaskWidget = ({ id, tasks = [], onStateChange }) => {
  // Widget implementation
};

// Enhanced with AI control
const AIControlledTaskWidget = withAIControl(TaskWidget, {
  capabilities: ['addTask', 'completeTask', 'deleteTask']
});

// Use in your application
<AIControlledTaskWidget 
  id="dashboard-tasks" 
  type="taskWidget"
  initialState={{ tasks: [] }}
/>
```

## Testing AI-Controllable Widgets

### Unit Testing Widget Commands

```tsx
// __tests__/widgets/TaskWidget/commands.test.ts
import { registerTaskWidgetCommands } from '../../../widgets/TaskWidget/commands';
import { executeWidgetCommand } from '../../../services/widgetCommandRegistry';

describe('Task Widget Commands', () => {
  const widgetId = 'test-task-widget';
  
  beforeAll(() => {
    // Register commands for testing
    registerTaskWidgetCommands(widgetId);
  });
  
  it('should add a task successfully', async () => {
    const result = await executeWidgetCommand(`${widgetId}:addTask`, {
      title: 'Test Task',
      description: 'Task created by test'
    });
    
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('taskId');
  });
  
  it('should fail when adding task without title', async () => {
    await expect(
      executeWidgetCommand(`${widgetId}:addTask`, {
        description: 'Missing title'
      })
    ).rejects.toThrow();
  });
  
  it('should complete a task successfully', async () => {
    const addResult = await executeWidgetCommand(`${widgetId}:addTask`, {
      title: 'Task to complete'
    });
    
    const completeResult = await executeWidgetCommand(`${widgetId}:completeTask`, {
      taskId: addResult.taskId
    });
    
    expect(completeResult).toHaveProperty('success', true);
  });
});
```

### Mock AI Interaction Testing

```tsx
// __tests__/integration/aiWidgetInteraction.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react';
import { executeWidgetCommand } from '../../services/widgetCommandRegistry';
import { ChartWidget } from '../../widgets/ChartWidget';

describe('AI-Widget Interaction', () => {
  it('should update chart type via command execution', async () => {
    const { getByTestId } = render(
      <ChartWidget 
        id="test-chart" 
        title="Test Chart" 
        initialType="bar"
      />
    );
    
    // Get initial chart element
    const chart = getByTestId('chart-canvas');
    expect(chart).toHaveAttribute('data-type', 'bar');
    
    // Execute command as AI would
    await act(async () => {
      await executeWidgetCommand('test-chart:setChartType', {
        type: 'pie'
      });
    });
    
    // Check that chart type was updated
    expect(chart).toHaveAttribute('data-type', 'pie');
  });
  
  it('should handle invalid command parameters', async () => {
    render(
      <ChartWidget 
        id="test-chart" 
        title="Test Chart" 
        initialType="bar"
      />
    );
    
    // Attempt to set invalid chart type
    await expect(
      executeWidgetCommand('test-chart:setChartType', {
        type: 'invalid-type'
      })
    ).rejects.toThrow('Invalid chart type');
  });
});
```

## Best Practices

1. **Command Consistency**
   - Use consistent naming conventions for commands
   - Follow similar parameter structures across widgets
   - Document command behavior thoroughly

2. **State Management**
   - Keep widget state observable and predictable
   - Broadcast meaningful state changes
   - Use immutable state patterns

3. **Error Handling**
   - Validate command parameters thoroughly
   - Return detailed error information
   - Handle partial successes gracefully

4. **Performance**
   - Optimize for frequent command execution
   - Batch state updates when possible
   - Consider throttling high-frequency events

5. **Security**
   - Validate command inputs to prevent injection
   - Implement permission checks for sensitive operations
   - Audit and log AI-triggered actions

## Conclusion

By following these patterns, your widgets will be fully controllable by AI assistants, enabling powerful automation and intelligence features in your application. This approach maintains separation of concerns while creating a consistent interface for AI interaction.

For information on database integration, see the [Database Integration](./14-database-integration.md) guide.
