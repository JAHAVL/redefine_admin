import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { Location } from '../types/types';

interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  onRowClick?: (location: Location) => void;
}

export const LocationTable: React.FC<LocationTableProps> = ({ locations, onEdit, onDelete, onRowClick }) => {
  return (
    <TableContainer component={Paper} sx={{ 
      backgroundColor: 'var(--secondary-color, #202020)', 
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: 'var(--accent-color, #202020)',
            '& th': { 
              color: 'var(--text-light, #ffffff)',
              fontWeight: 600,
              borderBottom: '1px solid var(--border-color, #393737)'
            }
          }}>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">View on Map</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((location) => (
            <TableRow 
              key={location.id} 
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: 'var(--hover-bg, #353535)' },
                '& .MuiTableCell-root': {
                  color: 'var(--text-light, #ffffff)',
                  borderBottom: '1px solid var(--border-color, #393737)'
                },
                cursor: onRowClick ? 'pointer' : 'default'
              }}
            >
              <TableCell component="th" scope="row">
                <Typography sx={{ fontWeight: 600, color: 'var(--text-light, #ffffff)' }}>
                  {location.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationIcon 
                    sx={{ 
                      color: 'var(--text-muted, rgba(255, 255, 255, 0.5))', 
                      fontSize: 18, 
                      mt: 0.25, 
                      mr: 1 
                    }} 
                  />
                  <Typography variant="body2">
                    {[location.address, location.city, location.state, location.zipCode].filter(Boolean).join(', ')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {location.email && (
                  <Typography 
                    variant="body2" 
                    component="a" 
                    href={`mailto:${location.email}`}
                    sx={{ 
                      display: 'block',
                      color: 'var(--primary-color, #3478ff)',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {location.email}
                  </Typography>
                )}
                {location.phone && (
                  <Typography 
                    variant="body2" 
                    component="a" 
                    href={`tel:${location.phone}`}
                    sx={{ 
                      display: 'block',
                      color: 'var(--text-muted, rgba(255, 255, 255, 0.5))',
                      textDecoration: 'none',
                      mt: 0.5
                    }}
                  >
                    {location.phone}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={location.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{ 
                    fontWeight: 600,
                    color: 'var(--text-light, #ffffff)',
                    backgroundColor: location.isActive ? 'var(--primary-color, #3478ff)' : 'var(--border-color, #393737)'
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Open in Google Maps">
                  <IconButton
                    size="small"
                    href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'var(--primary-color, #3478ff)' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(location)}
                    sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.5))' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(location.id)}
                    sx={{ color: 'var(--text-muted, rgba(255, 255, 255, 0.5))' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
