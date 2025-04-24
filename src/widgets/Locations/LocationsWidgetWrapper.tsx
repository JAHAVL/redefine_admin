import React, { useState, useEffect } from 'react';
import './LocationsWidgetWrapper.css';

/**
 * A wrapper for the LocationsWidget that handles loading errors
 * and provides fallback UI when the widget fails to load
 */
const LocationsWidgetWrapper: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const [LocationsWidget, setLocationsWidget] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import the widget to isolate any loading errors
    import('./LocationsWidget')
      .then(module => {
        setLocationsWidget(() => module.default);
      })
      .catch(err => {
        console.error('Error loading LocationsWidget:', err);
        setError(err);
      });
  }, []);

  if (error) {
    return (
      <div className="locations-error-container">
        <h2>Unable to load Locations Widget</h2>
        <p>There was an error loading the Locations functionality. Please try refreshing the page.</p>
        <div className="error-details">
          <p><strong>Error Details:</strong> {error.message}</p>
        </div>
      </div>
    );
  }

  if (!LocationsWidget) {
    return (
      <div className="locations-loading">
        <p>Loading Locations...</p>
      </div>
    );
  }

  // Render the actual widget when loaded successfully
  return <LocationsWidget />;
};

export default LocationsWidgetWrapper;
