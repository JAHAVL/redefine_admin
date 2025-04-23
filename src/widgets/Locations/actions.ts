import apiService from '../../services/api';
import navigationService from '../../services/navigationService';
import operationService from '../../services/operationService';
import { Location, LocationFormData } from './types';

/**
 * Locations module actions
 * These functions represent high-level actions that can be triggered by the AI
 * Each function has a clear, intent-mappable name and consistent parameter patterns
 */

// Navigation actions

/**
 * Navigate to locations page
 */
export const viewLocations = (): void => {
  navigationService.navigateTo('/locations');
};

// Location operations

/**
 * Get all locations
 * @returns Promise with locations data
 */
export const getLocations = async (): Promise<Location[]> => {
  try {
    console.log('Making API request to: /api/locations');
    const response = await apiService.get('/api/locations');
    console.log('Raw API response:', response);
    
    // Handle the API response format
    let locations = [];
    if (Array.isArray(response.data)) {
      console.log('Response data is an array');
      locations = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      console.log('Response data has a nested data array property');
      locations = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      console.log('Response data is an object, checking for locations property');
      // Try to find a property that might contain the locations array
      const possibleArrayProps = ['locations', 'items', 'results', 'records'];
      for (const prop of possibleArrayProps) {
        if (response.data[prop] && Array.isArray(response.data[prop])) {
          console.log(`Found locations in property: ${prop}`);
          locations = response.data[prop];
          break;
        }
      }
      
      // If we still don't have locations, check if the response itself is a location object
      if (locations.length === 0 && response.data.id && response.data.name) {
        console.log('Response appears to be a single location object');
        locations = [response.data];
      }
    }
    
    // Validate the locations data
    locations = locations.filter((loc: any) => {
      const isValid = loc && typeof loc === 'object' && loc.id && loc.name;
      if (!isValid) {
        console.warn('Filtered out invalid location object:', loc);
      }
      return isValid;
    });
    
    console.log(`Returning ${locations.length} valid locations`);
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error; // Rethrow to allow the component to handle the error
  }
};

/**
 * Get a specific location
 * @param locationId ID of the location to retrieve
 * @returns Promise with location data
 */
