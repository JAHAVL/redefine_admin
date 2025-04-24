import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import AnalyticsWidgetFixed from '../../widgets/Locations/AnalyticsWidgetFixed';

/**
 * Analytics Page component
 * Uses our fixed version of the AnalyticsWidget directly within MainPageTemplate
 */
const AnalyticsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations Analytics">
      <AnalyticsWidgetFixed />
    </MainPageTemplate>
  );
};

export default AnalyticsPageNEW;
