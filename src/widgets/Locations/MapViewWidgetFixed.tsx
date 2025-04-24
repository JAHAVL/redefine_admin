import React, { useState, useEffect } from 'react';
import { Location } from './types';
import { getLocations } from './mock-actions';
import './LocationsWidget.css';

/**
 * Map View Widget - Fixed version with no problematic dependencies
 */
const MapViewWidgetFixed: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Load locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Function to fetch locations
  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
      if (data.length > 0) {
        setSelectedLocation(data[0]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  // Show loading state
  if (isLoading && !mapLoaded) {
    return (
      <div className="map-view-widget loading">
        <div className="loading-indicator">Loading map and locations data...</div>
      </div>
    );
  }

  return (
    <div className="map-view-widget">
      <div className="widget-header">
        <h2>Location Map</h2>
        <div className="map-controls">
          <button className="map-btn">Zoom In</button>
          <button className="map-btn">Zoom Out</button>
          <button className="map-btn">Reset View</button>
        </div>
      </div>

      <div className="map-container" style={{ 
        height: '500px', 
        backgroundColor: '#e9f1f7',
        borderRadius: '8px',
        padding: '15px',
        position: 'relative'
      }}>
        {/* Simulated Map */}
        <div className="simulated-map" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#e9f1f7',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Map background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-96.7,38.5,3/1200x600?access_token=pk.placeholder")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }}></div>

          {/* Location markers */}
          {locations.map(location => (
            <div 
              key={location.id}
              className={`location-marker ${selectedLocation?.id === location.id ? 'selected' : ''}`}
              style={{
                position: 'absolute',
                left: `${30 + Math.random() * 70}%`,
                top: `${20 + Math.random() * 60}%`,
                width: '20px',
                height: '20px',
                backgroundColor: location.status === 'Active' ? '#4CAF50' : '#FF9800',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 4px rgba(255,255,255,0.5)',
                cursor: 'pointer',
                zIndex: selectedLocation?.id === location.id ? 2 : 1,
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleLocationSelect(location)}
            ></div>
          ))}
        </div>

        {/* Location info panel */}
        {selectedLocation && (
          <div className="location-info-panel" style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '300px',
            zIndex: 3
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{selectedLocation.name}</h3>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{selectedLocation.address}</p>
            <p style={{ margin: '5px 0' }}>
              Status: 
              <span style={{ 
                color: selectedLocation.status === 'Active' ? 'green' : 'orange',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {selectedLocation.status}
              </span>
            </p>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <button style={{
                padding: '5px 10px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>Details</button>
              <button style={{
                padding: '5px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>Get Directions</button>
            </div>
          </div>
        )}
      </div>

      {/* Location list */}
      <div className="locations-list" style={{ marginTop: '20px' }}>
        <h3>All Locations</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {locations.map(location => (
            <div 
              key={location.id} 
              className={`location-item ${selectedLocation?.id === location.id ? 'selected' : ''}`}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedLocation?.id === location.id ? '#e9f1f7' : '#f5f5f5',
                borderRadius: '4px',
                cursor: 'pointer',
                border: selectedLocation?.id === location.id ? '1px solid #4CAF50' : '1px solid transparent'
              }}
              onClick={() => handleLocationSelect(location)}
            >
              <strong>{location.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapViewWidgetFixed;
