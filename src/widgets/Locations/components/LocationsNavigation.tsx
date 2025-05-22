import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/BarChart';

// Define the navigation items
const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/locations'
  },
  { 
    id: 'map', 
    label: 'Map', 
    icon: <MapIcon />, 
    path: '/locations/map'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: <AnalyticsIcon />, 
    path: '/locations/analytics'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/locations/settings'
  }
];

interface LocationsNavigationProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

/**
 * LocationsNavigation component
 * Provides navigation between different location views
 */
const LocationsNavigation: React.FC<LocationsNavigationProps> = ({
  activeView,
  onViewChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Determine active tab based on current path if not explicitly provided
  const currentPath = location.pathname;
  const activeTab = activeView || navigationItems.find(item => 
    currentPath === item.path || 
    (item.id !== 'dashboard' && currentPath.startsWith(item.path))
  )?.id || 'dashboard';
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    const selectedItem = navigationItems.find(item => item.id === newValue);
    
    if (selectedItem) {
      navigate(selectedItem.path);
      
      if (onViewChange) {
        onViewChange(newValue);
      }
    }
  };
  
  // Render bottom navigation for mobile devices
  if (isMobile) {
    return (
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          borderRadius: 0
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={activeTab}
          onChange={(_, newValue) => handleTabChange(_, newValue)}
          showLabels
        >
          {navigationItems.map(item => (
            <BottomNavigationAction
              key={item.id}
              label={item.label}
              value={item.id}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }
  
  // Render tabs for desktop
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Paper elevation={0} sx={{ borderRadius: 2, backgroundColor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {navigationItems.map(item => (
            <Tab
              key={item.id}
              value={item.id}
              label={item.label}
              icon={item.icon}
              iconPosition="start"
              sx={{ 
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}
            />
          ))}
        </Tabs>
      </Paper>
    </Box>
  );
};

export default LocationsNavigation;
