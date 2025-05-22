import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CircularProgress, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import styled components and theme
import { 
  LocationsWidgetContainer, 
  LocationsContent, 
  LocationsHeader, 
  LocationsTitle,
  CloseButton 
} from './styles';
import { theme } from './theme';

// Direct imports instead of lazy loading to avoid React errors
import DashboardView from './views/DashboardView';
import MapView from './views/MapView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import LocationDetailsView from './views/LocationDetailsView';
import LocationEditView from './views/LocationEditView';

/**
 * Locations Widget
 * 
 * The main container component for the Locations feature.
 * Provides theming, styling, and routing for all locations-related views.
 */
const LocationsWidget: React.FC<{
  view: string;
  locationId?: string;
  onUpdatePageTitle?: (title: string) => void;
}> = ({ view, locationId, onUpdatePageTitle }) => {
  const location = useLocation();
  
  // Render the appropriate view based on the view prop
  const renderView = () => {
    switch (view) {
      case 'map':
        return <MapView onUpdatePageTitle={onUpdatePageTitle} />;
      case 'analytics':
        return <AnalyticsView onUpdatePageTitle={onUpdatePageTitle} />;
      case 'settings':
        return <SettingsView onUpdatePageTitle={onUpdatePageTitle} />;
      case 'details':
        return <LocationDetailsView locationId={locationId || ''} onUpdatePageTitle={onUpdatePageTitle} />;
      case 'edit':
        return <LocationEditView locationId={locationId || ''} onUpdatePageTitle={onUpdatePageTitle} />;
      case 'dashboard':
      default:
        return <DashboardView onUpdatePageTitle={onUpdatePageTitle} />;
    }
  };

  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/dashboard');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <LocationsWidgetContainer>
        <LocationsHeader>
          <LocationsTitle>Locations</LocationsTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </LocationsHeader>
        <LocationsContent>
          {renderView()}
        </LocationsContent>
      </LocationsWidgetContainer>
    </ThemeProvider>
  );
};

export default LocationsWidget;
