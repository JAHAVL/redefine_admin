/**
 * Locations Widget - Main Export File
 * 
 * This file exports all components and utilities from the Locations widget.
 */

import LocationsWidget from './LocationsWidget';
import * as actions from './actions';
import * as types from './types';
import locationsApi from './api';
import LocationsTheme from './theme';

// Export components
export { default as LocationCard } from './components/LocationCard';
export { default as LocationsTable } from './components/LocationsTable';
export { default as LocationForm } from './components/LocationForm';

// Export main widget
export { LocationsWidget };

// Export utilities
export { actions, types, locationsApi, LocationsTheme };

// Default export
export default LocationsWidget;
