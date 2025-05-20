import React, { useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    IconButton,
    Grid,
    Divider,
    Chip,
    Paper,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as WebsiteIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    OpenInNew as OpenInNewIcon,
    Directions as DirectionsIcon,
    AccessTime as AccessTimeIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { Location } from '../types/types';

interface LocationDetailsModalProps {
    open: boolean;
    onClose: () => void;
    location: Location | null;
    onEdit: (location: Location) => void;
    onDelete: (id: string) => void;
}

export const LocationDetailsModal: React.FC<LocationDetailsModalProps> = ({
    open,
    onClose,
    location,
    onEdit,
    onDelete
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);

    // Format phone number for display
    const formatPhone = (phone: string): string => {
        if (!phone) return '';
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Initialize map when component mounts
    useEffect(() => {
        if (!window.google || !mapRef.current || !location) return;
        
        // Initialize the map
        const mapOptions = {
            zoom: 14,
            center: { lat: location.latitude, lng: location.longitude },
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
            scrollwheel: true,
            zoomControl: true,
            streetViewControl: true,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        };
        
        // Create map instance
        // Type assertion to avoid Google Maps API version mismatch
const map = new window.google.maps.Map(mapRef.current, mapOptions) as unknown as google.maps.Map;
        mapInstance.current = map;
        
        // Add a marker for the location
        const marker = new window.google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map as any,
            title: location.name,
            animation: window.google.maps.Animation.DROP,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: 'var(--primary-color, #3478ff)',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
                scale: 8
            }
        });
        
        markerRef.current = marker;
        
        // Add an info window with the location name
        const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="color: #333; font-weight: 500; padding: 5px;">${location.name}</div>`
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map as any, marker as any);
        });
        
        // Open the info window by default
        infoWindow.open(map as any, marker as any);
        
        // Cleanup when component unmounts
        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
        };
    }, [location, open]);

    if (!location) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--app-background, #181818)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color, #393737)'
                }
            }}
        >
            <DialogTitle sx={{ 
                backgroundColor: 'var(--secondary-color, #202020)',
                borderBottom: '1px solid var(--border-color, #393737)',
                padding: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ 
                        bgcolor: 'var(--primary-color, #3478ff)',
                        color: 'white',
                        width: 40,
                        height: 40,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                        <LocationIcon />
                    </Avatar>
                    <Typography variant="h5" component="h2" sx={{ 
                        fontWeight: 700,
                        color: 'var(--text-light, #ffffff)'
                    }}>
                        {location.name}
                    </Typography>
                    <Chip
                        label={location.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                            backgroundColor: location.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            color: location.isActive ? '#4caf50' : '#f44336',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '24px'
                        }}
                    />
                </Box>
                <IconButton onClick={onClose} aria-label="close" size="large" sx={{ 
                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-light, #ffffff)'
                    }
                }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ 
                p: 0,
                backgroundColor: 'var(--app-background, #181818)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                overflow: 'hidden'
            }}>
                {/* Left Column - Map */}
                <Box sx={{ 
                    width: { xs: '100%', md: '50%' },
                    height: { xs: '250px', md: '500px' },
                    position: 'relative'
                }}>
                    <Box 
                        ref={mapRef}
                        sx={{ 
                            height: '100%',
                            width: '100%'
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1
                    }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<DirectionsIcon />}
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, '_blank')}
                            sx={{
                                backgroundColor: 'var(--primary-color, #3478ff)',
                                '&:hover': {
                                    backgroundColor: 'var(--primary-dark, #2a60cc)'
                                },
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Directions
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewIcon />}
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`, '_blank')}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'var(--primary-color, #3478ff)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                },
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            View in Google Maps
                        </Button>
                    </Box>
                </Box>

                {/* Right Column - Details */}
                <Box sx={{ 
                    width: { xs: '100%', md: '50%' },
                    p: 3,
                    overflowY: 'auto',
                    maxHeight: { xs: 'auto', md: '500px' },
                    borderLeft: { xs: 'none', md: '1px solid var(--border-color, #393737)' }
                }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                        color: 'var(--text-light, #ffffff)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <InfoIcon sx={{ color: 'var(--primary-color, #3478ff)' }} fontSize="small" />
                        Location Information
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <Paper sx={{ 
                                p: 2, 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                border: '1px solid var(--border-color, #393737)',
                                borderRadius: '8px'
                            }}>
                                <Typography variant="subtitle2" sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    mb: 0.5
                                }}>
                                    Address
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: 'var(--text-light, #ffffff)', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <LocationIcon sx={{ fontSize: 18, color: 'var(--primary-color, #3478ff)' }} />
                                    {location.address}, {location.city}, {location.state} {location.zipCode}
                                </Typography>
                            </Paper>
                        </Box>

                        {location.phone && (
                            <Box sx={{ width: { xs: '100%', sm: '50%' }, mb: 2, pr: { xs: 0, sm: 1 } }}>
                                <Paper sx={{ 
                                    p: 2, 
                                    backgroundColor: 'var(--secondary-color, #202020)',
                                    border: '1px solid var(--border-color, #393737)',
                                    borderRadius: '8px'
                                }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                        mb: 0.5
                                    }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        color: 'var(--text-light, #ffffff)', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <PhoneIcon sx={{ fontSize: 18, color: 'var(--primary-color, #3478ff)' }} />
                                        <a 
                                            href={`tel:${location.phone}`} 
                                            className="contact-link"
                                            style={{ 
                                                color: 'var(--text-light, #ffffff)', 
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {formatPhone(location.phone)}
                                        </a>
                                    </Typography>
                                </Paper>
                            </Box>
                        )}

                        {location.email && (
                            <Box sx={{ width: { xs: '100%', sm: '50%' }, mb: 2, pr: { xs: 0, sm: 1 } }}>
                                <Paper sx={{ 
                                    p: 2, 
                                    backgroundColor: 'var(--secondary-color, #202020)',
                                    border: '1px solid var(--border-color, #393737)',
                                    borderRadius: '8px'
                                }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                        mb: 0.5
                                    }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        color: 'var(--text-light, #ffffff)', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        wordBreak: 'break-word'
                                    }}>
                                        <EmailIcon sx={{ fontSize: 18, color: 'var(--primary-color, #3478ff)' }} />
                                        <a 
                                            href={`mailto:${location.email}`}
                                            className="contact-link"
                                            style={{ 
                                                color: 'var(--text-light, #ffffff)', 
                                                textDecoration: 'none',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {location.email}
                                        </a>
                                    </Typography>
                                </Paper>
                            </Box>
                        )}

                        {location.website && (
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <Paper sx={{ 
                                    p: 2, 
                                    backgroundColor: 'var(--secondary-color, #202020)',
                                    border: '1px solid var(--border-color, #393737)',
                                    borderRadius: '8px'
                                }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                        mb: 0.5
                                    }}>
                                        Website
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        color: 'var(--text-light, #ffffff)', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        wordBreak: 'break-word'
                                    }}>
                                        <WebsiteIcon sx={{ fontSize: 18, color: 'var(--primary-color, #3478ff)' }} />
                                        <a 
                                            href={location.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="website-link"
                                            style={{ 
                                                color: 'var(--primary-color, #3478ff)', 
                                                textDecoration: 'none',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {location.website}
                                        </a>
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                    </Box>

                    {location.description && (
                        <>
                            <Typography variant="h6" gutterBottom sx={{ 
                                color: 'var(--text-light, #ffffff)',
                                fontWeight: 600,
                                mt: 3
                            }}>
                                Description
                            </Typography>
                            <Paper sx={{ 
                                p: 2, 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                border: '1px solid var(--border-color, #393737)',
                                borderRadius: '8px',
                                mb: 3
                            }}>
                                <Typography variant="body1" sx={{ 
                                    color: 'var(--text-light, #ffffff)'
                                }}>
                                    {location.description}
                                </Typography>
                            </Paper>
                        </>
                    )}

                    <Typography variant="h6" gutterBottom sx={{ 
                        color: 'var(--text-light, #ffffff)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <AccessTimeIcon sx={{ color: 'var(--primary-color, #3478ff)' }} fontSize="small" />
                        Timestamps
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, mb: 2, pr: { xs: 0, sm: 1 } }}>
                            <Paper sx={{ 
                                p: 2, 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                border: '1px solid var(--border-color, #393737)',
                                borderRadius: '8px'
                            }}>
                                <Typography variant="subtitle2" sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    mb: 0.5
                                }}>
                                    Created
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: 'var(--text-light, #ffffff)'
                                }}>
                                    {formatDate(location.createdAt)}
                                </Typography>
                            </Paper>
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, mb: 2, pr: { xs: 0, sm: 1 } }}>
                            <Paper sx={{ 
                                p: 2, 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                border: '1px solid var(--border-color, #393737)',
                                borderRadius: '8px'
                            }}>
                                <Typography variant="subtitle2" sx={{ 
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                    mb: 0.5
                                }}>
                                    Last Updated
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: 'var(--text-light, #ffffff)'
                                }}>
                                    {formatDate(location.updatedAt)}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ 
                justifyContent: 'space-between',
                padding: 2,
                backgroundColor: 'var(--secondary-color, #202020)',
                borderTop: '1px solid var(--border-color, #393737)'
            }}>
                <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                        onDelete(location.id);
                        onClose();
                    }}
                    sx={{
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            borderColor: '#f44336'
                        },
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Delete
                </Button>
                <Box>
                    <Button
                        onClick={onClose}
                        sx={{
                            color: 'var(--text-light, #ffffff)',
                            mr: 1,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => {
                            onEdit(location);
                            onClose();
                        }}
                        sx={{
                            backgroundColor: 'var(--primary-color, #3478ff)',
                            '&:hover': {
                                backgroundColor: 'var(--primary-dark, #2a60cc)'
                            },
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Edit Location
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
