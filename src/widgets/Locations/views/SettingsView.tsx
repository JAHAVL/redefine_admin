import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Stack,
  Snackbar,
  IconButton
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

// Styled components
const SettingsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const SettingsCardHeader = styled(Box)(({ theme }) => ({
  padding: '16px 24px',
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
}));

const SettingsCardContent = styled(CardContent)(({ theme }) => ({
  padding: '24px',
}));

const SettingSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

// Mock settings data
interface LocationSettings {
  general: {
    defaultView: string;
    itemsPerPage: number;
    enableNotifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  };
  map: {
    defaultMapType: string;
    showInactiveLocations: boolean;
    clusterMarkers: boolean;
    defaultZoom: number;
    mapApiKey: string;
  };
  display: {
    showCoordinates: boolean;
    showCountry: boolean;
    showTimezone: boolean;
    sortBy: string;
    sortDirection: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    notifyOnLocationChange: boolean;
    notifyOnStatusChange: boolean;
    digestFrequency: string;
  }
}

// Props interface for SettingsView
interface SettingsViewProps {
  onUpdatePageTitle?: (title: string) => void;
}

/**
 * SettingsView component
 * Displays settings for the locations module
 */
const SettingsView: React.FC<SettingsViewProps> = ({
  onUpdatePageTitle
}) => {
  const theme = useTheme();
  
  // State
  const [settings, setSettings] = useState<LocationSettings>({
    general: {
      defaultView: 'dashboard',
      itemsPerPage: 10,
      enableNotifications: true,
      autoRefresh: false,
      refreshInterval: 30,
    },
    map: {
      defaultMapType: 'roadmap',
      showInactiveLocations: true,
      clusterMarkers: true,
      defaultZoom: 5,
      mapApiKey: 'YOUR_API_KEY_HERE',
    },
    display: {
      showCoordinates: true,
      showCountry: true,
      showTimezone: false,
      sortBy: 'name',
      sortDirection: 'asc',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      notifyOnLocationChange: true,
      notifyOnStatusChange: true,
      digestFrequency: 'daily',
    }
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  
  // Fetch settings
  useEffect(() => {
    // Simulate fetching settings
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Settings would be fetched from backend - using default for now
        setLoading(false);
        
        // Update page title
        if (onUpdatePageTitle) {
          onUpdatePageTitle('Location Settings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [onUpdatePageTitle]);
  
  // Handle settings changes
  const handleSettingChange = (section: keyof LocationSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // In a real app, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaving(false);
      setSnackbarOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      setSaving(false);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
    <Box width="100%" maxWidth="900px" mx="auto" p={{ xs: 2, sm: 3, md: 4 }}>
      {/* Header */}
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
        <Typography variant="h4" component="h1" fontWeight="bold">
          Location Settings
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
      
      {/* General Settings */}
      <SettingsCard>
        <SettingsCardHeader>
          <SettingsIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h6">General Settings</Typography>
        </SettingsCardHeader>
        <SettingsCardContent>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="default-view-label">Default View</InputLabel>
              <Select
                labelId="default-view-label"
                id="default-view"
                value={settings.general.defaultView}
                label="Default View"
                onChange={(e) => handleSettingChange('general', 'defaultView', e.target.value)}
              >
                <MenuItem value="dashboard">Dashboard</MenuItem>
                <MenuItem value="map">Map</MenuItem>
                <MenuItem value="analytics">Analytics</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="items-per-page-label">Items Per Page</InputLabel>
              <Select
                labelId="items-per-page-label"
                id="items-per-page"
                value={settings.general.itemsPerPage}
                label="Items Per Page"
                onChange={(e) => handleSettingChange('general', 'itemsPerPage', e.target.value)}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.general.enableNotifications}
                    onChange={(e) => handleSettingChange('general', 'enableNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.general.autoRefresh}
                    onChange={(e) => handleSettingChange('general', 'autoRefresh', e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto Refresh Data"
              />
            </Box>
            
            {settings.general.autoRefresh && (
              <FormControl fullWidth>
                <InputLabel id="refresh-interval-label">Refresh Interval (seconds)</InputLabel>
                <Select
                  labelId="refresh-interval-label"
                  id="refresh-interval"
                  value={settings.general.refreshInterval}
                  label="Refresh Interval (seconds)"
                  onChange={(e) => handleSettingChange('general', 'refreshInterval', e.target.value)}
                >
                  <MenuItem value={10}>10 seconds</MenuItem>
                  <MenuItem value={30}>30 seconds</MenuItem>
                  <MenuItem value={60}>1 minute</MenuItem>
                  <MenuItem value={300}>5 minutes</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </SettingsCardContent>
      </SettingsCard>
      
      {/* Map Settings */}
      <SettingsCard>
        <SettingsCardHeader>
          <MapIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h6">Map Settings</Typography>
        </SettingsCardHeader>
        <SettingsCardContent>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="default-map-type-label">Default Map Type</InputLabel>
              <Select
                labelId="default-map-type-label"
                id="default-map-type"
                value={settings.map.defaultMapType}
                label="Default Map Type"
                onChange={(e) => handleSettingChange('map', 'defaultMapType', e.target.value)}
              >
                <MenuItem value="roadmap">Road Map</MenuItem>
                <MenuItem value="satellite">Satellite</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="terrain">Terrain</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.map.showInactiveLocations}
                    onChange={(e) => handleSettingChange('map', 'showInactiveLocations', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Inactive Locations"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.map.clusterMarkers}
                    onChange={(e) => handleSettingChange('map', 'clusterMarkers', e.target.checked)}
                    color="primary"
                  />
                }
                label="Cluster Nearby Markers"
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel id="default-zoom-label">Default Zoom Level</InputLabel>
              <Select
                labelId="default-zoom-label"
                id="default-zoom"
                value={settings.map.defaultZoom}
                label="Default Zoom Level"
                onChange={(e) => handleSettingChange('map', 'defaultZoom', e.target.value)}
              >
                <MenuItem value={1}>1 - World</MenuItem>
                <MenuItem value={5}>5 - Continent</MenuItem>
                <MenuItem value={10}>10 - City</MenuItem>
                <MenuItem value={15}>15 - Streets</MenuItem>
                <MenuItem value={20}>20 - Buildings</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Google Maps API Key"
              type="password"
              value={settings.map.mapApiKey}
              onChange={(e) => handleSettingChange('map', 'mapApiKey', e.target.value)}
              fullWidth
              helperText="API key for Google Maps integration"
            />
          </Stack>
        </SettingsCardContent>
      </SettingsCard>
      
      {/* Display Settings */}
      <SettingsCard>
        <SettingsCardHeader>
          <ViewListIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h6">Display Settings</Typography>
        </SettingsCardHeader>
        <SettingsCardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.showCoordinates}
                    onChange={(e) => handleSettingChange('display', 'showCoordinates', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Coordinates"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.showCountry}
                    onChange={(e) => handleSettingChange('display', 'showCountry', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Country"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.showTimezone}
                    onChange={(e) => handleSettingChange('display', 'showTimezone', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Timezone"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={settings.display.sortBy}
                  label="Sort By"
                  onChange={(e) => handleSettingChange('display', 'sortBy', e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="city">City</MenuItem>
                  <MenuItem value="state">State</MenuItem>
                  <MenuItem value="createdAt">Creation Date</MenuItem>
                  <MenuItem value="updatedAt">Last Updated</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="sort-direction-label">Direction</InputLabel>
                <Select
                  labelId="sort-direction-label"
                  id="sort-direction"
                  value={settings.display.sortDirection}
                  label="Direction"
                  onChange={(e) => handleSettingChange('display', 'sortDirection', e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </SettingsCardContent>
      </SettingsCard>
      
      {/* Notification Settings */}
      <SettingsCard>
        <SettingsCardHeader>
          <NotificationsIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h6">Notification Settings</Typography>
        </SettingsCardHeader>
        <SettingsCardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    color="primary"
                    disabled={!settings.general.enableNotifications}
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    color="primary"
                    disabled={!settings.general.enableNotifications}
                  />
                }
                label="Push Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.notifyOnLocationChange}
                    onChange={(e) => handleSettingChange('notifications', 'notifyOnLocationChange', e.target.checked)}
                    color="primary"
                    disabled={!settings.general.enableNotifications}
                  />
                }
                label="Notify on Location Changes"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.notifyOnStatusChange}
                    onChange={(e) => handleSettingChange('notifications', 'notifyOnStatusChange', e.target.checked)}
                    color="primary"
                    disabled={!settings.general.enableNotifications}
                  />
                }
                label="Notify on Status Changes"
              />
            </Box>
            
            <FormControl fullWidth disabled={!settings.general.enableNotifications}>
              <InputLabel id="digest-frequency-label">Digest Frequency</InputLabel>
              <Select
                labelId="digest-frequency-label"
                id="digest-frequency"
                value={settings.notifications.digestFrequency}
                label="Digest Frequency"
                onChange={(e) => handleSettingChange('notifications', 'digestFrequency', e.target.value)}
              >
                <MenuItem value="realtime">Real-time</MenuItem>
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
            
            <Alert 
              severity="info"
              icon={<InfoIcon />}
              sx={{ 
                '& .MuiAlert-icon': { color: theme.palette.info.main }
              }}
            >
              <Typography variant="body2">
                Notification settings require browser permissions to be enabled for push notifications.
              </Typography>
            </Alert>
          </Stack>
        </SettingsCardContent>
      </SettingsCard>
      
      {/* Save button for mobile */}
      <Box mt={3} display={{ xs: 'block', sm: 'none' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
          size="large"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
      
      {/* Success snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Settings saved successfully"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default SettingsView;