export const getLocation = async (locationId: string): Promise<Location | null> => {
  try {
    const response = await apiService.get(`/api/locations/${locationId}`);
    
    // Handle different response formats
    let location = null;
    
    if (response.data && response.data.data && typeof response.data.data === 'object') {
      location = response.data.data;
    } else if (response.data && typeof response.data === 'object' && response.data.id) {
      location = response.data;
    }
    
    // Validate the location data
    if (location && location.id && location.name) {
      return location;
    } else {
      console.warn('Invalid location data received:', location);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching location ${locationId}:`, error);
    throw error; // Rethrow to allow the component to handle the error
  }
};

/**
 * Create a new location
 * @param locationData Location data to create
 * @returns Promise with created location
 */
export const createLocation = async (locationData: LocationFormData): Promise<Location | null> => {
  // Register this as a background operation
  const operationId = `create_location_${Date.now()}`;
  operationService.registerOperation(operationId, 'create_location', { locationData });
  
  try {
    // Use the correct endpoint from the API routes
    const response = await apiService.post('/api/storeLocations', locationData);
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'Location created successfully');
    
    // Handle different response formats
    let newLocation = null;
    
    if (response.data && response.data.data && typeof response.data.data === 'object') {
      newLocation = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      // Check if response is the location object itself
      if (response.data.id && response.data.name) {
        newLocation = response.data;
      } else if (response.data.location) {
        // Some APIs nest the result under a 'location' property
        newLocation = response.data.location;
      }
    }
    
    // Validate the location data
    if (newLocation && newLocation.id) {
      return newLocation;
    } else {
      console.warn('Invalid location data received from create operation:', response.data);
      operationService.updateStatus(operationId, 'failed', 'Invalid response format from server');
      throw new Error('Invalid location data received from server');
    }
  } catch (error) {
    console.error('Error creating location:', error);
    operationService.updateStatus(operationId, 'failed', 'Failed to create location');
    throw error; // Rethrow to allow the component to handle the error
  }
};

/**
 * Update an existing location
 * @param locationId Location ID to update
 * @param locationData Updated location data
 * @returns Promise with updated location
 */
export const updateLocation = async (locationId: string, locationData: LocationFormData): Promise<Location | null> => {
  // Register this as a background operation
  const operationId = `update_location_${locationId}_${Date.now()}`;
  operationService.registerOperation(operationId, 'update_location', { locationId, locationData });
  
  try {
    // Use the correct endpoint from the API routes (POST method as per the route definition)
    const response = await apiService.post(`/api/editLocations/${locationId}`, locationData);
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'Location updated successfully');
    
    // Handle different response formats
    let updatedLocation = null;
    
    if (response.data && response.data.data && typeof response.data.data === 'object') {
      updatedLocation = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      // Check if response is the location object itself
      if (response.data.id && response.data.name) {
        updatedLocation = response.data;
      } else if (response.data.location) {
        // Some APIs nest the result under a 'location' property
        updatedLocation = response.data.location;
      }
    }
    
    // If we still don't have a valid location, try to construct one from the input data
    if (!updatedLocation || !updatedLocation.id) {
      console.warn('Invalid location data received from update operation, using input data with ID:', response.data);
      updatedLocation = {
        id: locationId,
        name: locationData.name,
        address: locationData.address,
        latitude: locationData.latitude || 0,
        longitude: locationData.longitude || 0,
        max_distance_to_notify: locationData.max_distance_to_notify || 1000
      };
    }
    
    return updatedLocation;
  } catch (error) {
    console.error(`Error updating location ${locationId}:`, error);
    operationService.updateStatus(operationId, 'failed', 'Failed to update location');
    throw error; // Rethrow to allow the component to handle the error
  }
};

/**
 * Delete a location
 * @param locationId Location ID to delete
 * @returns Promise with success status
 */
export const deleteLocation = async (locationId: string): Promise<boolean> => {
  // Register this as a background operation
  const operationId = `delete_location_${locationId}_${Date.now()}`;
  operationService.registerOperation(operationId, 'delete_location', { locationId });
  
  try {
    // Use the correct endpoint from the API routes (GET method as per the route definition)
    const response = await apiService.get(`/api/delete_locations/${locationId}`);
    
    // Check response for success indication
    let success = true;
    
    // Some APIs return a specific success flag
    if (response.data && typeof response.data === 'object') {
      if (response.data.success === false) {
        success = false;
      } else if (response.data.error) {
        success = false;
      }
    }
    
    if (success) {
      // Update operation status
      operationService.updateStatus(operationId, 'completed', 'Location deleted successfully');
      return true;
    } else {
      console.warn('API indicated failure in delete operation response:', response.data);
      operationService.updateStatus(operationId, 'failed', 'Server indicated deletion failed');
      return false;
    }
  } catch (error) {
    console.error(`Error deleting location ${locationId}:`, error);
    operationService.updateStatus(operationId, 'failed', 'Failed to delete location');
    throw error; // Rethrow to allow the component to handle the error
  }
};

/**
 * Share a location with users
 * @param locationId Location ID to share
 * @param userIds Array of user IDs to share with
 * @returns Promise with updated location
 */
export const shareLocationWithUsers = async (locationId: string, userIds: string[]): Promise<Location | null> => {
  // Register this as a background operation
  const operationId = `share_location_${locationId}_${Date.now()}`;
  operationService.registerOperation(operationId, 'share_location', { locationId, userIds });
  
  try {
    const response = await apiService.post(`/api/locations/${locationId}/share`, {
      user_ids: userIds,
      access: 'shared'
    });
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'Location shared successfully');
    
    // Handle different response formats
    let updatedLocation = null;
    
    if (response.data && response.data.data && typeof response.data.data === 'object') {
      updatedLocation = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      // Check if response is the location object itself
      if (response.data.id && response.data.name) {
        updatedLocation = response.data;
      } else if (response.data.location) {
        // Some APIs nest the result under a 'location' property
        updatedLocation = response.data.location;
      }
    }
    
    // If we still don't have a valid location, construct a basic one
    if (!updatedLocation || !updatedLocation.id) {
      const existingLocation = await getLocation(locationId);
      if (existingLocation) {
        updatedLocation = {
          ...existingLocation,
          shared: true,
          shared_with: userIds
        };
      }
    }
    
    return updatedLocation;
  } catch (error) {
    console.error(`Error sharing location ${locationId}:`, error);
    operationService.updateStatus(operationId, 'failed', 'Failed to share location');
    throw error;
  }
};

/**
 * Share a location with groups
 * @param locationId Location ID to share
 * @param groupIds Array of group IDs to share with
 * @param permissionLevel Permission level for the groups
 * @returns Promise with updated location
 */
export const shareLocationWithGroups = async (
  locationId: string, 
  groupIds: string[], 
  permissionLevel: 'read' | 'write' | 'admin' = 'read'
): Promise<Location | null> => {
  // Register this as a background operation
  const operationId = `share_location_groups_${locationId}_${Date.now()}`;
  operationService.registerOperation(operationId, 'share_location_groups', { locationId, groupIds, permissionLevel });
  
  try {
    const response = await apiService.post(`/api/locations/${locationId}/share-groups`, {
      group_ids: groupIds,
      permission_level: permissionLevel
    });
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'Location shared with groups successfully');
    
    // Handle different response formats
    let updatedLocation = null;
    
    if (response.data && response.data.data && typeof response.data.data === 'object') {
      updatedLocation = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      if (response.data.id && response.data.name) {
        updatedLocation = response.data;
      } else if (response.data.location) {
        updatedLocation = response.data.location;
      }
    }
    
    // If we still don't have a valid location, construct a basic one
    if (!updatedLocation || !updatedLocation.id) {
      const existingLocation = await getLocation(locationId);
      if (existingLocation) {
        updatedLocation = {
          ...existingLocation,
          shared: true,
          shared_groups: groupIds.map(id => ({
            id,
            name: `Group ${id}`,
            type: 'custom',
            permission_level: permissionLevel
          }))
        };
      }
    }
    
    return updatedLocation;
  } catch (error) {
    console.error(`Error sharing location ${locationId} with groups:`, error);
    operationService.updateStatus(operationId, 'failed', 'Failed to share location with groups');
    throw error;
  }
};

/**
 * Get locations shared with the current user
 * @returns Promise with locations data
 */
export const getSharedWithMe = async (): Promise<Location[]> => {
  try {
    const response = await apiService.get('/api/locations/shared-with-me');
    
    // Handle different response formats
    let locations = [];
    
    if (Array.isArray(response.data)) {
      locations = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      locations = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      // Try to find a property that might contain the locations array
      const possibleArrayProps = ['locations', 'items', 'results', 'records', 'shared_locations'];
      for (const prop of possibleArrayProps) {
        if (response.data[prop] && Array.isArray(response.data[prop])) {
          locations = response.data[prop];
          break;
        }
      }
    }
    
    // Validate the locations data
    locations = locations.filter((loc: any) => {
      const isValid = loc && typeof loc === 'object' && loc.id && loc.name;
      if (!isValid) {
        console.warn('Filtered out invalid location object:', loc);
      }
      return isValid;
    });
    
    return locations;
  } catch (error) {
    console.error('Error fetching shared locations:', error);
    throw error;
  }
};

/**
 * Get locations shared by the current user
 * @returns Promise with locations data
 */
export const getSharedByMe = async (): Promise<Location[]> => {
  try {
    const response = await apiService.get('/api/locations/shared-by-me');
    
    // Handle different response formats
    let locations = [];
    
    if (Array.isArray(response.data)) {
      locations = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      locations = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      // Try to find a property that might contain the locations array
      const possibleArrayProps = ['locations', 'items', 'results', 'records', 'shared_locations'];
      for (const prop of possibleArrayProps) {
        if (response.data[prop] && Array.isArray(response.data[prop])) {
          locations = response.data[prop];
          break;
        }
      }
    }
    
    // Validate the locations data
    locations = locations.filter((loc: any) => {
      const isValid = loc && typeof loc === 'object' && loc.id && loc.name;
      if (!isValid) {
        console.warn('Filtered out invalid location object:', loc);
      }
      return isValid;
    });
    
    return locations;
  } catch (error) {
    console.error('Error fetching locations shared by me:', error);
    throw error;
  }
};

// Export all actions
export default {
  // Navigation
  viewLocations,
  
  // Location operations
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  
  // Sharing operations
  shareLocationWithUsers,
  shareLocationWithGroups,
  getSharedWithMe,
  getSharedByMe
};
