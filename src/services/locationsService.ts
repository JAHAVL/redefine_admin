import { Location } from '../widgets/Locations/types/types';

/**
 * Fetches a location by its ID
 * 
 * @param id The unique identifier of the location to fetch
 * @returns Promise containing the location data or null if not found
 */
export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    // In a real application, this would make an API call to fetch location data
    // For now, we're mocking the response
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock location data
    const location: Location = {
      id,
      name: 'Sample Location',
      address: '123 Main Street',
      city: 'Sample City',
      state: 'Sample State',
      zipCode: '12345',
      country: 'United States',
      latitude: 40.7128,
      longitude: -74.0060,
      phone: '(555) 123-4567',
      email: 'contact@samplelocation.com',
      website: 'https://www.samplelocation.com',
      description: 'This is a sample location description. It provides information about the services and facilities available at this location. The description can be several sentences long to give adequate information to users.',
      imageUrl: 'https://via.placeholder.com/400x300',
      isActive: true,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-04-10').toISOString()
    };
    
    return location;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

/**
 * Fetches all locations
 * 
 * @returns Promise containing an array of locations
 */
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    // In a real application, this would make an API call to fetch locations
    // For now, we're mocking the response
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock location data
    const locations: Location[] = [
      {
        id: '1',
        name: 'Downtown Office',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        latitude: 40.7128,
        longitude: -74.0060,
        phone: '(555) 123-4567',
        email: 'downtown@example.com',
        website: 'https://www.example.com/downtown',
        description: 'Our main downtown office location with full services.',
        imageUrl: 'https://via.placeholder.com/400x300',
        isActive: true,
        createdAt: new Date('2023-01-15').toISOString(),
        updatedAt: new Date('2023-04-10').toISOString()
      },
      {
        id: '2',
        name: 'Uptown Branch',
        address: '456 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        country: 'United States',
        latitude: 40.7621,
        longitude: -73.9715,
        phone: '(555) 987-6543',
        email: 'uptown@example.com',
        website: 'https://www.example.com/uptown',
        description: 'Our uptown branch serving the northern districts.',
        imageUrl: 'https://via.placeholder.com/400x300',
        isActive: true,
        createdAt: new Date('2023-02-20').toISOString(),
        updatedAt: new Date('2023-05-15').toISOString()
      },
      {
        id: '3',
        name: 'West Side Location',
        address: '789 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10019',
        country: 'United States',
        latitude: 40.7631,
        longitude: -73.9845,
        phone: '(555) 456-7890',
        email: 'westside@example.com',
        website: 'https://www.example.com/westside',
        description: 'Our west side branch with extended opening hours.',
        imageUrl: 'https://via.placeholder.com/400x300',
        isActive: false,
        createdAt: new Date('2023-03-10').toISOString(),
        updatedAt: new Date('2023-06-05').toISOString()
      }
    ];
    
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};
