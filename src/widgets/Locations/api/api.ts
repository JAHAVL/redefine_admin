import { Location, LocationFilters } from '../types/types';

// Mock data for development
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Office',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.0060,
    phone: '(555) 123-4567',
    email: 'downtown@example.com',
    website: 'https://example.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Add more mock locations as needed
];

export const getLocations = async (filters?: LocationFilters): Promise<Location[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...mockLocations];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        results = results.filter(loc => 
          loc.name.toLowerCase().includes(search) ||
          loc.address.toLowerCase().includes(search) ||
          loc.city.toLowerCase().includes(search)
        );
      }
      
      if (filters?.city) {
        results = results.filter(loc => 
          loc.city.toLowerCase() === filters.city?.toLowerCase()
        );
      }
      
      if (filters?.state) {
        results = results.filter(loc => 
          loc.state.toLowerCase() === filters.state?.toLowerCase()
        );
      }
      
      if (filters?.isActive !== undefined) {
        results = results.filter(loc => loc.isActive === filters.isActive);
      }
      
      resolve(results);
    }, 300); // Simulate network delay
  });
};

export const getLocationById = async (id: string): Promise<Location | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLocations.find(loc => loc.id === id));
    }, 200);
  });
};

export const createLocation = async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLocation: Location = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockLocations.push(newLocation);
      resolve(newLocation);
    }, 300);
  });
};

export const updateLocation = async (id: string, data: Partial<Location>): Promise<Location> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLocations.findIndex(loc => loc.id === id);
      if (index === -1) {
        reject(new Error('Location not found'));
        return;
      }
      
      const updatedLocation = {
        ...mockLocations[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      mockLocations[index] = updatedLocation;
      resolve(updatedLocation);
    }, 300);
  });
};

export const deleteLocation = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLocations.findIndex(loc => loc.id === id);
      if (index === -1) {
        reject(new Error('Location not found'));
        return;
      }
      
      mockLocations.splice(index, 1);
      resolve();
    }, 300);
  });
};
