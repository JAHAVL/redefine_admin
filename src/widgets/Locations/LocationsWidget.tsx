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
} from './actions';
import './LocationsWidget.css';

// SweetAlert2 type definition
interface SweetAlertResult {
  isConfirmed: boolean;
  isDenied?: boolean;
  isDismissed?: boolean;
  value?: any;
}

interface SweetAlertOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  allowOutsideClick?: boolean;
  didOpen?: (element: HTMLElement) => void;
}

// Mock SweetAlert2 for TypeScript - in a real app, you would install the package
const Swal = {
  fire: (options: SweetAlertOptions): Promise<SweetAlertResult> => {
    // This is just a mock for TypeScript
    // In a real app, this would be the actual SweetAlert2 library
    console.log('SweetAlert options:', options);
    if (options.didOpen) {
      // Mock the HTML element
      options.didOpen(document.createElement('div'));
    }
    return Promise.resolve({ isConfirmed: true });
  },
  showLoading: () => {
    console.log('SweetAlert showLoading called');
  }
};

const LocationsWidget: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);
  
  // Filter locations when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);
  
  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching locations from API...');
      const fetchedLocations = await getLocations();
      console.log('API response for locations:', fetchedLocations);
      
      // Check if we got valid data
      if (Array.isArray(fetchedLocations) && fetchedLocations.length > 0) {
        console.log(`Found ${fetchedLocations.length} locations`);
        setLocations(fetchedLocations);
        setFilteredLocations(fetchedLocations);
      } else {
        console.warn('No locations found in API response');
        // Show a message to the user
        Swal.fire({
          title: 'No Locations Found',
          text: 'No locations exist yet. Create your first location to get started.',
          icon: 'info'
        });
        // Initialize with empty arrays instead of sample data for production
        setLocations([]);
        setFilteredLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Show a more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Swal.fire({
        title: 'Connection Error',
        text: `Failed to load locations: ${errorMessage}. Please check your network connection and try again.`,
        icon: 'error'
      });
      // Initialize with empty arrays
      setLocations([]);
      setFilteredLocations([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  
  const handleAddLocation = () => {
    setEditingLocation(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };
  


  const handleDeleteLocation = (locationId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          // Show loading indicator
          Swal.fire({
            title: 'Deleting Location',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          const success = await deleteLocation(locationId);
          if (success) {
            // Update both locations and filtered locations
            setLocations(prev => prev.filter(loc => loc.id !== locationId));
            setFilteredLocations(prev => prev.filter(loc => loc.id !== locationId));
            
            Swal.fire({
              title: 'Deleted!',
              text: 'Location has been deleted.',
              icon: 'success'
            });
          } else {
            throw new Error('Server indicated deletion failed');
          }
        } catch (error) {
          console.error('Error deleting location:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          Swal.fire({
            title: 'Error',
            text: `Failed to delete location: ${errorMessage}`,
            icon: 'error'
          });
        }
      }
    });
  };
  
  const handleFormSubmit = async (formData: LocationFormData) => {
    console.log('LocationsWidget received form submission:', formData);
    
    // Ensure all required fields have values
    const processedFormData = {
      ...formData,
      latitude: formData.latitude || 40.7128, // Default to NYC if not provided
      longitude: formData.longitude || -74.0060,
      max_distance_to_notify: formData.max_distance_to_notify || 1000 // Default value
    };
    
    console.log('Processed form data:', processedFormData);
    
    try {
      if (editingLocation) {
        console.log('Updating existing location:', editingLocation.id);
        // Show loading indicator
        Swal.fire({
          title: 'Updating Location',
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Update existing location
        const updatedLocation = await updateLocation(editingLocation.id, processedFormData);
        console.log('Update response:', updatedLocation);
        
        if (updatedLocation) {
          setLocations(prev => 
            prev.map(loc => loc.id === editingLocation.id ? updatedLocation : loc)
          );
          setFilteredLocations(prev => 
            prev.map(loc => loc.id === editingLocation.id ? updatedLocation : loc)
          );
          Swal.fire({
            title: 'Success',
            text: 'Location updated successfully',
            icon: 'success'
          });
          setIsModalOpen(false);
          setEditingLocation(undefined);
        } else {
          throw new Error('Failed to update location');
        }
      } else {
        console.log('Creating new location');
        // Show loading indicator
        Swal.fire({
          title: 'Creating Location',
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Create new location
        try {
          const newLocation = await createLocation(processedFormData);
          console.log('Create response:', newLocation);
          
          if (newLocation) {
            setLocations(prev => [...prev, newLocation]);
            setFilteredLocations(prev => [...prev, newLocation]);
            Swal.fire({
              title: 'Success',
              text: 'Location created successfully',
              icon: 'success'
            });
            setIsModalOpen(false);
            setEditingLocation(undefined);
          } else {
            throw new Error('API returned null or undefined');
          }
        } catch (error) {
          console.error('Error creating location:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          Swal.fire({
            title: 'Error',
            text: `Failed to create location: ${errorMessage}`,
            icon: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error saving location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Swal.fire({
        title: 'Error',
        text: `Failed to save location: ${errorMessage}`,
        icon: 'error'
      });
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="locations-widget" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      overflow: 'hidden',
      color: 'white',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="locations-header" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        borderBottom: '1px solid rgba(80, 80, 80, 0.7)',
        gap: '16px'
      }}>
        <div className="locations-title-section" style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: '180px',
          fontSize: '16px'
        }}>
          <h2 className="locations-title" style={{ margin: 0, fontSize: '16px' }}>Locations</h2>
        </div>
        
        <div className="locations-search" style={{
          flex: 1,
          maxWidth: '500px',
          margin: 0
        }}>
          <input 
            className="locations-search-input" 
            type="text" 
            placeholder="Search locations..." 
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '24px',
              border: '1px solid rgba(80, 80, 80, 0.7)',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              color: 'white',
              fontSize: '14px',
              transition: 'all 0.2s',
              paddingLeft: '40px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '12px center'
            }}
          />
        </div>
        
        <div className="locations-actions" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="locations-action-button" 
            onClick={handleAddLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: 'rgba(50, 50, 50, 0.7)',
              border: '1px solid rgba(80, 80, 80, 0.7)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              gap: '8px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 448 512">
              <path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
            </svg> Add Location
          </button>
          
          <button 
            className="locations-action-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: 'rgba(50, 50, 50, 0.7)',
              border: '1px solid rgba(80, 80, 80, 0.7)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              gap: '8px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 512 512">
              <path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
            </svg> Filter
          </button>
          
          <div className="locations-view-toggle" style={{ display: 'flex', gap: '4px' }}>
            <button 
              className={`locations-view-button ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: viewMode === 'grid' ? 'rgba(70, 70, 70, 0.7)' : 'rgba(50, 50, 50, 0.7)',
                border: '1px solid rgba(80, 80, 80, 0.7)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 512 512">
                <path fill="currentColor" d="M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"></path>
              </svg>
            </button>
            <button 
              className={`locations-view-button ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: viewMode === 'list' ? 'rgba(70, 70, 70, 0.7)' : 'rgba(50, 50, 50, 0.7)',
                border: '1px solid rgba(80, 80, 80, 0.7)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 512 512">
                <path fill="currentColor" d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path>
              </svg>
            </button>
          </div>
        </div>
        

      </div>
      
      <div className="locations-content" style={{
        backgroundColor: 'transparent',
        flex: 1,
        overflow: 'auto',
        padding: '16px',
        position: 'relative'
      }}>
        {isLoading ? (
          <div className="locations-loading" style={{ color: 'white', textAlign: 'center', padding: '24px' }}>Loading locations...</div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="locations-grid">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map(location => (
                    <LocationCard 
                      key={location.id}
                      location={location}
                      onEdit={handleEditLocation}
                      onDelete={handleDeleteLocation}
                    />
                  ))
                ) : (
                  <div className="locations-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p className="locations-empty-text">No locations found</p>
                    <button className="locations-empty-button" onClick={handleAddLocation}>Add Location</button>
                  </div>
                )}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="locations-list">
                <LocationsTable 
                  locations={filteredLocations}
                  onEdit={handleEditLocation}
                  onDelete={handleDeleteLocation}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal for adding/editing locations */}
      <LocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? 'Edit Location' : 'Add New Location'}
      >
        <LocationForm 
          location={editingLocation}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </LocationModal>
      

    </div>
  );
};

export default LocationsWidget;
