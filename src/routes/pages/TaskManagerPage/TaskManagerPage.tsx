import React from 'react';
import './TaskManagerPage.css';
import MainPageTemplate from '../../../components/MainPageTemplate/MainPageTemplate';
import TaskManagerWidget from '../../../widgets/TaskManagerWidget/TaskManagerWidget';

/**
 * Task Manager page component that integrates with MainPageTemplate
 * and displays the TaskManagerWidget
 */
const TaskManagerPage: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Task Manager">
      <div className="task-manager-container">
        <TaskManagerWidget />
      </div>
    </MainPageTemplate>
  );
};

export default TaskManagerPage;
