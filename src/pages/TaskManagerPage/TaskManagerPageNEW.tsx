import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
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
