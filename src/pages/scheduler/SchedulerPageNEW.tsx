import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { SchedulerWidget } from '../../widgets/schedulerwidget';

/**
 * Scheduler Page component
 * Uses MainPageTemplate with SchedulerWidget directly embedded
 * Note: SchedulerWidget handles its own internal routing for different scheduler views
 */
const SchedulerPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Scheduler">
      <SchedulerWidget />
    </MainPageTemplate>
  );
};

export default SchedulerPageNEW;
