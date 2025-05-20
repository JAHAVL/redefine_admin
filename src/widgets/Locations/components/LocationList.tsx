import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  Divider, 
  Box, 
  Avatar, 
  Chip,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { Location } from '../types/types';

interface LocationListProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

export const LocationList: React.FC<LocationListProps> = ({ locations, onEdit, onDelete }) => {
  const theme = useTheme();
  
  if (locations.length === 0) {
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: theme.shadows[1]
      }}>
        <LocationIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No locations found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add a new location to get started
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ 
      width: '100%', 
      bgcolor: 'background.paper',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: theme.shadows[1]
    }}>
      {locations.map((location, index) => (
        <React.Fragment key={location.id}>
          <ListItem 
            alignItems="flex-start"
            sx={{
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              },
              p: 0,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2,
              pr: 1,
              flex: '0 0 auto',
            }}>
              <Avatar 
                sx={{ 
                  bgcolor: location.isActive ? 'success.light' : 'grey.300',
                  color: location.isActive ? 'success.contrastText' : 'grey.700',
                  width: 40,
                  height: 40,
                  mr: 2,
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                {location.name.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            
            <ListItemText
              sx={{ 
                my: 1.5,
                pr: 8,
                '& .MuiListItemText-primary': {
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 0.5
                },
                '& .MuiListItemText-secondary': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }
              }}
              primary={
                <>
                  <Typography 
                    component="span" 
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {location.name}
                  </Typography>
                  <Chip 
                    label={location.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={location.isActive ? 'success' : 'default'}
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: 0.5
                    }}
                  />
                </>
              }
              secondary={
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7 }} />
                    <Typography variant="body2" color="text.secondary">
                      {[location.address, location.city, location.state, location.zipCode].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
                    {location.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7 }} />
                        <Typography 
                          variant="body2" 
                          component="a"
                          href={`tel:${location.phone}`}
                          sx={{ 
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {location.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {location.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7 }} />
                        <Typography 
                          variant="body2" 
                          component="a"
                          href={`mailto:${location.email}`}
                          sx={{ 
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {location.email}
                        </Typography>
                      </Box>
                    )}
                    
                    {location.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <WebsiteIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7 }} />
                        <Typography 
                          variant="body2" 
                          component="a"
                          href={location.website.startsWith('http') ? location.website : `https://${location.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: 'primary.main',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {location.website.replace(/^https?:\/\//, '').split('/')[0]}
                          <OpenInNewIcon sx={{ fontSize: 12, ml: 0.25, opacity: 0.8 }} />
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              }
            />
            
            <ListItemSecondaryAction sx={{ right: 8, top: '50%', transform: 'translateY(-50%)' }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(location)}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(location.id)}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: 'error.main'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {location.updatedAt && (
                <Typography 
                  variant="caption" 
                  color="text.disabled"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                    fontSize: '0.65rem',
                    whiteSpace: 'nowrap',
                    pr: 0.5
                  }}
                >
                  Updated {new Date(location.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          {index < locations.length - 1 && (
            <Divider 
              component="li" 
              sx={{
                mx: 2,
                '&:last-child': {
                  display: 'none'
                }
              }} 
            />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};
