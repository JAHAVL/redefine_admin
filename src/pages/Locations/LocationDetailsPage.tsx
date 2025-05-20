import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import { getLocationById } from '../../widgets/Locations/api/api';
import { Location } from '../../widgets/Locations/types/types';
import { Button, Typography, Paper, Box, Divider, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Page that displays detailed information about a specific location
 */
const LocationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getLocationById(id);
        if (data) {
          setLocation(data);
        } else {
          setError('Location not found');
        }
      } catch (err) {
        setError('Failed to load location details');
        console.error('Error fetching location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleEdit = () => {
    if (location) {
      // This would open an edit modal in a real implementation
      console.log('Edit location:', location.id);
    }
  };

  if (loading) {
    return (
      <MainPageTemplate pageTitle="Loading...">
        <div>Loading location details...</div>
      </MainPageTemplate>
    );
  }

  if (error || !location) {
    return (
      <MainPageTemplate pageTitle="Error">
        <div>{error || 'Location not found'}</div>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back to Locations
        </Button>
      </MainPageTemplate>
    );
  }

  return (
    <MainPageTemplate pageTitle={location.name}>
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Locations
        </Button>
        
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              {location.name}
              {location.isActive ? (
                <Chip 
                  label="Active" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 2, verticalAlign: 'middle' }} 
                />
              ) : (
                <Chip 
                  label="Inactive" 
                  color="default" 
                  size="small" 
                  sx={{ ml: 2, verticalAlign: 'middle' }} 
                />
              )}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Address</Typography>
              <Typography>{location.address}</Typography>
              <Typography>{`${location.city}, ${location.state} ${location.zipCode}`}</Typography>
              {location.country && <Typography>{location.country}</Typography>}
              
              {location.latitude && location.longitude && (
                <Box mt={2}>
                  <Typography variant="subtitle2" color="textSecondary">Coordinates</Typography>
                  <Typography>{`${location.latitude}, ${location.longitude}`}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              {location.phone && (
                <Box mb={1}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography>{location.phone}</Typography>
                </Box>
              )}
              
              {location.email && (
                <Box mb={1}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography>{location.email}</Typography>
                </Box>
              )}
              
              {location.website && (
                <Box mb={1}>
                  <Typography variant="subtitle2" color="textSecondary">Website</Typography>
                  <Typography>
                    <a href={location.website} target="_blank" rel="noopener noreferrer">
                      {location.website}
                    </a>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box mt={3}>
            <Typography variant="subtitle2" color="textSecondary">Last Updated</Typography>
            <Typography>
              {new Date(location.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </MainPageTemplate>
  );
};

export default LocationDetailsPage;
