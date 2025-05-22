import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Stack,
  InputAdornment
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import { getLocationById } from '../../../services/locationsService';
import { Location } from '../types/types';

// Styled components
const FormCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  overflow: 'hidden',
}));

const CardHeaderSection = styled(Box)(({ theme }) => ({
  padding: '16px 24px',
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: '24px',
}));

// Props interface for LocationEditView
interface LocationEditViewProps {
  locationId?: string;
  onUpdatePageTitle?: (title: string) => void;
}

/**
 * LocationEditView component
 * Displays a form to edit or create a location
 */
const LocationEditView: React.FC<LocationEditViewProps> = ({
  locationId,
  onUpdatePageTitle
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Determine if editing or creating new
  const isEditing = Boolean(locationId);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    email: '',
    website: '',
    description: '',
    isActive: true
  });
  
  // UI state
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Fetch location data if editing
  useEffect(() => {
    const fetchLocationData = async () => {
      if (!locationId) return;
      
      try {
        setLoading(true);
        const locationData = await getLocationById(locationId);
        
        if (!locationData) {
          throw new Error('Location not found');
        }
        
        setFormData(locationData);
        setLoading(false);
        
        // Update the page title based on mode
        if (onUpdatePageTitle) {
          onUpdatePageTitle(isEditing ? `Edit ${locationData.name}` : 'Create New Location');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchLocationData();
  }, [locationId, isEditing, onUpdatePageTitle]);
  
  // Update page title for new location
  useEffect(() => {
    if (!isEditing && onUpdatePageTitle) {
      onUpdatePageTitle('Create New Location');
    }
  }, [isEditing, onUpdatePageTitle]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    // Handle number fields
    let parsedValue: string | number | boolean = newValue;
    if (type === 'number' && typeof value === 'string') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state?.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.zipCode?.trim()) {
      errors.zipCode = 'ZIP Code is required';
    }
    
    if (!formData.country?.trim()) {
      errors.country = 'Country is required';
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Website validation
    if (formData.website && !/^https?:\/\//.test(formData.website)) {
      errors.website = 'Website must start with http:// or https://';
    }
    
    // Coordinates validation
    if (formData.latitude !== undefined && (formData.latitude < -90 || formData.latitude > 90)) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (formData.longitude !== undefined && (formData.longitude < -180 || formData.longitude > 180)) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // In a real app, this would save to the backend
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to the locations list or details page
      if (isEditing && locationId) {
        navigate(`/locations/${locationId}`);
      } else {
        navigate('/locations');
      }
      
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location');
      setSaving(false);
    }
  };
  
  // Handle cancel/back
  const handleCancel = () => {
    if (isEditing && locationId) {
      navigate(`/locations/${locationId}`);
    } else {
      navigate('/locations');
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
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          size="medium"
        >
          Back to Locations
        </Button>
      </Box>
    );
  }
  
  return (
    <Box width="100%" maxWidth="1200px" mx="auto" p={{ xs: 2, sm: 3, md: 4 }}>
      {/* Header with actions */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: 2
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            size="medium"
          >
            Cancel
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {isEditing ? 'Edit Location' : 'New Location'}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
          size="large"
        >
          {saving ? 'Saving...' : 'Save Location'}
        </Button>
      </Box>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3 
          }}
        >
          {/* Basic Information */}
          <FormCard>
            <CardHeaderSection>
              <BusinessIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h6">Basic Information</Typography>
            </CardHeaderSection>
            <FormSection>
              <Stack spacing={3}>
                <TextField
                  label="Location Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                  error={!!formErrors.address}
                  helperText={formErrors.address}
                />
                
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2 
                  }}
                >
                  <TextField
                    label="City"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                  />
                  
                  <TextField
                    label="State/Province"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                  />
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2 
                  }}
                >
                  <TextField
                    label="ZIP/Postal Code"
                    name="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    error={!!formErrors.zipCode}
                    helperText={formErrors.zipCode}
                  />
                  
                  <TextField
                    label="Country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    error={!!formErrors.country}
                    helperText={formErrors.country}
                  />
                </Box>
              </Stack>
            </FormSection>
          </FormCard>
          
          {/* Contact Information */}
          <FormCard>
            <CardHeaderSection>
              <PhoneIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h6">Contact Information</Typography>
            </CardHeaderSection>
            <FormSection>
              <Stack spacing={3}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  placeholder="https://"
                  error={!!formErrors.website}
                  helperText={formErrors.website}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={!!formData.isActive}
                      onChange={handleChange}
                      color="success"
                    />
                  }
                  label="Location is active"
                  sx={{ mt: 2 }}
                />
              </Stack>
            </FormSection>
          </FormCard>
          
          {/* Map coordinates */}
          <FormCard>
            <CardHeaderSection>
              <LocationOnIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h6">Map Coordinates</Typography>
            </CardHeaderSection>
            <FormSection>
              <Stack spacing={3}>
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2 
                  }}
                >
                  <TextField
                    label="Latitude"
                    name="latitude"
                    type="number"
                    value={formData.latitude ?? ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!formErrors.latitude}
                    helperText={formErrors.latitude || 'Value between -90 and 90'}
                    inputProps={{
                      step: 'any',
                    }}
                  />
                  
                  <TextField
                    label="Longitude"
                    name="longitude"
                    type="number"
                    value={formData.longitude ?? ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!formErrors.longitude}
                    helperText={formErrors.longitude || 'Value between -180 and 180'}
                    inputProps={{
                      step: 'any',
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Enter the exact coordinates for the location to display it accurately on the map.
                </Typography>
              </Stack>
            </FormSection>
          </FormCard>
          
          {/* Description */}
          <FormCard>
            <CardHeaderSection>
              <InfoIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h6">Description</Typography>
            </CardHeaderSection>
            <FormSection>
              <TextField
                label="Location Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                placeholder="Enter details about this location..."
              />
            </FormSection>
          </FormCard>
        </Box>
        
        {/* Submit button for mobile */}
        <Box mt={4} display={{ xs: 'block', sm: 'none' }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
            size="large"
            sx={{ py: 1.5 }}
          >
            {saving ? 'Saving...' : 'Save Location'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LocationEditView;
