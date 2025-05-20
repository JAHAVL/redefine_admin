# Locations Widget

## Overview

The Locations Widget provides a comprehensive interface for managing physical locations within the application. It allows administrators to view, create, edit, and manage location information with support for map integration.

## Features

- **Dual View Modes**: Toggle between grid and list views for location management
- **Interactive Map**: View all locations on an interactive map
- **CRUD Operations**: Full support for creating, reading, updating, and deleting locations
- **Search & Filter**: Quickly find locations using search and filter options
- **Responsive Design**: Works on all device sizes

## Directory Structure

```
src/widgets/Locations/
├── README.md                 # This file
├── PAGES.md                  # Documentation of required pages
├── index.tsx                 # Main widget component
├── api.ts                    # API service functions
├── types.ts                  # TypeScript types and interfaces
├── context/                  # React context providers
├── components/               # Reusable UI components
│   ├── LocationCard.tsx      # Grid view item component
│   ├── LocationList.tsx      # List view component
│   ├── LocationForm.tsx      # Create/edit form component
│   ├── LocationMap.tsx       # Map view component
│   └── LocationFilters.tsx   # Filter controls
└── __tests__/                # Test files
```

## Required Dependencies

- `@mui/material`: ^5.0.0
- `@mui/icons-material`: ^5.0.0
- `@emotion/react`: ^11.0.0
- `@emotion/styled`: ^11.0.0
- `react-router-dom`: ^6.0.0
- `react-query`: ^3.0.0
- `@react-google-maps/api`: ^2.0.0 (for map functionality)

## API Integration

The widget requires the following API functions to be implemented in `api.ts`:

```typescript
// Example implementation with mock data
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
  }
];

export const getLocations = async (filters?: LocationFilters): Promise<Location[]> => {
  // Implementation with filtering
  return filteredLocations;
};

export const createLocation = async (data: LocationFormData): Promise<Location> => {
  // Implementation for creating a location
};

export const updateLocation = async (id: string, data: Partial<LocationFormData>): Promise<Location> => {
  // Implementation for updating a location
};

export const deleteLocation = async (id: string): Promise<void> => {
  // Implementation for deleting a location
};
```

## Usage

```tsx
import LocationsWidget from '../../widgets/Locations';

const LocationsPage = () => {
  return (
    <MainPageTemplate pageTitle="Locations">
      <LocationsWidget />
    </MainPageTemplate>
  );
};
```

## API Integration

The widget expects the following API endpoints:

- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get a specific location
- `POST /api/locations` - Create a new location
- `PUT /api/locations/:id` - Update a location
- `DELETE /api/locations/:id` - Delete a location

## Configuration

### Environment Variables

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Troubleshooting

### Blank Screen on Locations Page

**Issue**: The locations page loads but shows only a blank screen with no content.

**Possible Causes and Solutions**:

1. **Missing API Implementation**
   - Ensure all required API functions are implemented in `api.ts`
   - Verify that the functions return data in the expected format
   - Check the browser's console for any error messages

2. **Google Maps API Key**
   - If using the map view, ensure you have set up the Google Maps API key
   - The API key must have the following APIs enabled:
     - Maps JavaScript API
     - Geocoding API
     - Places API

3. **React Query Configuration**
   - The widget uses React Query for data fetching
   - Ensure the `QueryClientProvider` is properly set up in your app's root
   - Check for any network errors in the browser's developer tools

4. **Missing Dependencies**
   - Verify all required dependencies are installed
   - Run `npm install` to ensure all packages are up to date

### Common Errors

- **"getLocations is not a function"**: The API functions are not properly exported from `api.ts`
- **Google Maps not loading**: Check the API key and ensure the required Google APIs are enabled
- **Form validation errors**: The form uses Yup for validation - check the validation schema in `LocationForm.tsx`

## Development

### Available Scripts

In the project directory, you can run:

```bash
# Start the development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Testing

Tests are written using Jest and React Testing Library. Run all tests with:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT[Specify License]
