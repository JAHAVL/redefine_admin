import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Alert
} from '@mui/material';

// Import styled components
import {
  LocationsHeader,
  LocationsTitle,
  LocationsContent,
  LocationsButton,
  LocationsMapContainer,
  SearchInput,
  TabContainer,
  Tab
} from '../styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import LayersIcon from '@mui/icons-material/Layers';
import { getAllLocations } from '../../../services/locationsService';
import { Location } from '../types/types';

// Google Maps window declaration
interface GoogleMapWindow extends Window {
  google?: {
    maps: {
      Map: new (element: HTMLElement, options: any) => any;
      Marker: new (options: any) => any;
      LatLng: new (lat: number, lng: number) => any;
      InfoWindow: new (options?: any) => any;
      LatLngBounds: new (sw?: any, ne?: any) => any; // Make constructor params optional
      MapTypeId: {
        ROADMAP: string;
        SATELLITE: string;
        HYBRID: string;
        TERRAIN: string;
      };
      Animation: {
        DROP: number;
        BOUNCE: number;
      };
      SymbolPath: {
        CIRCLE: number;
        FORWARD_CLOSED_ARROW: number;
        FORWARD_OPEN_ARROW: number;
        BACKWARD_CLOSED_ARROW: number;
        BACKWARD_OPEN_ARROW: number;
      };
      event: {
        addListener: (instance: any, eventName: string, handler: Function) => any;
        removeListener: (listener: any) => void;
        clearInstanceListeners: (instance: any) => void;
      };
      places: any;
    };
  };
}

declare const window: GoogleMapWindow;

// Control panel styling
const MapControlPanel = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  zIndex: 10,
  padding: theme.spacing(2),
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  width: 300,
  maxHeight: 'calc(100% - 32px)',
  overflowY: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 32px)',
    top: 'auto',
    bottom: 16,
    maxHeight: 300
  }
}));

const MapControlButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

const RoundIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}));

// Props interface for MapView
interface MapViewProps {
  onUpdatePageTitle?: (title: string) => void;
}

/**
 * MapView component
 * Displays all locations on a map with filtering and search capabilities
 */
