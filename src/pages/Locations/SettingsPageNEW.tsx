import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import SettingsWidgetFixed from '../../widgets/Locations/SettingsWidgetFixed';

/**
 * Settings Page component
 * Uses our fixed version of the SettingsWidget directly within MainPageTemplate
 */
const SettingsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations Settings">
      <SettingsWidgetFixed />
    </MainPageTemplate>
  );
};

export default SettingsPageNEW;
