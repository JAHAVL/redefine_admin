import React, { useState, useEffect, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Direct import instead of using getComponentPath to avoid lazy loading issues
import LocationsWidget from '../../widgets/Locations/LocationsWidget';

// Views are now imported and managed by the LocationsWidget component

/**
 * Unified Locations page that handles all location views based on URL parameters
 * This approach uses a single page component with multiple views for better maintainability
 */
const LocationsPage: React.FC = () => {
  // Get route parameters and path
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State to track the page title and current view
  const [pageTitle, setPageTitle] = useState<string>('Locations');
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  // Set the current view based on the URL path
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/map')) {
      setCurrentView('map');
    } else if (path.includes('/analytics')) {
      setCurrentView('analytics');
    } else if (path.includes('/settings')) {
      setCurrentView('settings');
    } else if (path.includes('/details/')) {
      setCurrentView('details');
    } else if (path.includes('/edit/') || path.includes('/create')) {
      setCurrentView('edit');
    } else {
      setCurrentView('dashboard');
    }
  }, [location.pathname]);
  
  // The page title can be updated by the view component
  const updatePageTitle = (title: string) => {
    setPageTitle(title);
  };

  // Let the LocationsWidget component handle which view to display

  return (
    <MainPageTemplate pageTitle={pageTitle}>
      <Box width="100%" sx={{ position: 'relative', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        <LocationsWidget 
          view={currentView} 
          locationId={id} 
          onUpdatePageTitle={updatePageTitle}
        />
      </Box>
    </MainPageTemplate>
  );
};

export default LocationsPage;
