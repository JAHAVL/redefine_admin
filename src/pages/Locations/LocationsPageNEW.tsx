import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import LocationsWidgetFixed from '../../widgets/Locations/LocationsWidgetFixed';

/**
 * Locations Page component
 * Uses the fixed version of the LocationsWidget that avoids problematic imports
 */
const LocationsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations">
      <LocationsWidgetFixed />
    </MainPageTemplate>
  );
};

export default LocationsPageNEW;