const MapView: React.FC<MapViewProps> = ({
  onUpdatePageTitle
}) => {
  // Refs for map elements
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const boundsRef = useRef<any>(null);

  // Theme for styling
  const theme = useTheme();
  
  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getAllLocations();
        setLocations(data);
        setFilteredLocations(data);
        setLoading(false);
        
        // Update page title
        if (onUpdatePageTitle) {
          onUpdatePageTitle('Locations Map');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [onUpdatePageTitle]);
  
  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainerRef.current || loading || filteredLocations.length === 0) return;
    
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      setError('Google Maps API is not loaded');
      return;
    }
    
    // Initialize map if not already initialized
    if (!mapRef.current && mapContainerRef.current && window.google) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 4,
        mapTypeId: mapType
      });
      
      // Create info window
      // Create info window and bounds only if Google Maps is available
      if (window.google && window.google.maps) {
        const googleMaps = window.google.maps;
        infoWindowRef.current = new googleMaps.InfoWindow();
        // Create bounds without arguments
        boundsRef.current = new googleMaps.LatLngBounds();
      }
    }
    
    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    
    // Reset bounds
    if (window.google && window.google.maps) {
      const googleMaps = window.google.maps;
      boundsRef.current = new googleMaps.LatLngBounds();
      // No arguments needed for LatLngBounds constructor
    }
    
    // Add markers for each location
    if (window.google && window.google.maps) {
      // Store google.maps in a local variable to help TypeScript understand it's defined
      const googleMaps = window.google.maps;
      
      filteredLocations.forEach(location => {
        if (location.latitude && location.longitude && mapRef.current && boundsRef.current) {
          const marker = new googleMaps.Marker({
            position: new googleMaps.LatLng(location.latitude, location.longitude),
            map: mapRef.current,
            title: location.name,
            animation: googleMaps.Animation.DROP,
            icon: {
              path: googleMaps.SymbolPath.CIRCLE,
              fillColor: location.isActive ? theme.palette.success.main : theme.palette.error.main,
              fillOpacity: 0.9,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: 10
            }
          });
          
          // Add marker to array
          markersRef.current.push(marker);
          
          // Extend bounds
          boundsRef.current.extend(marker.getPosition());
          
          // Add click listener
          marker.addListener('click', () => {
            // Set content for info window
            infoWindowRef.current.setContent(`
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">${location.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #555;">
                  ${location.address}<br />
                  ${location.city}, ${location.state} ${location.zipCode}
                </p>
                <p style="margin: 8px 0 0 0;">
                  <a href="#/locations/${location.id}" style="color: #1976d2; text-decoration: none; font-size: 14px;">
                    View Details
                  </a>
                </p>
              </div>
            `);
            
            // Open info window
            infoWindowRef.current.open(mapRef.current, marker);
            
            // Set selected location
            setSelectedLocation(location);
          });
        }
      });
    }
    
    // Fit bounds if there are markers
    if (markersRef.current.length > 0) {
      mapRef.current.fitBounds(boundsRef.current);
      
      // Don't zoom in too far
      if (mapRef.current && window.google && window.google.maps) {
        const googleMaps = window.google.maps;
        
        // Function to limit zoom level to prevent excessive zoom
        const limitZoom = () => {
          if (mapRef.current && typeof mapRef.current.getZoom === 'function' && mapRef.current.getZoom() > 16) {
            mapRef.current.setZoom(16);
          }
        };
        
        // Add a one-time listener to check and limit zoom when the map is idle
        if (typeof googleMaps.event.addListener === 'function') {
          const idleListener = googleMaps.event.addListener(mapRef.current, 'idle', () => {
            limitZoom();
            // Remove the listener after it's triggered
            googleMaps.event.removeListener(idleListener);
          });
        }
      }
    }
    
    setMapLoading(false);
  }, [filteredLocations, loading, theme.palette.success.main, theme.palette.error.main, mapType]);
  
  // Update map type
  useEffect(() => {
    if (mapRef.current && window.google && window.google.maps) {
      const googleMaps = window.google.maps;
      mapRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);
  
  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations(locations);
      return;
    }
    
    const filtered = locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);
  
  // Handle map type change
  const handleMapTypeChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    setMapType(event.target.value as string);
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };
  
  // Reset view
  const handleResetView = () => {
    if (mapRef.current && boundsRef.current) {
      mapRef.current.fitBounds(boundsRef.current);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 120px)" width="100%">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={4} width="100%" maxWidth="1400px" mx="auto">
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            '& .MuiAlert-icon': { fontSize: '2rem' } 
          }}
        >
          <Typography variant="h6">{error}</Typography>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{ 
        position: 'relative', 
        height: 'calc(100vh - 120px)', 
        width: '100%',
        overflow: 'hidden' 
      }}
    >
      {/* Map Container */}
      <Box 
        ref={mapContainerRef} 
        sx={{ 
          width: '100%', 
          height: '100%' 
        }}
      />
      
      {mapLoading && (
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}
      
      {/* Map Controls Panel */}
      <MapControlPanel elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Locations Map
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Search locations..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
        </Box>
        
        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
          <InputLabel id="map-type-label">Map Type</InputLabel>
          <Select
            labelId="map-type-label"
            id="map-type-select"
            value={mapType}
            onChange={handleMapTypeChange}
            label="Map Type"
          >
            <MenuItem value="roadmap">Road Map</MenuItem>
            <MenuItem value="satellite">Satellite</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
            <MenuItem value="terrain">Terrain</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Showing {filteredLocations.length} of {locations.length} locations
        </Typography>
        
        {selectedLocation && (
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {selectedLocation.name}
              </Typography>
              <Chip
                size="small"
                label={selectedLocation.isActive ? 'Active' : 'Inactive'}
                color={selectedLocation.isActive ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                {selectedLocation.address}<br />
                {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zipCode}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
                href={`#/locations/${selectedLocation.id}`}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        )}
      </MapControlPanel>
      
      {/* Map Control Buttons */}
      <MapControlButtons>
        <Tooltip title="Zoom In">
          <RoundIconButton onClick={handleZoomIn} size="medium" color="primary">
            <ZoomInIcon />
          </RoundIconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <RoundIconButton onClick={handleZoomOut} size="medium" color="primary">
            <ZoomOutIcon />
          </RoundIconButton>
        </Tooltip>
        <Tooltip title="Reset View">
          <RoundIconButton onClick={handleResetView} size="medium" color="primary">
            <MyLocationIcon />
          </RoundIconButton>
        </Tooltip>
        <Tooltip title="Change Map Type">
          <RoundIconButton
            onClick={(e) => e.currentTarget.blur()}
            size="medium"
            color="primary"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <LayersIcon />
          </RoundIconButton>
        </Tooltip>
      </MapControlButtons>
    </Box>
  );
};

export default MapView;
