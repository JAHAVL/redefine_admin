# Locations Widget - Required Pages

This document outlines the pages that need to be created in the main application to use the Locations widget effectively.

## Core Pages

### 1. Locations Dashboard
- **Path**: `/locations`
- **Component**: `LocationsPage`
- **Description**: Main dashboard showing all locations with multiple view options and management features.
- **Features**:
  - Toggle between grid, list, and map views
  - Advanced search and filtering
  - Sort by name, city, state, or last updated
  - Bulk actions (export, status change)
  - Responsive design for all screen sizes

### 2. Location Details
- **Path**: `/locations/:id`
- **Component**: `LocationDetailsPage`
- **Access**: Opened by clicking on a location in the dashboard (not in main navigation)
- **Description**: Detailed view of a single location with all relevant information.
- **Features**:
  - Location information display
  - Interactive map with location marker
  - Edit and delete actions (opens edit modal)
  - Related locations or nearby points of interest
  - Activity history and audit log
  - Back to list button

### 3. Location Management Modals

#### Create Location Modal
- **Triggered from**: "Add Location" button on dashboard
- **Component**: `CreateLocationModal`
- **Features**:
  - Multi-step form for location details
  - Address validation and geocoding
  - Image upload and preview
  - Form validation
  - Save as draft functionality

#### Edit Location Modal
- **Triggered from**: Edit button on location cards/list items
- **Component**: `EditLocationModal` (uses same form as Create with pre-filled data)
- **Features**:
  - Pre-filled form with current location data
  - Change tracking
  - Version history
  - Save and preview options

## Supporting Pages

### 5. Locations Map View
- **Path**: `/locations/map`
- **Component**: `LocationsMapPage`
- **Description**: Interactive map showing all locations.
- **Features**:
  - Full-screen map interface
  - Cluster markers for nearby locations
  - Filtering by location type/status
  - Search by address or coordinates
  - Export map view

### 6. Location Analytics
- **Path**: `/locations/analytics`
- **Component**: `LocationAnalyticsPage`
- **Description**: Data visualization and insights about locations.
- **Features**:
  - Location distribution by region
  - Activity metrics
  - Status overview
  - Custom report generation
  - Data export options

### 7. Import/Export Locations
- **Path**: `/locations/import-export`
- **Component**: `LocationImportExportPage`
- **Description**: Tools for bulk location management.
- **Features**:
  - CSV/Excel import
  - Data mapping for imports
  - Export filtered results
  - Template downloads
  - Import history and status tracking

## Navigation Structure

```
/locations
├── / (dashboard)
├── /new
├── /map
├── /analytics
├── /import-export
└── /:id
    ├── / (details)
    └── /edit
```

## Required Dependencies

- React Router for navigation
- Form handling (Formik + Yup recommended)
- Map integration (Google Maps or Mapbox)
- Data visualization library (Chart.js, D3, or similar)
- State management (React Query + Context API)
- UI Component Library (Material-UI)

## Implementation Notes

1. Implement proper route protection for edit/delete actions
2. Add loading states and error boundaries
3. Implement proper form validation
4. Add success/error notifications
5. Ensure mobile responsiveness
6. Implement proper error handling for API calls
7. Add proper TypeScript types for all components
8. Implement proper testing setup
9. Add proper accessibility (a11y) support
10. Implement proper internationalization (i18n) if needed
- **Description**: Shows detailed information about a specific location.
- **Features**:
  - Location details display
  - Edit/Delete actions
  - Associated data (if any)

### 3. Create New Location
- **Path**: `/locations/new`
- **Component**: `CreateLocationPage`
- **Description**: Form to create a new location.
- **Features**:
  - Form validation
  - Map integration for location selection
  - Image upload

### 4. Edit Location
- **Path**: `/locations/:id/edit`
- **Component**: `EditLocationPage`
- **Description**: Form to edit an existing location.
- **Features**:
  - Pre-filled form with existing data
  - Form validation
  - Map integration for location updates

### 5. Locations Map View
- **Path**: `/locations/map`
- **Component**: `LocationsMapPage`
- **Description**: Interactive map showing all locations.
- **Features**:
  - Interactive map with location markers
  - Info windows with location details
  - Cluster markers for nearby locations

## Implementation Notes

1. **Routing**:
   - All routes should be protected and require authentication
   - Use React Router v6 for routing

2. **Layout**:
   - Each page should be wrapped in the application's main layout
   - Use the `MainPageTemplate` for consistent page structure

3. **State Management**:
   - Use React Query for server state management
   - Use Context API or Redux for global state if needed

4. **API Integration**:
   - All API calls should go through the `api.ts` service
   - Handle loading and error states appropriately

5. **Responsive Design**:
   - Ensure all pages work well on mobile devices
   - Use Material-UI's responsive utilities

## Example Implementation

### LocationsPage.tsx
```tsx
import React from 'react';
import MainPageTemplate from '../../layouts/MainPageTemplate';
import LocationsWidget from '../../widgets/Locations';

const LocationsPage: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations">
      <LocationsWidget />
    </MainPageTemplate>
  );
};

export default LocationsPage;
```

### AppRoutes.tsx
```tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LocationsPage from '../pages/Locations/LocationsPage';
import LocationDetailsPage from '../pages/Locations/LocationDetailsPage';
import CreateLocationPage from '../pages/Locations/CreateLocationPage';
import EditLocationPage from '../pages/Locations/EditLocationPage';
import LocationsMapPage from '../pages/Locations/LocationsMapPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/locations" element={
        <ProtectedRoute>
          <LocationsPage />
        </ProtectedRoute>
      } />
      <Route path="/locations/map" element={
        <ProtectedRoute>
          <LocationsMapPage />
        </ProtectedRoute>
      } />
      <Route path="/locations/new" element={
        <ProtectedRoute>
          <CreateLocationPage />
        </ProtectedRoute>
      } />
      <Route path="/locations/:id" element={
        <ProtectedRoute>
          <LocationDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/locations/:id/edit" element={
        <ProtectedRoute>
          <EditLocationPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
```
