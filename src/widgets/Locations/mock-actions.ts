/**
 * Mock implementation of the Locations actions
 * This provides the core functionality without external dependencies
 */
import { Location, LocationFormData } from './types';

// Sample data - replace with actual API calls when services are fixed
const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Main Campus', address: '123 Church St, Springfield', status: 'Active' },
  { id: '2', name: 'Downtown Campus', address: '456 Main St, Springfield', status: 'Active' },
  { id: '3', name: 'West Side Location', address: '789 West Ave, Springfield', status: 'Maintenance' },
  { id: '4', name: 'East Campus', address: '321 East Blvd, Springfield', status: 'Active' },
  { id: '5', name: 'North Campus', address: '555 North Rd, Springfield', status: 'Active' },
];

/**
 * Get all locations
 */
export const getLocations = (): Promise<Location[]> => {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...MOCK_LOCATIONS]);
    }, 500);
  });
};

/**
 * Create a new location
 */
export const createLocation = (data: LocationFormData): Promise<Location> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newLocation: Location = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        address: data.address,
        status: data.status || 'Active',
      };
      
      MOCK_LOCATIONS.push(newLocation);
      resolve(newLocation);
    }, 500);
  });
};

/**
 * Update an existing location
 */
export const updateLocation = (id: string, data: LocationFormData): Promise<Location> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_LOCATIONS.findIndex(loc => loc.id === id);
      
      if (index === -1) {
        reject(new Error('Location not found'));
        return;
      }
      
      const updatedLocation: Location = {
        ...MOCK_LOCATIONS[index],
        name: data.name,
        address: data.address,
        status: data.status || MOCK_LOCATIONS[index].status,
      };
      
      MOCK_LOCATIONS[index] = updatedLocation;
      resolve(updatedLocation);
    }, 500);
  });
};

/**
 * Delete a location
 */
export const deleteLocation = (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_LOCATIONS.findIndex(loc => loc.id === id);
      
      if (index === -1) {
        reject(new Error('Location not found'));
        return;
      }
      
      MOCK_LOCATIONS.splice(index, 1);
      resolve(true);
    }, 500);
  });
};

// Add other mock actions as needed
export const shareLocationWithUsers = (locationId: string, userIds: string[]): Promise<boolean> => {
  return Promise.resolve(true);
};

export const shareLocationWithGroups = (locationId: string, groupIds: string[]): Promise<boolean> => {
  return Promise.resolve(true);
};
