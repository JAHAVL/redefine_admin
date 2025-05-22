import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    CardContent, 
    Typography, 
    CardActions, 
    Box, 
    IconButton, 
    Tooltip
} from '@mui/material';
import { 
    LocationOn as LocationIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { Location } from '../types/types';

interface LocationCardProps {
    location: Location;
    onViewDetails: (location: Location) => void;
    onEdit: (location: Location) => void;
    onDelete: (id: string) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ 
    location, 
    onViewDetails, 
    onEdit, 
    onDelete 
}) => {
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement>(null);
    
    // Initialize map when component mounts
    useEffect(() => {
        if (typeof window.google === 'undefined' || !mapRef.current) return;
        
        try {
            // Initialize the map with a clean, minimal style
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: 14,
                center: { lat: location.latitude, lng: location.longitude },
                disableDefaultUI: true,
                scrollwheel: false,
                zoomControl: true,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#ffffff' }]
                    },
                    {
                        featureType: 'all',
                        elementType: 'labels.text.stroke',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'administrative',
                        elementType: 'geometry',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'landscape',
                        elementType: 'geometry',
                        stylers: [{ color: '#202020' }]
                    },
                    {
                        featureType: 'poi',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#393939' }]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'all',
                        stylers: [{ visibility: 'off' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#121212' }]
                    }
                ]
            });
            
            // Add a marker for the location
            const marker = new window.google.maps.Marker({
                position: { lat: location.latitude, lng: location.longitude },
                map: map,
                title: location.name,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3478ff',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 8
                }
            });
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }, [location.latitude, location.longitude, location.name]);
    
    return (
        <Card 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--card-background, #242424)',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                }
            }}
            onClick={() => navigate(`/locations/details/${location.id}`)}
        >
            {/* Map Area */}
            <Box
                ref={mapRef}
                sx={{
                    height: '180px',
                    width: '100%',
                    position: 'relative',
                    borderBottom: '1px solid var(--border-color, #393737)'
                }}
            >
                {/* Fallback if Google Maps is not loaded */}
                {typeof window.google === 'undefined' && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'var(--accent-color, #333)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <LocationIcon sx={{ fontSize: 40, color: 'var(--primary-color, #3478ff)' }} />
                    </Box>
                )}
            </Box>
            
            {/* Location Name */}
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                        fontWeight: 600, 
                        color: 'var(--text-light, #ffffff)',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {location.name}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}
                >
                    <LocationIcon fontSize="small" />
                    {location.city}, {location.state}
                </Typography>
            </CardContent>
            
            {/* Action Buttons */}
            <CardActions sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                p: 1,
                borderTop: '1px solid var(--border-color, #393737)',
                backgroundColor: 'var(--secondary-background, #1e1e1e)'
            }}>
                <Tooltip title="View Details">
                    <IconButton 
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/locations/details/${location.id}`);
                        }}
                        sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.7))' }}
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton 
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(location);
                        }}
                        sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.7))' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton 
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(location.id);
                        }}
                        sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.7))' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};
