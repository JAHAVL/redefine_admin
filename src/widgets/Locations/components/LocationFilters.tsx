import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  SelectChangeEvent,
  Paper,
  IconButton,
  Collapse,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { LocationFilters as LocationFiltersType } from '../types/types';

interface LocationFiltersProps {
  onFilterChange: (filters: LocationFiltersType) => void;
  initialFilters?: LocationFiltersType;
  cities?: string[];
  states?: string[];
}

export const LocationFilters: React.FC<LocationFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
  cities = [],
  states = [],
}) => {
  const [filters, setFilters] = useState<LocationFiltersType>(initialFilters);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: LocationFiltersType) => ({ ...prev, search: e.target.value }));
  };

  const handleCityChange = (e: SelectChangeEvent<string>) => {
    setFilters((prev: LocationFiltersType) => ({ ...prev, city: e.target.value }));
  };

  const handleStateChange = (e: SelectChangeEvent<string>) => {
    setFilters((prev: LocationFiltersType) => ({ ...prev, state: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: LocationFiltersType) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { search: '', city: '', state: '', isActive: true };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: expanded ? 2 : 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Box>
          <IconButton size="small" onClick={toggleExpanded}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Search Field */}
          <Box sx={{ width: { xs: '100%', md: 'calc(25% - 16px)' } }}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              size="small"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Search by name or address..."
            />
          </Box>
          
          {/* City Select */}
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select
                value={filters.city || ''}
                onChange={handleCityChange}
                label="City"
              >
                <MenuItem value="">
                  <em>All Cities</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* State Select */}
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(20% - 16px)' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>State</InputLabel>
              <Select
                value={filters.state || ''}
                onChange={handleStateChange}
                label="State"
              >
                <MenuItem value="">
                  <em>All States</em>
                </MenuItem>
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* Status Toggle */}
          <Box sx={{ 
            width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(20% - 16px)' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.isActive !== false}
                  onChange={handleStatusChange}
                  color="primary"
                />
              }
              label={filters.isActive !== false ? "Active" : "Inactive"}
              labelPlacement="start"
            />
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ 
            width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(10% - 16px)' },
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            mb: 0.5
          }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              size="small"
              fullWidth
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              size="small"
              fullWidth
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};
