import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

interface LocationStatusChipProps {
  isActive: boolean;
  size?: 'small' | 'medium';
}

/**
 * A reusable chip component to show location status (active or inactive)
 */
export const LocationStatusChip: React.FC<LocationStatusChipProps> = ({ 
  isActive, 
  size = 'small'
}) => {
  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      size={size}
      icon={isActive ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
      color={isActive ? 'success' : 'default'}
      sx={{ 
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        height: size === 'small' ? '24px' : '32px'
      }}
    />
  );
};

export default LocationStatusChip;
