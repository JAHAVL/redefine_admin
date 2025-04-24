import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import MapViewWidgetFixed from '../../widgets/Locations/MapViewWidgetFixed';

/**
 * Map View Page component
 * Uses our fixed version of the MapViewWidget directly within MainPageTemplate
 */
const MapViewPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations Map">
      <MapViewWidgetFixed />
    </MainPageTemplate>
  );
};

export default MapViewPageNEW;
