# Locations Widget

## Overview

The Locations Widget provides a comprehensive interface for managing physical locations within the redefine.church application. It allows administrators to create, view, edit, and delete location entries with geographic coordinates, addresses, and notification settings.

## Features

- **Dual View Modes**: Toggle between grid and list views for location management
- **Interactive Map Integration**: Utilizes Google Maps API for address search and coordinate selection
- **CRUD Operations**: Complete set of Create, Read, Update, and Delete operations
- **Search & Filter**: Quickly find locations by name or address
- **Responsive Design**: Adapts to different screen sizes with a consistent dark theme
- **AI Integration**: Standardized actions for AI-driven interaction

## Architecture

### Directory Structure

```
src/widgets/Locations/
├── README.md                 # Documentation (this file)
├── LocationsWidget.tsx       # Main widget component
├── actions.ts                # API interaction and AI-compatible actions
├── theme.ts                  # Styling variables and theme configuration
├── types.ts                  # TypeScript interfaces and type definitions
└── components/               # Reusable UI components
    ├── LocationCard.tsx      # Grid view item component
    ├── LocationsTable.tsx    # List view component
    └── LocationForm.tsx      # Create/edit form component
```

### Key Components

- **LocationsWidget**: The main container component that orchestrates the widget's functionality
- **LocationCard**: Card component for the grid view display of locations
- **LocationsTable**: Table component for the list view display of locations
- **LocationForm**: Form component for creating and editing locations

## API Endpoints

The Locations Widget interacts with the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/locations` | GET | Retrieve all locations |
| `/api/locations/{id}` | GET | Retrieve a specific location |
| `/api/locations` | POST | Create a new location |
| `/api/locations/{id}` | PUT | Update an existing location |
| `/api/locations/{id}` | DELETE | Delete a location |

## Data Types

### Location

```typescript
interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  max_distance_to_notify: number;
  created_at?: string;
  updated_at?: string;
}
```

### LocationFormData

```typescript
interface LocationFormData {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  max_distance_to_notify: number | null;
}
```

## AI Integration

The Locations Widget is designed to be fully controllable through AI interactions. The following actions are available:

### Navigation Actions

- `viewLocations()`: Navigate to the locations management page

### Data Operations

- `getLocations()`: Retrieve all locations
- `getLocation(locationId)`: Retrieve a specific location by ID
- `createLocation(locationData)`: Create a new location
- `updateLocation(locationId, locationData)`: Update an existing location
- `deleteLocation(locationId)`: Delete a location

## Usage Examples

### Creating a New Location

```typescript
import { createLocation } from './widgets/Locations/actions';

// Create a new location
const newLocation = {
  name: 'Downtown Campus',
  address: '123 Main St, New York, NY 10001',
  latitude: 40.7128,
  longitude: -74.0060,
  max_distance_to_notify: 1000
};

createLocation(newLocation)
  .then(response => console.log('Location created:', response))
  .catch(error => console.error('Error creating location:', error));
```

### AI Integration Example

```typescript
// Example of AI handling a user request to add a new location
async function handleUserRequest(userRequest) {
  if (userRequest.includes('add new location')) {
    // Navigate to locations page
    viewLocations();
    
    // Extract location details from user request
    const locationData = extractLocationData(userRequest);
    
    // Create the location
    const operationId = `create_location_${Date.now()}`;
    operationService.registerOperation(operationId, 'create_location');
    
    try {
      const result = await createLocation(locationData);
      operationService.updateStatus(operationId, 'completed', 'Location created successfully');
      return `Created new location: ${result.name}`;
    } catch (error) {
      operationService.updateStatus(operationId, 'failed', 'Failed to create location');
      return 'Sorry, I could not create the location. Please try again.';
    }
  }
}
```

## External Dependencies

- **Google Maps API**: Used for map display, address search, and coordinate selection
- **Styled Components**: Used for component styling
- **React Icons**: Used for UI icons
- **SweetAlert2**: Used for interactive dialogs and notifications
- **Axios**: Used for API requests (via apiService)

## Best Practices

1. **Error Handling**: All API interactions include proper error handling and user feedback
2. **Type Safety**: TypeScript interfaces ensure data consistency
3. **Responsive Design**: UI adapts to different screen sizes
4. **Accessibility**: Components follow accessibility best practices
5. **Performance**: Optimized rendering with React hooks and memoization

## Integration with Other Widgets

The Locations Widget can be integrated with other widgets in the application:

- **Events Widget**: Associate events with specific locations
- **Notifications Widget**: Send proximity-based notifications to users
- **Maps Widget**: Display multiple locations on a map interface
- **Check-in Widget**: Allow users to check in at specific locations
