import React, { useState, useEffect, useRef } from 'react';
import { Location, LocationFormData } from '../types';
import './LocationForm.css';

// Google Maps types
declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        LatLngBounds: new () => any;
        InfoWindow: new (options: any) => any;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
        places: {
          SearchBox: new (input: HTMLInputElement) => any;
        };
      };
    };
    $?: any; // For jQuery and DataTables
  }
}

interface GooglePlace {
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
    viewport?: any;
  };
  name?: string;
  formatted_address?: string;
}

interface LocationFormProps {
  location?: Location;
  onSubmit: (formData: LocationFormData) => void;
  onCancel: () => void;
}



const LocationForm: React.FC<LocationFormProps> = ({ location, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    latitude: null,
    longitude: null,
    max_distance_to_notify: null
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize form data if editing an existing location
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        max_distance_to_notify: location.max_distance_to_notify
      });
    }
  }, [location]);
  
  // Load Google Maps API and initialize map
  useEffect(() => {
    console.log('LocationForm mounted');
    setIsMapLoading(true);
    
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      setIsMapLoading(false);
      initMap();
      return;
    }
    
    // Function to load Google Maps API
    const loadGoogleMapsAPI = () => {
      // Create a script element to load the Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Set up callback for when the script loads
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        setIsMapLoading(false);
        initMap();
      };
      
      // Handle errors
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setIsMapLoading(false);
        setErrors(prev => [...prev, 'Failed to load Google Maps. Please try again later.']);
      };
      
      // Add the script to the document
      document.head.appendChild(script);
    };
    
    // In a real application, we would load the API
    // For now, we'll simulate it for development
    const timer = setTimeout(() => {
      console.log('Map loading complete (simulated)');
      setIsMapLoading(false);
      // Uncomment the line below to actually load the API in production
      // loadGoogleMapsAPI();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // Handle address input with auto-fill for coordinates
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log('Address changed:', value);
    
    setFormData(prev => ({
      ...prev,
      address: value
    }));
    
    // In a real application, we would use the Google Places API for autocomplete
    // For now, we'll simulate it for development purposes
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      // If Google Maps API is not loaded, use our fallback
      if (value.length > 10) {
        console.log('Auto-filling coordinates (fallback)');
        // Simulate geocoding with some sample coordinates
        const sampleCoordinates = {
          'New York': { lat: 40.7128, lng: -74.0060 },
          'Los Angeles': { lat: 34.0522, lng: -118.2437 },
          'Chicago': { lat: 41.8781, lng: -87.6298 },
          'Houston': { lat: 29.7604, lng: -95.3698 },
          'Phoenix': { lat: 33.4484, lng: -112.0740 }
        };
        
        // Find a matching city name in our sample data
        const matchingCity = Object.keys(sampleCoordinates).find(city => 
          value.toLowerCase().includes(city.toLowerCase())
        );
        
        if (matchingCity) {
          const coords = sampleCoordinates[matchingCity as keyof typeof sampleCoordinates];
          setFormData(prev => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng
          }));
        } else {
          // Default to NYC if no match
          setFormData(prev => ({
            ...prev,
            latitude: 40.7128,
            longitude: -74.0060
          }));
        }
      }
    }
    // Note: When Google Maps API is loaded, the Places SearchBox will handle this
  };
  
  const initMap = () => {
    if (typeof window === 'undefined' || !window.google || !mapRef.current) return;
    
    try {
      // Create a map centered at the location or default to a central location
      const mapOptions = {
        center: formData.latitude && formData.longitude 
          ? { lat: formData.latitude, lng: formData.longitude }
          : { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#242f3e' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242f3e' }, { lightness: 10 }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
          }
        ]
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Create a marker for the current location if coordinates exist
      if (formData.latitude && formData.longitude && window.google) {
        new window.google.maps.Marker({
          map,
          position: { lat: formData.latitude, lng: formData.longitude },
          title: formData.name || 'Selected location',
          animation: window.google.maps.Animation?.DROP || null
        });
      }
      
      // Add search box functionality if Google Places API is available
      if (window.google?.maps?.places && addressInputRef.current) {
        // Create the search box and link it to the UI element
        const searchBox = window.google?.maps?.places ? new window.google.maps.places.SearchBox(addressInputRef.current) : null;
        if (!searchBox) return;
        
        // Bias the SearchBox results towards current map's viewport
        map.addListener('bounds_changed', () => {
          searchBox.setBounds(map.getBounds());
        });
        
        let markers: any[] = [];
        
        // Listen for the event fired when the user selects a prediction
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          
          if (!places || places.length === 0) {
            console.log('No places found');
            return;
          }
          
          // Clear out the old markers
          markers.forEach(marker => marker?.setMap(null));
          markers = [];
          
          // For each place, get the icon, name and location
          const bounds = window.google?.maps ? new window.google.maps.LatLngBounds() : null;
          if (!bounds) return;
          
          places.forEach((place: GooglePlace) => {
            if (!place || !place.geometry || !place.geometry.location) {
              console.log('Returned place contains no geometry');
              return;
            }
            
            // Create a marker for the place
            const marker = window.google?.maps ? new window.google.maps.Marker({
              map,
              title: place.name || 'Selected location',
              position: place.geometry.location,
              animation: window.google?.maps?.Animation?.DROP || null
            }) : null;
            
            if (!marker) return;
            
            markers.push(marker);
            
            // Update form data with the selected place's coordinates and address
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            // Get the full address from the place
            const address = place.formatted_address || place.name || '';
            
            setFormData(prev => ({
              ...prev,
              address: address,
              latitude: lat,
              longitude: lng
            }));
            
            // Add info window to the marker
            const infoWindow = window.google?.maps?.InfoWindow ? new window.google.maps.InfoWindow({
              content: `<div><strong>${place.name || 'Selected location'}</strong><br>${address}</div>`
            }) : null;
            
            if (infoWindow) {
              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
            }
            
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          
          if (bounds) {
            map.fitBounds(bounds);
            const currentZoom = map.getZoom();
            if (currentZoom !== undefined) {
              map.setZoom(Math.min(currentZoom, 15)); // Zoom out a bit if too close
            }
          }
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setErrors(prev => [...prev, 'Failed to initialize map. Please try again later.']);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for address field
    if (name === 'address') {
      handleAddressChange(e);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' || name === 'max_distance_to_notify'
        ? parseFloat(value) || null
        : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Validate form
    const validationErrors: string[] = [];
    
    if (!formData.name) {
      validationErrors.push('Name is required');
    }
    
    if (!formData.address) {
      validationErrors.push('Address is required');
    }
    
    if (formData.latitude === null) {
      validationErrors.push('Latitude is required');
    } else if (formData.latitude < -90 || formData.latitude > 90) {
      validationErrors.push('Latitude must be between -90 and 90');
    }
    
    if (formData.longitude === null) {
      validationErrors.push('Longitude is required');
    } else if (formData.longitude < -180 || formData.longitude > 180) {
      validationErrors.push('Longitude must be between -180 and 180');
    }
    
    // Set a default value for max_distance_to_notify if it's null
    if (formData.max_distance_to_notify === null) {
      setFormData(prev => ({
        ...prev,
        max_distance_to_notify: 1000 // Default value
      }));
    } else if (formData.max_distance_to_notify < 0) {
      validationErrors.push('Max distance to notify must be a positive number');
    }
    
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }
    
    // Submit form if validation passes
    console.log('Form validation passed, submitting...');
    onSubmit(formData);
  };
  
  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <div className="location-form-header">
        <h3 className="location-form-title">{location ? 'Edit' : 'New'}</h3>
      </div>
      
      {errors.length > 0 && (
        <div className="location-error-container">
          {errors.map((error, index) => (
            <div className="location-error-message" key={index}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          ))}
        </div>
      )}
      
      <div className="location-form-group">
        <label className="location-form-label">Name</label>
        <input
          className="location-form-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Location name"
        />
      </div>
      
      <div className="location-form-group">
        <label className="location-form-label">Address</label>
        <input
          className="location-form-input"
          ref={addressInputRef}
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Type address (10+ chars to auto-fill)"
        />
      </div>
      
      <div className="location-form-group">
        <div className="location-map-container" ref={mapRef}>
          {isMapLoading && (
            <div className="location-map-loading">
              <div className="location-map-loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="location-form-row">
        <div className="location-form-column">
          <label className="location-form-label">Lat</label>
          <input
            className="location-form-input"
            type="number"
            name="latitude"
            value={formData.latitude === null ? '' : formData.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            step="any"
          />
        </div>
        
        <div className="location-form-column">
          <label className="location-form-label">Long</label>
          <input
            className="location-form-input"
            type="number"
            name="longitude"
            value={formData.longitude === null ? '' : formData.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            step="any"
          />
        </div>
      </div>
      
      <div className="location-form-group">
        <label className="location-form-label">Max Distance (m)</label>
        <input
          className="location-form-input"
          type="number"
          name="max_distance_to_notify"
          value={formData.max_distance_to_notify === null ? '' : formData.max_distance_to_notify}
          onChange={handleChange}
          placeholder="Distance in meters"
        />
      </div>
      
      <div className="location-button-container">
        <button className="location-cancel-button" type="button" onClick={onCancel}>Cancel</button>
        <button 
          className="location-submit-button" 
          type="submit"
          onClick={(e) => {
            console.log('Submit button clicked');
            // The form's onSubmit handler will be called automatically
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {location ? (
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            ) : (
              <path d="M12 5v14M5 12h14"></path>
            )}
          </svg>
          {location ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default LocationForm;
