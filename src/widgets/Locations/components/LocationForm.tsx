import React, { useState, useEffect } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    FormControlLabel, 
    Switch, 
    CircularProgress,
    Typography,
    Paper,
    InputAdornment
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { Location, LocationFormData } from '../types/types';

export interface LocationFormProps {
  initialData?: Partial<Location>;
  onSubmit: (data: LocationFormData) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Save Location',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    latitude: 0,
    longitude: 0,
    phone: '',
    email: '',
    website: '',
    description: '',
    imageUrl: '',
    isActive: true,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeolocating, setIsGeolocating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({
        ...prev,
        geolocation: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setIsGeolocating(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.geolocation;
      return newErrors;
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsGeolocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setErrors(prev => ({
          ...prev,
          geolocation: 'Unable to retrieve your location',
        }));
        setIsGeolocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof LocationFormData)[] = [
      'name', 'address', 'city', 'state', 'zipCode'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\//i.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (include http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save location. Please try again.',
      }));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Location Name */}
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>

          {/* Address */}
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* City, State, ZIP Code */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: '150px' }}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
                required
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: '120px' }}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                required
              />
            </Box>
          </Box>

          {/* Country */}
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Box>

          {/* Contact Info */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>
          </Box>

          {/* Website */}
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              type="url"
              value={formData.website || ''}
              onChange={handleChange}
              error={!!errors.website}
              helperText={errors.website}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Description */}
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>

          {/* Image URL */}
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Coordinates */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Location Coordinates
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude || ''}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude || ''}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Button
                variant="outlined"
                onClick={handleGeolocation}
                disabled={isGeolocating}
                sx={{ minWidth: 'auto', height: '56px' }}
                title="Use current location"
              >
                {isGeolocating ? (
                  <CircularProgress size={24} />
                ) : (
                  <MyLocationIcon />
                )}
              </Button>
            </Box>
            {errors.geolocation && (
              <Typography color="error" variant="caption">
                {errors.geolocation}
              </Typography>
            )}
          </Box>

          {/* Active Status */}
          <Box sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))}
                  color="primary"
                />
              }
              label={formData.isActive ? 'Active' : 'Inactive'}
            />
          </Box>

          {/* Submit Error */}
          {errors.submit && (
            <Box>
              <Typography color="error">{errors.submit}</Typography>
            </Box>
          )}

          {/* Form Actions */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Saving...' : submitButtonText}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default LocationForm;
