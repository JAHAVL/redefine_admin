import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';

// Import icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { getAllLocations } from '../../../services/locationsService';
import { Location, LocationFilters, LocationViewMode } from '../types/types';

// Import existing components
import { LocationList } from '../components/LocationList';
import LocationsToolbar from '../components/LocationsToolbar';
import { LocationTable } from '../components/LocationTable';
import { LocationCard } from '../components/LocationCard';

// Import styled components
import {
  LocationsHeader,
  LocationsTitle,
  LocationsContent,
  LocationsButton,
  Dashboard,
  TabContainer,
  Tab,
  SearchInput
} from '../styles';

// Props interface for DashboardView
interface DashboardViewProps {
  onUpdatePageTitle?: (title: string) => void;
}

/**
 * DashboardView component 
 * Displays a dashboard of locations with search, filtering, and other management options
 */
const DashboardView: React.FC<DashboardViewProps> = ({
  onUpdatePageTitle
}) => {
  const navigate = useNavigate();
  
  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<LocationViewMode>('grid');
  const [filters, setFilters] = useState<LocationFilters>({
    searchTerm: '',
    state: '',
    city: '',
    status: 'all'
  });
  
  // Derived state - filter locations based on filters
  const filteredLocations = React.useMemo(() => {
    return locations.filter(location => {
      // Search term filter
      const searchTermLower = filters.searchTerm ? filters.searchTerm.toLowerCase() : '';
      const matchesSearch = !filters.searchTerm || 
        location.name.toLowerCase().includes(searchTermLower) ||
        location.address.toLowerCase().includes(searchTermLower) ||
        location.city.toLowerCase().includes(searchTermLower) ||
        location.state.toLowerCase().includes(searchTermLower);

      // State filter
      const matchesState = !filters.state || location.state === filters.state;
      
      // City filter
      const matchesCity = !filters.city || location.city === filters.city;
      
      // Status filter
      const matchesStatus = 
        filters.status === 'all' ||
        (filters.status === 'active' && location.isActive) ||
        (filters.status === 'inactive' && !location.isActive);
      
      return matchesSearch && matchesState && matchesCity && matchesStatus;
    });
  }, [locations, filters]);
  
  // Get unique states and cities for filters
  const filterableStates = React.useMemo(() => {
    const states = locations.map(loc => loc.state);
    return Array.from(new Set(states)).sort();
  }, [locations]);
  
  const filterableCities = React.useMemo(() => {
    const cities = locations.map(loc => loc.city);
    return Array.from(new Set(cities)).sort();
  }, [locations]);
  
  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getAllLocations();
        setLocations(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);
  
  useEffect(() => {
    if (onUpdatePageTitle) {
      onUpdatePageTitle('Locations');
    }
  }, [onUpdatePageTitle]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: LocationFilters) => {
    setFilters(newFilters);
  };
  
  // Handle view mode changes
  const handleViewModeChange = (newMode: LocationViewMode) => {
    setViewMode(newMode);
  };
  
  // Handle create new location
  const handleCreateLocation = () => {
    navigate('/locations/create');
  };
  
  // Handle edit location
  const handleEditLocation = (location: Location) => {
    navigate(`/locations/edit/${location.id}`);
  };
  
  // Handle delete location
  const handleDeleteLocation = (id: string) => {
    // In a real application, this would call an API to delete the location
    // For now, let's just filter it out of the locations list
    setLocations(prevLocations => prevLocations.filter(loc => loc.id !== id));
  };
  
  // Handle view location details
  const handleViewLocationDetails = (location: Location) => {
    navigate(`/locations/details/${location.id}`);
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
    <Box>
      {/* Location Dashboard Header */}
      <LocationsHeader>
        <LocationsTitle>Locations Dashboard</LocationsTitle>
        
        {/* Action Area */}
        <Box display="flex" gap={2}>
          <SearchInput 
            type="text" 
            placeholder="Search locations..." 
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
          />
          
          <LocationsButton onClick={() => navigate('/locations/create')} primary>
            <AddIcon /> Add Location
          </LocationsButton>
          
          <Box display="flex" border="1px solid" borderColor="divider" borderRadius="4px">
            <LocationsButton 
              className={viewMode === 'grid' ? 'iconOnly active' : 'iconOnly'}
              onClick={() => setViewMode('grid')}
            >
              <ViewModuleIcon />
            </LocationsButton>
            <LocationsButton 
              className={viewMode === 'table' ? 'iconOnly active' : 'iconOnly'}
              onClick={() => setViewMode('table')}
            >
              <ViewListIcon />
            </LocationsButton>
          </Box>
        </Box>
      </LocationsHeader>
      
      {/* Filter Tabs */}
      <TabContainer>
        <Tab 
          active={filters.status === 'all'} 
          onClick={() => handleFilterChange({ ...filters, status: 'all' })}
        >
          All Locations
        </Tab>
        <Tab 
          active={filters.status === 'active'} 
          onClick={() => handleFilterChange({ ...filters, status: 'active' })}
        >
          Active
        </Tab>
        <Tab 
          active={filters.status === 'inactive'} 
          onClick={() => handleFilterChange({ ...filters, status: 'inactive' })}
        >
          Inactive
        </Tab>
      </TabContainer>
      
      {/* Display locations based on view mode */}
      {filteredLocations.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="h6" gutterBottom>
            No locations found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.searchTerm ? 
              "No locations match your search criteria. Try adjusting your filters." :
              "Add your first location to get started."}
          </Typography>
        </Box>
      ) : viewMode === 'list' ? (
        <LocationList 
          locations={filteredLocations} 
          onEdit={handleEditLocation} 
          onDelete={handleDeleteLocation}
        />
      ) : viewMode === 'table' ? (
        <LocationTable 
          locations={filteredLocations}
          onRowClick={handleViewLocationDetails}
          onEdit={handleEditLocation}
          onDelete={handleDeleteLocation}
        />
      ) : (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1.5 }}>
            {filteredLocations.map(location => (
              <Box 
                key={location.id} 
                sx={{ 
                  width: { xs: '100%', sm: '50%', md: '33.33%' },
                  padding: 1.5,
                  boxSizing: 'border-box'
                }}
              >
                <LocationCard 
                  location={location} 
                  onViewDetails={handleViewLocationDetails}
                  onEdit={handleEditLocation} 
                  onDelete={handleDeleteLocation}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DashboardView;
