import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocationById } from '../../../services/locationsService';
import { Location } from '../types/types';
import { 
    Button, Typography, Box, Divider, Alert,
    Paper, Card, CardContent, Avatar, Stack, Tooltip,
    List, ListItem, ListItemIcon, ListItemText, IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled, useTheme } from '@mui/material/styles';

// Import custom components
import LocationStatusChip from '../components/LocationStatusChip';

// Styled components for the dashboard UI
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
    height: '100%',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    overflow: 'hidden',
}));

const CardHeaderSection = styled(Box)(({ theme }) => ({
    padding: '18px 20px',
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const IconContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    marginRight: '16px',
}));

// No need for a custom StatusChip as we're using the imported LocationStatusChip component

interface GoogleMapWindow extends Window {
    google?: {
        maps: {
            Map: new (element: HTMLElement, options: any) => any;
            Marker: new (options: any) => any;
            LatLng: new (lat: number, lng: number) => any;
            InfoWindow: new (options: any) => any;
            LatLngBounds: new () => any;
            MapTypeId: {
                ROADMAP: string;
            };
            Animation: {
                DROP: number;
                BOUNCE: number;
            };
            places: any;
        };
    };
}

declare const window: GoogleMapWindow;

interface LocationDetailsViewProps {
    locationId: string;
    onUpdatePageTitle?: (title: string) => void;
}

/**
 * Component to display detailed information about a specific location
 * Designed to be used within the Locations widget
 */
