import React, { useState } from 'react';
import './TaskManagerWidget.css';

// Import icons if available, otherwise use text fallbacks
let Plus: any;
let Filter: any;
let Check: any;
let Clock: any;
let AlertCircle: any;
let MoreVertical: any;

try {
  const icons = require('lucide-react');
  Plus = icons.Plus;
  Filter = icons.Filter;
  Check = icons.Check;
  Clock = icons.Clock;
  AlertCircle = icons.AlertCircle;
  MoreVertical = icons.MoreVertical;
} catch (error) {
  // Fallback if lucide-react is not available
  Plus = () => <span>+</span>;
  Filter = () => <span>⚙️</span>;
  Check = () => <span>✓</span>;
  Clock = () => <span>⏱️</span>;
  AlertCircle = () => <span>⚠️</span>;
  MoreVertical = () => <span>⋮</span>;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
}

const TaskManagerWidget: React.FC = () => {
  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Update website content',
      description: 'Update the church website with new sermon series information',
      status: 'todo',
      priority: 'high',
      dueDate: '2023-08-15',
      assignee: 'John Doe'
    },
    {
      id: 2,
      title: 'Prepare Sunday bulletin',
      description: 'Create and print Sunday bulletin for upcoming service',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2023-08-12',
      assignee: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Order communion supplies',
      description: 'Order new communion supplies for next month',
      status: 'completed',
      priority: 'low',
      dueDate: '2023-08-05',
      assignee: 'Mike Johnson'
    },
    {
      id: 4,
      title: 'Schedule volunteer training',
      description: 'Set up training session for new volunteers',
      status: 'todo',
      priority: 'high',
      dueDate: '2023-08-20',
      assignee: 'Sarah Williams'
    },
    {
      id: 5,
      title: 'Follow up with new visitors',
      description: 'Send welcome emails to visitors from last Sunday',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2023-08-10',
      assignee: 'John Doe'
    }
  ]);

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={14} className="priority-icon high" />;
      case 'medium':
        return <Clock size={14} className="priority-icon medium" />;
      case 'low':
        return <Check size={14} className="priority-icon low" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="task-manager-widget">
      <div className="widget-header">
        <h2>Task Manager</h2>
        <div className="widget-actions">
          <button className="filter-button">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="add-button">
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="task-board">
        <div className="task-column">
          <div className="column-header">
            <h3>To Do</h3>
            <span className="task-count">{todoTasks.length}</span>
          </div>
          <div className="task-list">
            {todoTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <div className="task-priority">
                    {getPriorityIcon(task.priority)}
                    <span className="due-date">{formatDate(task.dueDate)}</span>
                  </div>
                  <button className="task-menu-button">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h4 className="task-title">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <div className="task-assignee">{task.assignee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header">
            <h3>In Progress</h3>
            <span className="task-count">{inProgressTasks.length}</span>
          </div>
          <div className="task-list">
            {inProgressTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <div className="task-priority">
                    {getPriorityIcon(task.priority)}
                    <span className="due-date">{formatDate(task.dueDate)}</span>
                  </div>
                  <button className="task-menu-button">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h4 className="task-title">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <div className="task-assignee">{task.assignee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header">
            <h3>Completed</h3>
            <span className="task-count">{completedTasks.length}</span>
          </div>
          <div className="task-list">
            {completedTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <div className="task-priority">
                    {getPriorityIcon(task.priority)}
                    <span className="due-date">{formatDate(task.dueDate)}</span>
                  </div>
                  <button className="task-menu-button">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h4 className="task-title">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <div className="task-assignee">{task.assignee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagerWidget;
