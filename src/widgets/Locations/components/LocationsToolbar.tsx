import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    InputBase,
    Button,
    Tooltip,
    Chip,
    Collapse,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    GridView as GridViewIcon,
    TableRows as TableRowsIcon,
    Add as AddIcon,
    FilterAlt as FilterAltIcon
} from '@mui/icons-material';
import { LocationFilters as LocationFiltersType, LocationViewMode } from '../types/types';

interface LocationsToolbarProps {
    viewMode: LocationViewMode;
    onViewModeChange: (newMode: LocationViewMode) => void;
    filters: LocationFiltersType;
    onFilterChange: (newFilters: LocationFiltersType) => void;
    onCreateLocation: () => void;
    filterableStates: string[];
    filterableCities: string[];
}

const LocationsToolbar: React.FC<LocationsToolbarProps> = ({
    viewMode,
    onViewModeChange,
    filters,
    onFilterChange,
    onCreateLocation,
    filterableStates,
    filterableCities
}) => {
    const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
    
    // Count the number of active filters (excluding searchTerm)
    const activeFilterCount = Object.keys(filters).filter(
        key => key !== 'searchTerm' && filters[key as keyof typeof filters]
    ).length;
    
    // Handle state selection
    const handleStateChange = (event: SelectChangeEvent<string>) => {
        onFilterChange({ ...filters, state: event.target.value });
    };
    
    // Handle city selection
    const handleCityChange = (event: SelectChangeEvent<string>) => {
        onFilterChange({ ...filters, city: event.target.value });
    };
    
    // Handle status selection
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        onFilterChange({ ...filters, status: event.target.value });
    };
    
    // Clear all filters except searchTerm
    const handleClearFilters = () => {
        onFilterChange({ searchTerm: filters.searchTerm });
    };
    
    return (
        <>
            {/* Unified Toolbar */}
            <Box sx={{ 
                display: 'flex', 
                width: '100%',
                backgroundColor: 'var(--secondary-color, #202020)', 
                borderRadius: '12px',
                border: '1px solid var(--border-color, #393737)',
                p: 1.5,
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                mb: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                gap: { xs: 1.5, md: 1 }
            }}>
                {/* Search Bar */}
                <Box sx={{ 
                    display: 'flex', 
                    flex: { xs: '1 1 100%', md: '1 1 auto' },
                    backgroundColor: 'var(--app-background, #181818)', 
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, #393737)',
                    py: 0.75,
                    px: 1.5,
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    mr: { xs: 0, md: 2 },
                    width: '100%',
                    maxWidth: { sm: '100%', md: '450px' },
                    minWidth: { md: '300px' },
                    height: '40px',
                    '&:hover': {
                        borderColor: 'var(--primary-color, #3478ff)'
                    },
                    '&:focus-within': {
                        borderColor: 'var(--primary-color, #3478ff)',
                        boxShadow: '0 0 0 1px rgba(52, 120, 255, 0.2)'
                    }
                }}>
                    <SearchIcon sx={{ color: 'var(--primary-color, #3478ff)', mr: 1, fontSize: 18 }} />
                    <InputBase
                        placeholder="Search locations..."
                        value={filters.searchTerm || ''}
                        onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                        sx={{ 
                            color: 'var(--text-light, #ffffff)',
                            '& input': { fontSize: '0.9rem', padding: '4px 0' },
                            '& ::placeholder': { color: 'var(--text-muted, rgba(255, 255, 255, 0.5))' },
                            flex: 1
                        }}
                    />
                    {filters.searchTerm && (
                        <IconButton 
                            size="small" 
                            onClick={() => onFilterChange({ ...filters, searchTerm: '' })} 
                            sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.5))' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
                
                {/* Action Buttons */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    gap: 2,
                    flex: { xs: '1 1 100%', md: '0 0 auto' },
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}>
                    {/* View Mode Toggle */}
                    <Box sx={{ 
                        display: 'flex', 
                        backgroundColor: 'var(--app-background, #181818)', 
                        borderRadius: '8px',
                        padding: '3px',
                        border: '1px solid var(--border-color, #393737)',
                        height: '36px',
                        minWidth: '90px',
                    }}>
                        <Tooltip title="Card View" arrow placement="top">
                            <IconButton 
                                onClick={() => onViewModeChange('grid')}
                                size="small"
                                sx={{ 
                                    color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                                    backgroundColor: viewMode === 'grid' ? 'var(--primary-color, #3478ff)' : 'transparent',
                                    borderRadius: '6px',
                                    margin: '0 2px',
                                    padding: '4px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { 
                                        backgroundColor: viewMode === 'grid' 
                                            ? 'var(--primary-color, #3478ff)' 
                                            : 'var(--hover-bg, #353535)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                <GridViewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Table View" arrow placement="top">
                            <IconButton 
                                onClick={() => onViewModeChange('table')}
                                size="small"
                                sx={{ 
                                    color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                                    backgroundColor: viewMode === 'table' ? 'var(--primary-color, #3478ff)' : 'transparent',
                                    borderRadius: '6px',
                                    margin: '0 2px',
                                    padding: '4px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { 
                                        backgroundColor: viewMode === 'table' 
                                            ? 'var(--primary-color, #3478ff)' 
                                            : 'var(--hover-bg, #353535)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                <TableRowsIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Filter Toggle Button */}
                    <Tooltip title="Toggle Filters" arrow placement="top">
                        <Button
                            variant="outlined"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            startIcon={<FilterAltIcon sx={{ fontSize: 18 }} />}
                            size="small"
                            sx={{
                                borderRadius: '6px',
                                padding: '4px 10px',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                height: '36px',
                                borderColor: activeFilterCount > 0 ? 'var(--primary-color, #3478ff)' : 'var(--border-color, #393737)',
                                color: activeFilterCount > 0 ? 'var(--primary-color, #3478ff)' : 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                backgroundColor: activeFilterCount > 0 ? 'rgba(52, 120, 255, 0.1)' : 'transparent',
                                textTransform: 'none',
                                fontSize: '0.85rem',
                                '&:hover': {
                                    backgroundColor: activeFilterCount > 0 ? 'rgba(52, 120, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                                }
                            }}
                        >
                            Filters
                            {activeFilterCount > 0 && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: 'var(--primary-color, #3478ff)',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 18,
                                        minWidth: 18,
                                        fontSize: '0.7rem'
                                    }} 
                                >
                                    {activeFilterCount}
                                </Box>
                            )}
                        </Button>
                    </Tooltip>
                    
                    {/* Create Location Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                        size="small"
                        onClick={onCreateLocation}
                        sx={{
                            height: '36px',
                            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
                            background: 'linear-gradient(45deg, var(--primary-color, #3478ff) 30%, var(--primary-light, #4a8fff) 90%)',
                            transition: 'all 0.2s ease',
                            fontWeight: 600,
                            paddingLeft: 1.5,
                            paddingRight: 1.5,
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            textTransform: 'none', 
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(52, 120, 255, 0.3)',
                                transform: 'translateY(-2px)'
                            },
                            '&:active': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 8px rgba(52, 120, 255, 0.25)' 
                            }
                        }}
                    >
                        Add Location
                    </Button>
                </Box>
            </Box>
            
            {/* Collapsible Filter Section */}
            <Collapse in={isFilterOpen} timeout="auto" sx={{ mb: 3, width: '100%' }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    backgroundColor: 'var(--app-background, #181818)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-color, #393737)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                }}>
                    {/* Filter Header */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 3,
                        borderBottom: '1px solid var(--border-color, #393737)',
                        pb: 2
                    }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: 'var(--text-light, #ffffff)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <FilterAltIcon sx={{ color: 'var(--primary-color, #3478ff)' }} />
                            Filter Locations
                        </Typography>
                        
                        {/* Clear Filters Button */}
                        {activeFilterCount > 0 && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={handleClearFilters}
                                startIcon={<CloseIcon />}
                                sx={{
                                    height: '36px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Clear All
                            </Button>
                        )}
                    </Box>
                    
                    {/* Filter Controls - Direct UI */}
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                        gap: 3
                    }}>
                        {/* State Filter */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ 
                                color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                fontWeight: 600 
                            }}>
                                State
                            </Typography>
                            <Box sx={{ 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color, #393737)',
                                overflow: 'hidden'
                            }}>
                                <Select
                                    value={filters.state || ''}
                                    onChange={handleStateChange}
                                    displayEmpty
                                    sx={{ 
                                        width: '100%',
                                        color: 'var(--text-light, #ffffff)',
                                        '& .MuiSelect-select': {
                                            py: 1.5,
                                            px: 2,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none'
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: 'var(--secondary-color, #202020)',
                                                color: 'var(--text-light, #ffffff)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                                border: '1px solid var(--border-color, #393737)',
                                                maxHeight: '300px'
                                            }
                                        }
                                    }}
                                    inputProps={{ 'aria-label': 'State' }}
                                >
                                    <MenuItem value="">
                                        <em>All States</em>
                                    </MenuItem>
                                    {filterableStates.map((state) => (
                                        <MenuItem key={state} value={state}>{state}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                        
                        {/* City Filter */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ 
                                color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                fontWeight: 600 
                            }}>
                                City
                            </Typography>
                            <Box sx={{ 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color, #393737)',
                                overflow: 'hidden'
                            }}>
                                <Select
                                    value={filters.city || ''}
                                    onChange={handleCityChange}
                                    displayEmpty
                                    sx={{ 
                                        width: '100%',
                                        color: 'var(--text-light, #ffffff)',
                                        '& .MuiSelect-select': {
                                            py: 1.5,
                                            px: 2,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none'
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: 'var(--secondary-color, #202020)',
                                                color: 'var(--text-light, #ffffff)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                                border: '1px solid var(--border-color, #393737)',
                                                maxHeight: '300px'
                                            }
                                        }
                                    }}
                                    inputProps={{ 'aria-label': 'City' }}
                                >
                                    <MenuItem value="">
                                        <em>All Cities</em>
                                    </MenuItem>
                                    {filterableCities.map((city) => (
                                        <MenuItem key={city} value={city}>{city}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                        
                        {/* Status Filter */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ 
                                color: 'var(--text-muted, rgba(255, 255, 255, 0.7))',
                                fontWeight: 600 
                            }}>
                                Status
                            </Typography>
                            <Box sx={{ 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color, #393737)',
                                overflow: 'hidden'
                            }}>
                                <Select
                                    value={filters.status || ''}
                                    onChange={handleStatusChange}
                                    displayEmpty
                                    sx={{ 
                                        width: '100%',
                                        color: 'var(--text-light, #ffffff)',
                                        '& .MuiSelect-select': {
                                            py: 1.5,
                                            px: 2,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none'
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: 'var(--secondary-color, #202020)',
                                                color: 'var(--text-light, #ffffff)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                                border: '1px solid var(--border-color, #393737)'
                                            }
                                        }
                                    }}
                                    inputProps={{ 'aria-label': 'Status' }}
                                >
                                    <MenuItem value="">
                                        <em>Any Status</em>
                                    </MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Collapse>
            
            {/* Active Filter Chips (shown when filters are collapsed) */}
            {!isFilterOpen && activeFilterCount > 0 && (
                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mb: 3
                }}>
                    {filters.state && (
                        <Chip 
                            label={`State: ${filters.state}`} 
                            onDelete={() => onFilterChange({ ...filters, state: '' })}
                            sx={{ 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                color: 'var(--text-light, #ffffff)',
                                border: '1px solid var(--border-color, #393737)',
                                '& .MuiChip-deleteIcon': {
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                                    '&:hover': {
                                        color: 'var(--text-light, #ffffff)'
                                    }
                                }
                            }} 
                        />
                    )}
                    
                    {filters.city && (
                        <Chip 
                            label={`City: ${filters.city}`} 
                            onDelete={() => onFilterChange({ ...filters, city: '' })}
                            sx={{ 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                color: 'var(--text-light, #ffffff)',
                                border: '1px solid var(--border-color, #393737)',
                                '& .MuiChip-deleteIcon': {
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                                    '&:hover': {
                                        color: 'var(--text-light, #ffffff)'
                                    }
                                }
                            }} 
                        />
                    )}
                    
                    {filters.status && (
                        <Chip 
                            label={`Status: ${filters.status}`} 
                            onDelete={() => onFilterChange({ ...filters, status: '' })}
                            sx={{ 
                                backgroundColor: 'var(--secondary-color, #202020)',
                                color: 'var(--text-light, #ffffff)',
                                border: '1px solid var(--border-color, #393737)',
                                '& .MuiChip-deleteIcon': {
                                    color: 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                                    '&:hover': {
                                        color: 'var(--text-light, #ffffff)'
                                    }
                                }
                            }} 
                        />
                    )}
                    
                    {/* Clear All button */}
                    <Chip 
                        label="Clear All" 
                        onDelete={handleClearFilters}
                        deleteIcon={<CloseIcon />}
                        sx={{ 
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            color: 'rgb(211, 47, 47)',
                            border: '1px solid rgba(211, 47, 47, 0.3)',
                            '& .MuiChip-deleteIcon': {
                                color: 'rgb(211, 47, 47)',
                            }
                        }} 
                    />
                </Box>
            )}
        </>
    );
};

export default LocationsToolbar;