const LocationDetailsView: React.FC<LocationDetailsViewProps> = ({ 
    locationId, 
    onUpdatePageTitle 
}) => {
    // Navigation hook for routing
    const navigate = useNavigate();
    
    // Create a ref for the Google Maps container
    const mapContainerRef = useRef<HTMLDivElement>(null);
    
    // Theme hook for styling
    const theme = useTheme();
    
    // State for location data
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                if (!locationId) {
                    throw new Error('Location ID is required');
                }

                setLoading(true);
                const locationData = await getLocationById(locationId);
                
                if (!locationData) {
                    throw new Error('Location not found');
                }

                setLocation(locationData);
                setLoading(false);
                
                // Update the page title with the location name
                if (onUpdatePageTitle && locationData.name) {
                    onUpdatePageTitle(locationData.name);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchLocationData();
    }, [locationId, onUpdatePageTitle]);

    useEffect(() => {
        // Initialize Google Maps when location data is available
        if (location && mapContainerRef.current) {
            const initializeMap = () => {
                if (!mapContainerRef.current || !window.google) {
                    return;
                }

                const { latitude, longitude } = location;
                const mapOptions = {
                    center: new window.google.maps.LatLng(latitude, longitude),
                    zoom: 15,
                    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    scrollwheel: true,
                    draggable: true,
                    styles: [
                        {
                            featureType: 'administrative',
                            elementType: 'geometry',
                            stylers: [{ visibility: 'simplified' }]
                        },
                        {
                            featureType: 'poi',
                            stylers: [{ visibility: 'simplified' }]
                        }
                    ]
                };

                const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
                const marker = new window.google.maps.Marker({
                    position: new window.google.maps.LatLng(latitude, longitude),
                    map,
                    title: location.name,
                    animation: window.google.maps.Animation.DROP,
                });

                // Display info window when marker is clicked
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div style="padding:12px;"><strong>${location.name}</strong><br>${location.address}, ${location.city}</div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
                
                // Open info window by default
                infoWindow.open(map, marker);
            };

            if (window.google) {
                initializeMap();
            }
        }
    }, [location]);

    const handleEditClick = () => {
        if (location && location.id) {
            navigate(`/locations/edit/${location.id}`);
        }
    };

    const handleBackClick = () => {
        navigate('/locations');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)" width="100%">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, width: '100%' }}>
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3, 
                        '& .MuiAlert-icon': { fontSize: '1.5rem' } 
                    }}
                >
                    <Typography variant="h6">{error}</Typography>
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    size="medium"
                >
                    Back to Locations
                </Button>
            </Box>
        );
    }

    if (!location) {
        return (
            <Box sx={{ p: 3, width: '100%' }}>
                <Alert 
                    severity="warning"
                    sx={{ 
                        mb: 3, 
                        '& .MuiAlert-icon': { fontSize: '1.5rem' } 
                    }}
                >
                    <Typography variant="h6">Location not found</Typography>
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    size="medium"
                >
                    Back to Locations
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header with Actions */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3, 
                    gap: 2,
                    width: '100%'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/locations')}
                        sx={{ 
                            mr: 2,
                            borderRadius: '8px',
                            fontWeight: 600
                        }}
                    >
                        Back
                    </Button>
                    
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        {location?.name}
                        {location && <LocationStatusChip isActive={location.isActive} size="medium" />}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/locations/edit/${locationId}`)}
                    sx={{ 
                        borderRadius: '8px',
                        fontWeight: 600,
                        boxShadow: 2
                    }}
                >
                    Edit Location
                </Button>
            </Box>

            {/* Mobile title - only visible on small screens */}
            {location && (
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 600, 
                        mb: 3, 
                        display: { xs: 'block', md: 'none' } 
                    }}
                >
                    {location.name}
                </Typography>
            )}

            {/* Main Content */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Left Column - Location Information */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)', lg: '0 0 calc(42% - 12px)' } }}>
                    <StyledCard>
                        <CardHeaderSection>
                            <Typography variant="h6" fontWeight={600}>
                                Location Details
                            </Typography>
                        </CardHeaderSection>
                        <CardContent sx={{ p: 0 }}>
                            <List disablePadding>
                                <ListItem 
                                    sx={{ 
                                        py: 2, 
                                        px: 3, 
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                        backgroundColor: alpha(theme.palette.background.default, 0.4)
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                        <IconContainer>
                                            <LocationOnIcon />
                                        </IconContainer>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Address
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" fontWeight={500}>
                                                {location?.address}<br />
                                                {location?.city}, {location?.state} {location?.zipCode}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                {location?.phone && (
                                    <ListItem 
                                        sx={{ 
                                            py: 2, 
                                            px: 3, 
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                            <IconContainer>
                                                <PhoneIcon />
                                            </IconContainer>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Phone
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body1" fontWeight={500}>
                                                    {location?.phone}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                {location?.email && (
                                    <ListItem 
                                        sx={{ 
                                            py: 2, 
                                            px: 3, 
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                            <IconContainer>
                                                <EmailIcon />
                                            </IconContainer>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Email
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body1" fontWeight={500}>
                                                    {location?.email}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                {location?.website && (
                                    <ListItem 
                                        sx={{ 
                                            py: 2, 
                                            px: 3, 
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                            <IconContainer>
                                                <LanguageIcon />
                                            </IconContainer>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Website
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body1" fontWeight={500}>
                                                    <a 
                                                        href={location?.website || '#'} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                                                    >
                                                        {location?.website}
                                                    </a>
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}

                                <ListItem 
                                    sx={{ 
                                        py: 2, 
                                        px: 3, 
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                        <IconContainer>
                                            <BusinessIcon />
                                        </IconContainer>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Status
                                            </Typography>
                                        }
                                        secondary={
                                            location ? (
                                                <LocationStatusChip 
                                                    isActive={location.isActive} 
                                                    size="small" 
                                                />
                                            ) : null
                                        }
                                    />
                                </ListItem>

                                <ListItem 
                                    sx={{ 
                                        py: 2, 
                                        px: 3, 
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                        <IconContainer>
                                            <AccessTimeIcon />
                                        </IconContainer>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Created At
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" fontWeight={500}>
                                                {location?.createdAt ? new Date(location.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'N/A'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem 
                                    sx={{ 
                                        py: 2, 
                                        px: 3, 
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                        <IconContainer>
                                            <AccessTimeIcon />
                                        </IconContainer>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Last Updated
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" fontWeight={500}>
                                                {new Date(location.updatedAt).toLocaleString()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                {location.description && (
                                    <ListItem 
                                        sx={{ 
                                            py: 2, 
                                            px: 3, 
                                            flexDirection: 'column',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <IconContainer sx={{ mt: 0.5 }}>
                                                <InfoIcon />
                                            </IconContainer>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Description
                                            </Typography>
                                        </Box>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                pl: 7, 
                                                pr: 2,
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {location.description}
                                        </Typography>
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </StyledCard>
                </Box>

                {/* Right Column - Map */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)', lg: '0 0 calc(58% - 12px)' } }}>
                    <StyledCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeaderSection>
                            <Typography variant="h6" fontWeight={600}>
                                Location Map
                            </Typography>
                        </CardHeaderSection>
                        <Box
                            ref={mapContainerRef}
                            sx={{
                                flex: 1,
                                minHeight: '400px',
                                position: 'relative',
                                width: '100%',
                                bgcolor: 'background.paper',
                            }}
                        />
                    </StyledCard>
                </Box>
            </Box>
        </Box>
    );
};

export default LocationDetailsView;
