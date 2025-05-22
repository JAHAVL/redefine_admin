import React from 'react';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Using direct imports for TaskManager components
import TaskManagerWidget from '../../widgets/TaskManagerWidget/TaskManagerWidget';

/**
 * Task Manager Page component
 * Uses MainPageTemplate with TaskManagerWidget directly embedded
 */
const TaskManagerPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Task Manager">
      <TaskManagerWidget />
    </MainPageTemplate>
  );
};

export default TaskManagerPageNEW;
