import React from 'react';
import SchedulerPageTemplate from '../../templates/page-templates/schedulerpagetemplate';
import { SchedulerWidget } from '../../widgets/schedulerwidget';

const SchedulerPage: React.FC = () => {
  return (
    <SchedulerPageTemplate>
      <SchedulerWidget />
    </SchedulerPageTemplate>
  );
};

export default SchedulerPage;
