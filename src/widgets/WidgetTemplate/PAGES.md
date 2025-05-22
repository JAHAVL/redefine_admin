# Widget Pages Template

This template outlines the pages that should be created in the main application to use this widget effectively. Replace all placeholders (like `WidgetName`) with your actual widget name.

## Required Pages

### 1. WidgetName Dashboard
- **Path**: `/widget-name`
- **Component**: `WidgetNamePage`
- **Description**: Main page showing the primary interface for the widget.

### 2. WidgetName Details
- **Path**: `/widget-name/:id`
- **Component**: `WidgetNameDetailsPage`
- **Description**: Shows detailed information about a specific item.

### 3. WidgetName Settings
- **Path**: `/widget-name/settings`
- **Component**: `WidgetNameSettingsPage`
- **Description**: Configuration and settings for the widget.

## Optional Pages

### 4. Create New Item
- **Path**: `/widget-name/new`
- **Component**: `CreateWidgetNamePage`
- **Description**: Form to create a new item.

### 5. Edit Item
- **Path**: `/widget-name/:id/edit`
- **Component**: `EditWidgetNamePage`
- **Description**: Form to edit an existing item.

## Implementation Notes

1. Update route definitions in your application's routing configuration.
2. Create corresponding page components in your `pages` directory.
3. Import and use the widget components in these pages.
4. Ensure proper TypeScript types and interfaces are defined.
5. Add any required API services or context providers.


## Implementation Notes

1. Each page should wrap the corresponding widget component with the application's layout and any additional context providers.
2. The widget exports all necessary components and hooks that these pages will need.
3. Page components should handle data fetching and pass the necessary props to the widget components.

## Example Implementation

```tsx
// Example LocationsPage.tsx
import React from 'react';
import MainPageTemplate from '../../layouts/MainPageTemplate';
import { LocationsDashboard } from '../../widgets/Locations';

const LocationsPage: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Locations">
      <LocationsDashboard />
    </MainPageTemplate>
  );
};

export default LocationsPage;
```
