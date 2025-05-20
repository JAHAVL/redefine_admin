import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Location, LocationFormData } from '../../types/types';
import LocationForm from '../LocationForm';

interface CreateLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<void>;
  initialData?: Partial<Location>;
  title?: string;
  submitButtonText?: string;
  isLoading?: boolean;
}

export const CreateLocationModal: React.FC<CreateLocationModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Add New Location',
  submitButtonText = 'Create Location',
  isLoading = false,
}) => {
  const handleSubmit = async (data: LocationFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting location:', error);
      // Error handling is done in the form component
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose}
            aria-label="close"
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <LocationForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitButtonText={submitButtonText}
            isLoading={isLoading}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="location-form" 
          variant="contained" 
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
