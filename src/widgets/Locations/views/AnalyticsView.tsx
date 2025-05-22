import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';
import { getAllLocations } from '../../../services/locationsService';
import { Location } from '../types/types';

// Let's mock some additional analytics data
interface LocationAnalytics {
  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
  locationsByState: Record<string, number>;
  locationsByActivity: { month: string; active: number; inactive: number }[];
  locationVisits: { month: string; visits: number }[];
  topLocations: { id: string; name: string; visits: number }[];
}

// Styled components
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)',
  height: '100%',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  overflow: 'hidden',
}));

const StatCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 45,
  height: 45,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  height: '300px',
  position: 'relative',
}));

// Props interface for AnalyticsView
interface AnalyticsViewProps {
  onUpdatePageTitle?: (title: string) => void;
}

/**
 * AnalyticsView component
 * Displays analytics and statistics for locations
 */
const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onUpdatePageTitle
}) => {
  const theme = useTheme();
  
  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [analytics, setAnalytics] = useState<LocationAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('year');
  
  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getAllLocations();
        setLocations(data);
        
        // Generate mock analytics data
        generateAnalytics(data);
        
        setLoading(false);
        
        // Update page title
        if (onUpdatePageTitle) {
          onUpdatePageTitle('Location Analytics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [onUpdatePageTitle]);
  
  // Generate analytics data from locations
  const generateAnalytics = (locationData: Location[]) => {
    const activeLocations = locationData.filter(loc => loc.isActive).length;
    const inactiveLocations = locationData.length - activeLocations;
    
    // Count locations by state
    const locationsByState: Record<string, number> = {};
    locationData.forEach(loc => {
      if (locationsByState[loc.state]) {
        locationsByState[loc.state]++;
      } else {
        locationsByState[loc.state] = 1;
      }
    });
    
    // Generate mock data for monthly activity
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const locationsByActivity = months.map(month => ({
      month,
      active: Math.floor(Math.random() * 20) + 5,
      inactive: Math.floor(Math.random() * 10) + 1
    }));
    
    // Generate mock data for location visits
    const locationVisits = months.map(month => ({
      month,
      visits: Math.floor(Math.random() * 1000) + 100
    }));
    
    // Generate mock data for top locations
    const topLocations = locationData
      .slice(0, 5)
      .map(loc => ({
        id: loc.id,
        name: loc.name,
        visits: Math.floor(Math.random() * 1000) + 500
      }))
      .sort((a, b) => b.visits - a.visits);
    
    setAnalytics({
      totalLocations: locationData.length,
      activeLocations,
      inactiveLocations,
      locationsByState,
      locationsByActivity,
      locationVisits,
      topLocations
    });
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
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
  
  if (!analytics) {
    return (
      <Box p={4} width="100%" maxWidth="1400px" mx="auto">
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            '& .MuiAlert-icon': { fontSize: '2rem' } 
          }}
        >
          <Typography variant="h6">No analytics data available</Typography>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box width="100%" maxWidth="1400px" mx="auto" p={{ xs: 2, sm: 3, md: 4 }}>
      {/* Header with title and time range selector */}
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
          Location Analytics
        </Typography>
        
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value as string)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Key stats */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4
        }}
      >
        <StatCard>
          <CardContent>
            <StatCardHeader>
              <IconContainer sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
              </IconContainer>
              <Box>
                <StatValue color="text.primary">
                  {analytics.totalLocations}
                </StatValue>
                <StatLabel>
                  Total Locations
                </StatLabel>
              </Box>
            </StatCardHeader>
            <Typography variant="body2" color="text.secondary">
              {timeRange === 'week' ? 'This week:' : timeRange === 'month' ? 'This month:' : 'This year:'} {' '}
              <Typography component="span" color="success.main" fontWeight="bold">
                +{Math.floor(Math.random() * 5) + 1} new
              </Typography>
            </Typography>
          </CardContent>
        </StatCard>
        
        <StatCard>
          <CardContent>
            <StatCardHeader>
              <IconContainer sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                <BusinessIcon sx={{ color: theme.palette.success.main }} />
              </IconContainer>
              <Box>
                <StatValue color="text.primary">
                  {analytics.activeLocations}
                </StatValue>
                <StatLabel>
                  Active Locations
                </StatLabel>
              </Box>
            </StatCardHeader>
            <Typography variant="body2" color="text.secondary">
              {((analytics.activeLocations / analytics.totalLocations) * 100).toFixed(1)}% of total locations
            </Typography>
          </CardContent>
        </StatCard>
        
        <StatCard>
          <CardContent>
            <StatCardHeader>
              <IconContainer sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                <PeopleIcon sx={{ color: theme.palette.warning.main }} />
              </IconContainer>
              <Box>
                <StatValue color="text.primary">
                  {analytics.locationVisits.reduce((sum, item) => sum + item.visits, 0).toLocaleString()}
                </StatValue>
                <StatLabel>
                  Total Visits
                </StatLabel>
              </Box>
            </StatCardHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="success.main">
                {Math.floor(Math.random() * 10) + 5}% increase
              </Typography>
            </Box>
          </CardContent>
        </StatCard>
      </Box>
      
      {/* Chart sections */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 4,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Monthly Location Activity
          </Typography>
          <ChartContainer>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary" sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 60, opacity: 0.5, display: 'block', mx: 'auto', mb: 1 }} />
                Chart visualization would be implemented here<br />
                showing active vs inactive locations over time
              </Typography>
            </Box>
          </ChartContainer>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Locations by State
          </Typography>
          <ChartContainer>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary" sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                <MapIcon sx={{ fontSize: 60, opacity: 0.5, display: 'block', mx: 'auto', mb: 1 }} />
                Map chart visualization would be implemented here<br />
                showing distribution of locations by state
              </Typography>
            </Box>
          </ChartContainer>
        </Box>
      </Box>
      
      {/* Top locations table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Top Performing Locations
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', fontWeight: 'bold' }}>
              <Typography variant="subtitle2">Location</Typography>
              <Typography variant="subtitle2">Visits</Typography>
            </Box>
            <Divider />
            {analytics.topLocations.map((location, index) => (
              <React.Fragment key={location.id}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {location.id}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold">
                      {location.visits.toLocaleString()}
                    </Typography>
                    {index === 0 && (
                      <TrendingUpIcon color="success" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </Box>
                {index < analytics.topLocations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalyticsView;
