import { http, HttpResponse, delay } from 'msw';
import type { HttpHandler } from 'msw';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  services: string[];
  image: string;
}

// Mock data
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Campus',
    address: '123 Church St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    phone: '(555) 123-4567',
    email: 'info@example.com',
    services: ['Sunday Service', 'Bible Study'],
    image: 'https://via.placeholder.com/400x200?text=Main+Campus'
  },
  {
    id: '2',
    name: 'Downtown Campus',
    address: '456 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12346',
    phone: '(555) 234-5678',
    email: 'downtown@example.com',
    services: ['Sunday Service', 'Youth Group'],
    image: 'https://via.placeholder.com/400x200?text=Downtown+Campus'
  }
];

const locationHandlers: HttpHandler[] = [
  // Get all locations
  http.get('/api/locations', async () => {
    await delay(150);
    return HttpResponse.json(mockLocations);
  }),

  // Get single location
  http.get('/api/locations/:id', async ({ params }) => {
    const { id } = params as { id: string };
    const location = mockLocations.find(loc => loc.id === id);
    
    if (!location) {
      return new HttpResponse(
        JSON.stringify({ message: 'Location not found' }),
        { status: 404 }
      );
    }
    
    await delay(150);
    return HttpResponse.json(location);
  }),

  // Create location
  http.post('/api/locations', async ({ request }) => {
    const newLocation = await request.json() as Omit<Location, 'id'>;
    const location: Location = {
      id: (mockLocations.length + 1).toString(),
      ...newLocation
    };
    
    mockLocations.push(location);
    
    await delay(150);
    return HttpResponse.json(location);
  }),

  // Update location
  http.put('/api/locations/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const updates = await request.json() as Partial<Location>;
    const index = mockLocations.findIndex(loc => loc.id === id);
    
    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Location not found' }),
        { status: 404 }
      );
    }
    
    const updatedLocation = {
      ...mockLocations[index],
      ...updates
    };
    
    mockLocations[index] = updatedLocation as Location;
    
    await delay(150);
    return HttpResponse.json(updatedLocation);
  }),

  // Delete location
  http.delete('/api/locations/:id', async ({ params }) => {
    const { id } = params as { id: string };
    const index = mockLocations.findIndex(loc => loc.id === id);
    
    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Location not found' }),
        { status: 404 }
      );
    }
    
    mockLocations.splice(index, 1);
    
    await delay(150);
    return HttpResponse.json({ message: 'Location deleted' });
  })
];

const handlers: HttpHandler[] = [...locationHandlers];

export { locationHandlers, handlers };
