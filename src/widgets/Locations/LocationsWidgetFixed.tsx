import React, { useState, useEffect } from 'react';
import { Location, LocationFormData, ViewMode } from './types';
import LocationCard from './components/LocationCard';
import LocationsTable from './components/LocationsTable';
import LocationForm from './components/LocationForm';
import LocationModal from './components/LocationModal';
import { 
  getLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from './mock-actions';
import './LocationsWidget.css';

// Simple alert implementation to avoid external dependencies
const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  alert(`${type.toUpperCase()}: ${message}`);
  return { isConfirmed: true };
};

/**
 * LocationsWidget component - fixed version without problematic imports
 */
const LocationsWidgetFixed: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // Load locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Function to fetch locations
  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
      setIsError(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Function to open the modal for adding/editing
  const handleOpenModal = (location: Location | null = null) => {
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLocation(null);
  };

  // Function to handle location deletion
  const handleDeleteLocation = async (locationId: string) => {
    const confirmResult = window.confirm('Are you sure you want to delete this location?');
    
    if (confirmResult) {
      try {
        await deleteLocation(locationId);
        // Update locations list
        fetchLocations();
        showAlert('Location deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting location:', error);
        showAlert('Failed to delete location', 'error');
      }
    }
  };

  // Function to handle form submission for create/update
  const handleFormSubmit = async (data: LocationFormData) => {
    try {
      if (currentLocation) {
        // Update existing location
        await updateLocation(currentLocation.id, data);
        showAlert('Location updated successfully', 'success');
      } else {
        // Create new location
        await createLocation(data);
        showAlert('Location created successfully', 'success');
      }
      
      // Close modal and refresh data
      handleCloseModal();
      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
      showAlert('Failed to save location', 'error');
    }
  };

  // Content to show while loading
  if (isLoading && locations.length === 0) {
    return (
      <div className="locations-widget">
        <div className="loading-indicator">Loading locations...</div>
      </div>
    );
  }

  // Content to show on error
  if (isError && locations.length === 0) {
    return (
      <div className="locations-widget error-state">
        <div className="error-message">
          <h3>Error Loading Locations</h3>
          <p>There was a problem loading the locations data.</p>
          <button onClick={fetchLocations}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="locations-widget">
      {/* Header with actions */}
      <div className="widget-header">
        <h2>Locations</h2>
        <div className="header-actions">
          <div className="view-toggles">
            <button 
              className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
            >
              Grid View
            </button>
            <button 
              className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('table')}
            >
              Table View
            </button>
          </div>
          <button className="add-location-btn" onClick={() => handleOpenModal()}>
            Add Location
          </button>
        </div>
      </div>

      {/* Locations display based on view mode */}
      <div className="locations-content">
        {viewMode === 'grid' ? (
          <div className="locations-grid">
            {locations.map(location => (
              <LocationCard 
                key={location.id} 
                location={location} 
                onEdit={() => handleOpenModal(location)} 
                onDelete={handleDeleteLocation} 
              />
            ))}
          </div>
        ) : (
          <LocationsTable 
            locations={locations} 
            onEdit={handleOpenModal} 
            onDelete={handleDeleteLocation} 
          />
        )}
      </div>

      {/* Modal for adding/editing locations */}
      {isModalOpen && (
        <LocationModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={currentLocation ? 'Edit Location' : 'Add New Location'}
        >
          <LocationForm 
            initialData={currentLocation || undefined} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseModal} 
          />
        </LocationModal>
      )}
    </div>
  );
};

export default LocationsWidgetFixed;
