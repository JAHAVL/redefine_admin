import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { locationsQueryClient } from './queryClient';

// Material-UI Components - Import individually to avoid type issues
import { 
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    AlertColor,
    Skeleton,
    FormControl,
    FormGroup,
    FormControlLabel,
    Switch,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Fullscreen,
    CenterFocusStrong
} from '@mui/icons-material';

// Components
import { LocationCard } from './components/LocationCard';
import { LocationTable } from './components/LocationTable';
import { CreateLocationModal } from './components/modals/CreateLocationModal';
import LocationsToolbar from './components/LocationsToolbar';

// Types
import { Location, LocationFilters as LocationFiltersType, LocationViewMode, LocationFormData } from './types/types';

// Mock data for development
const mockLocations: Location[] = [
    {
        id: '1',
        name: 'Main Office',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.0060,
        phone: '(555) 123-4567',
        email: 'info@example.com',
        website: 'https://example.com',
        description: 'Our main office location',
        imageUrl: 'https://via.placeholder.com/400x200?text=Main+Office',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Downtown Branch',
        address: '456 Center Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90012',
        country: 'USA',
        latitude: 34.0522,
        longitude: -118.2437,
        phone: '(555) 987-6543',
        email: 'downtown@example.com',
        website: 'https://example.com/downtown',
        description: 'Downtown branch office',
        imageUrl: 'https://via.placeholder.com/400x200?text=Downtown',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'San Francisco Location',
        address: '789 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        country: 'USA',
        latitude: 37.7749,
        longitude: -122.4194,
        phone: '(555) 456-7890',
        email: 'sf@example.com',
        website: 'https://example.com/sf',
        description: 'Our San Francisco branch',
        imageUrl: 'https://via.placeholder.com/400x200?text=San+Francisco',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Fetch locations data
const fetchLocations = async (): Promise<Location[]> => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLocations;
};

// Extract cities and states for filters
const cities = Array.from(new Set(mockLocations.map(location => location.city)));
const states = Array.from(new Set(mockLocations.map(location => location.state)));

// Define snackbar state type
interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

// Main Locations component
const Locations: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine which view to show based on the current route
    const currentPath: string = location.pathname;
    const currentView: string = currentPath.split('/')[2] || 'default';
    
    // State
    const [viewMode, setViewMode] = useState<LocationViewMode>('grid');
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [filters, setFilters] = useState<LocationFiltersType>({
        searchTerm: '',
        city: '',
        state: '',
        status: ''
    });
    // Location details now handled by dedicated page
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });
    
    // Query data
    const { data: locations = [], isLoading, isError } = useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations
    });
    
    // Filter locations based on current filters after data is loaded
    const filteredLocations = useMemo(() => {
        return locations.filter(location => {
            const matchesSearch = !filters.searchTerm || 
                location.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                location.address.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                location.city.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                location.state.toLowerCase().includes(filters.searchTerm.toLowerCase());
                
            const matchesState = !filters.state || location.state === filters.state;
            const matchesCity = !filters.city || location.city === filters.city;
            const matchesStatus = !filters.status || 
                (filters.status === 'active' && location.isActive) || 
                (filters.status === 'inactive' && !location.isActive);
            
            return matchesSearch && matchesState && matchesCity && matchesStatus;
        });
    }, [locations, filters]);
    
    // Initialize map when on map view
    useEffect(() => {
        if (currentView === 'map' && mapContainerRef.current && typeof window.google !== 'undefined') {
            initializeMap(filteredLocations);
        }
    }, [currentView, filteredLocations]);
    
    // Initialize map with locations
    const initializeMap = (locationData: Location[]) => {
        if (!mapContainerRef.current || typeof window.google === 'undefined') return;
        
        try {
            // Initialize map
            const map = new window.google.maps.Map(mapContainerRef.current, {
                zoom: 4,
                center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                    {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{ color: "#263c3f" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#6b9a76" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#38414e" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#212a37" }],
                    },
                    {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#9ca5b3" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{ color: "#746855" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#1f2835" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#f3d19c" }],
                    },
                    {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{ color: "#2f3948" }],
                    },
                    {
                        featureType: "transit.station",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#17263c" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#515c6d" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.stroke",
                        stylers: [{ color: "#17263c" }],
                    },
                ]
            });
            
            // Bounds to fit all markers
            const bounds = new window.google.maps.LatLngBounds();
            
            // Add markers for all locations
            locationData.forEach(location => {
                const marker = new window.google.maps.Marker({
                    position: { lat: location.latitude, lng: location.longitude },
                    map: map,
                    title: location.name,
                    animation: google?.maps?.Animation?.DROP,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: location.isActive ? '#3478ff' : '#888888',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 8
                    }
                });
                
                // Add info window for each marker
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div style="padding: 10px; max-width: 200px;">
                            <h3 style="margin: 0 0 5px; font-size: 16px;">${location.name}</h3>
                            <p style="margin: 0 0 5px; font-size: 14px;">${location.address}</p>
                            <p style="margin: 0; font-size: 14px;">${location.city}, ${location.state} ${location.zipCode}</p>
                        </div>
                    `
                });
                
                // Add click event to show info window
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
                
                // Extend bounds to include this location
                bounds.extend({ lat: location.latitude, lng: location.longitude });
            });
            
            // Fit map to bounds if we have locations
            if (locationData.length > 0) {
                map.fitBounds(bounds);
                
                // Don't zoom in too far on only one marker
                if (map.getZoom() > 15) {
                    map.setZoom(15);
                }
            }
            
            setMapLoaded(true);
        } catch (error) {
            console.error('Error initializing map:', error);
            setMapLoaded(true); // Still set to true to remove loading indicator
        }
    };
    
    // filteredLocations is already defined with useMemo above

    // Handlers
    const handleViewModeChange = (newMode: LocationViewMode): void => {
        setViewMode(newMode);
    };

    const handleCreateLocation = (): void => {
        setEditingLocation(null);
        setIsCreateModalOpen(true);
    };

    const handleEditLocation = (location: Location): void => {
        setEditingLocation(location);
        setIsCreateModalOpen(true);
    };
    
    const handleViewLocationDetails = (location: Location): void => {
        // Navigate to location details page instead of opening a modal
        navigate(`/locations/details/${location.id}`);
    };

    const handleDeleteLocation = (id: string): void => {
        // In a real app, you'd call an API to delete the location
        console.log('Delete location', id);
        
        // For demo, just show success message
        setSnackbar({
            open: true,
            message: 'Location deleted successfully',
            severity: 'success',
        });
        
        // Invalidate query cache to refresh the data
        queryClient.invalidateQueries({ queryKey: ['locations'] });
    };

    const handleSubmitLocation = async (formData: LocationFormData): Promise<void> => {
        // In a real app, you'd submit to an API endpoint
        console.log('Submit location', formData);
        
        // Close the modal
        setIsCreateModalOpen(false);
        
        // Show success message
        setSnackbar({
            open: true,
            message: editingLocation ? 'Location updated successfully' : 'Location created successfully',
            severity: 'success',
        });
        
        // Invalidate query cache to refresh the data
        queryClient.invalidateQueries({ queryKey: ['locations'] });
    };

    const handleCloseSnackbar = (): void => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFilterChange = (newFilters: LocationFiltersType): void => {
        setFilters(newFilters);
    };

    // Error state
    if (isError) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                    Error loading locations
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['locations'] })}
                >
                    Try Again
                </Button>
            </Box>
        );
    }
    
    // Loading state
    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'var(--border-color, #393737)', 
                    paddingBottom: 2,
                    position: 'relative'
                }}>
                    <Skeleton variant="text" width="200px" height="48px" sx={{ mb: 3 }} />
                    <Skeleton variant="rectangular" height="72px" sx={{ borderRadius: '16px', mb: 3 }} />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Box key={item}>
                            <Skeleton variant="rectangular" height="240px" sx={{ borderRadius: '12px' }} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with title */}
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'var(--border-color, #393737)', 
                paddingBottom: 2,
                mb: 3
            }}>
                {/* Toolbar only on main locations and map view */}
                {(currentView === 'default' || currentView === 'map') && (
                    <LocationsToolbar
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeChange}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onCreateLocation={handleCreateLocation}
                        filterableStates={states}
                        filterableCities={cities}
                    />
                )}
            </Box>
            
            {/* Route-specific content */}
            {currentView === 'default' && (
                <Box sx={{ mt: 2, width: '100%' }}>
                    {viewMode === 'grid' ? (
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { 
                            xs: '1fr', 
                            sm: 'repeat(2, 1fr)', 
                            md: 'repeat(3, 1fr)', 
                            lg: 'repeat(4, 1fr)' 
                        }, 
                        gap: 3,
                        width: '100%'
                    }}>
                        {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                                <Box key={location.id}>
                                    <LocationCard 
                                        location={location} 
                                        onViewDetails={() => handleViewLocationDetails(location)}
                                        onEdit={() => handleEditLocation(location)}
                                        onDelete={() => handleDeleteLocation(location.id)}
                                    />
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ 
                                width: '100%', 
                                textAlign: 'center', 
                                py: 6,
                                border: '1px dashed var(--border-color, #393737)',
                                borderRadius: '8px',
                                gridColumn: '1 / -1'
                            }}>
                                <Typography variant="h6" sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    fontWeight: 500,
                                    mb: 2 
                                }}>
                                    No locations found
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                                    maxWidth: '500px',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    Try adjusting your filters or create a new location to get started.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={handleCreateLocation}
                                    sx={{ 
                                        background: 'linear-gradient(45deg, var(--primary-color, #3478ff) 30%, var(--primary-light, #4a8fff) 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(52, 120, 255, 0.15)',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        py: 1,
                                        px: 3
                                    }}
                                >
                                    Add New Location
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <LocationTable 
                        locations={filteredLocations}
                        onEdit={handleEditLocation}
                        onDelete={handleDeleteLocation}
                        onRowClick={handleViewLocationDetails}
                    />
                )}
            </Box>
            )}
            
            {/* Map View */}
            {currentView === 'map' && (
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        width: '100%'
                    }}>
                        <Typography variant="h6" sx={{ color: 'var(--text-light, #ffffff)' }}>
                            Map View
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                size="small"
                                sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    '&:hover': { color: 'var(--text-light, #ffffff)' }
                                }}
                                title="Center Map"
                                onClick={() => {
                                    if (mapContainerRef.current && filteredLocations.length > 0) {
                                        initializeMap(filteredLocations);
                                    }
                                }}
                            >
                                <CenterFocusStrong fontSize="small" />
                            </IconButton>
                            <IconButton 
                                size="small"
                                sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    '&:hover': { color: 'var(--text-light, #ffffff)' }
                                }}
                                title="Toggle Fullscreen"
                            >
                                <Fullscreen fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    
                    <Box
                        id="map-container"
                        ref={mapContainerRef}
                        sx={{ 
                            height: '75vh', // Using viewport height for better scaling
                            width: '100%', 
                            backgroundColor: 'var(--card-background, #242424)',
                            border: '1px solid var(--border-color, #393737)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 0.3s ease'
                        }}
                    >
                        {!mapLoaded && (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: 2
                            }}>
                                <CircularProgress color="primary" />
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            
            {/* Analytics View */}
            {currentView === 'analytics' && (
                <Box sx={{ mt: 2 }}>
                    <Box 
                        sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
                            gap: 3, 
                            mb: 4 
                        }}
                    >
                        {/* Analytics cards */}
                        {['Total Locations', 'Active Locations', 'Top State', 'Top City'].map((title, index) => (
                            <Box 
                                key={index}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 2, 
                                    backgroundColor: 'var(--card-background, #242424)',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.7))' }}
                                >
                                    {title}
                                </Typography>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        mt: 1, 
                                        fontWeight: 700, 
                                        color: 'var(--text-light, #ffffff)' 
                                    }}
                                >
                                    {index === 0 && filteredLocations.length}
                                    {index === 1 && filteredLocations.filter(loc => loc.isActive).length}
                                    {index === 2 && states[0]}
                                    {index === 3 && cities[0]}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
                        <Box 
                            sx={{ 
                                p: 3, 
                                backgroundColor: 'var(--card-background, #242424)', 
                                borderRadius: 2,
                                height: '400px',
                                position: 'relative'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-light, #ffffff)' }}>
                                Locations by State
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: 'calc(100% - 40px)' 
                            }}>
                                <Typography variant="body1" sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.7))' }}>
                                    Chart integration will be implemented here
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box 
                            sx={{ 
                                p: 3, 
                                backgroundColor: 'var(--card-background, #242424)', 
                                borderRadius: 2,
                                height: '400px'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-light, #ffffff)' }}>
                                Status Distribution
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: 'calc(100% - 40px)' 
                            }}>
                                <Typography variant="body1" sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.7))' }}>
                                    Chart integration will be implemented here
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
            
            {/* Settings View */}
            {currentView === 'settings' && (
                <Box sx={{ mt: 2, width: '100%', maxWidth: '100%' }}>
                    <Box sx={{ mt: 2, p: 3, backgroundColor: 'var(--card-background, #242424)', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'var(--text-light, #ffffff)' }}>
                            Location Settings
                            Display Settings
                        </Typography>
                        <FormControl component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={true} onChange={() => {}} />}
                                    label="Show inactive locations"
                                />
                                <FormControlLabel
                                    control={<Switch checked={true} onChange={() => {}} />}
                                    label="Default to grid view"
                                />
                                <FormControlLabel
                                    control={<Switch checked={false} onChange={() => {}} />}
                                    label="Auto-refresh locations"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: 'var(--text-light, #ffffff)' }}>
                            Data Management
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Button 
                                variant="outlined" 
                                sx={{ 
                                    borderColor: 'var(--primary-color, #3478ff)',
                                    color: 'var(--primary-color, #3478ff)',
                                    '&:hover': {
                                        borderColor: 'var(--primary-light, #4a8fff)',
                                        backgroundColor: 'rgba(52, 120, 255, 0.05)'
                                    }
                                }}
                            >
                                Export Locations
                            </Button>
                            <Button 
                                variant="outlined" 
                                sx={{ 
                                    borderColor: 'var(--border-color, #393737)',
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    '&:hover': {
                                        borderColor: 'var(--text-light, #ffffff)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                Import Locations
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
            
            {/* Modals */}
            <CreateLocationModal 
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleSubmitLocation}
                initialData={editingLocation || undefined}
                title={editingLocation ? 'Edit Location' : 'Create New Location'}
                submitButtonText={editingLocation ? 'Update Location' : 'Create Location'}
            />
            
            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        '& .MuiAlert-icon': { 
                            alignItems: 'center' 
                        } 
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Wrap with QueryClientProvider
const LocationsWithQueryClient: React.FC = () => (
    <QueryClientProvider client={locationsQueryClient}>
        <Locations />
    </QueryClientProvider>
);

export default LocationsWithQueryClient;
