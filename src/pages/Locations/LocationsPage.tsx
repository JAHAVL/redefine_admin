import React from 'react';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import LocationsWithQueryClient from '../../widgets/Locations';
import './LocationsPage.css';

/**
 * Main Locations page that displays the Locations widget
 */
const LocationsPage: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations">
      <div className="locations-container">
        <LocationsWithQueryClient />
      </div>
    </MainPageTemplate>
  );
};

export default LocationsPage;
