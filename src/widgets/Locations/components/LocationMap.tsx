import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Location } from '../types/types';
import './google-maps.d.ts'; // Import from local file

// Define type aliases for better readability and maintainability
type GoogleMap = google.maps.Map;       // Google Maps main map object
type GoogleMarker = google.maps.Marker; // Google Maps marker object

// We're only using these types inline with the google.maps namespace

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onMarkerClick?: (location: Location) => void;
  height?: string | number;
  zoom?: number;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  selectedLocation,
  onMarkerClick,
  height = '400px',
  zoom = 12,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);

  // Load Google Maps script when component mounts
  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY && !window.google) {
      loadGoogleMapsScript(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    }
  }, []);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      zoom,
      center: {
        lat: locations[0]?.latitude || 40.7128,
        lng: locations[0]?.longitude || -74.0060,
      },
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ] as google.maps.MapTypeStyle[],
    });

    mapInstance.current = map;

    // Add markers
    markersRef.current = locations.map((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map,
        title: location.name,
        animation: google.maps.Animation.DROP,
      });

      if (onMarkerClick) {
        google.maps.event.addListener(marker, 'click', () => onMarkerClick(location));
      }

      return marker;
    });

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend(new google.maps.LatLng(location.latitude, location.longitude));
      });
      map.fitBounds(bounds);
    }

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [locations, onMarkerClick, zoom]);

  // Update selected marker
  useEffect(() => {
    if (!window.google || !mapInstance.current || !selectedLocation) return;

    // Reset all markers
    markersRef.current.forEach((marker) => {
      marker.setIcon(undefined);
    });

    // Find and highlight selected marker
    const selectedMarker = markersRef.current.find(
      (marker) => {
        const position = marker.getPosition();
        return position && 
               position.lat() === selectedLocation.latitude &&
               position.lng() === selectedLocation.longitude;
      }
    );

    if (selectedMarker) {
      selectedMarker.setIcon({
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(40, 40),
      });
      
      // Pan to selected marker
      mapInstance.current.panTo({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      });
    }
  }, [selectedLocation]);

  return (
    <Box sx={{ width: '100%', height, position: 'relative' }}>
{!window.google && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            zIndex: 1,
          }}
        >
          <Typography>Loading map...</Typography>
        </Box>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

// Add Google Maps script to the document
const loadGoogleMapsScript = (apiKey: string) => {
  if (document.querySelector('#google-maps-script')) return;
  
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    console.error('Error loading Google Maps API');
  };
  document.head.appendChild(script);
};

// Google Maps script loading is now handled inside the component
