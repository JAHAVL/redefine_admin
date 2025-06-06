/**
 * File Manager Widget Theme
 * 
 * This file contains all theme-related variables for the File Manager widget,
 * including colors, fonts, spacing, and other design tokens.
 * Designed to match the overall application theme and branding.
 */

// Color Palette - Aligned with redefine.church branding
const colors = {
  primary: {
    main: '#3478ff', // Blue primary color from the application
    light: '#5b9eff',
    dark: '#2361d9',
    contrastText: '#ffffff',
    transparent: 'rgba(52, 120, 255, 0.1)',
    transparentActive: 'rgba(52, 120, 255, 0.2)'
  },
  secondary: {
    main: '#6c757d',
    light: '#868e96',
    dark: '#495057',
    contrastText: '#ffffff'
  },
  background: {
    main: '#171717', // Matching the dark theme background from TaskManagerPage.css
    light: '#222222',
    dark: '#121212',
    header: '#171717', // Matching the header background
    transparent: 'rgba(23, 23, 23, 0.8)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    card: 'rgba(34, 34, 34, 0.5)',
    hover: 'rgba(52, 120, 255, 0.05)'
  },
  text: {
    primary: '#ffffff', // Matching the dark theme text color
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    hint: 'rgba(255, 255, 255, 0.5)'
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    main: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.3)'
  },
  status: {
    success: '#4caf50',
    info: '#3478ff', // Using primary blue for info
    warning: '#ff9800',
    error: '#f44336'
  },
  // Adding interactive colors to fix TypeScript errors
  interactive: {
    hover: 'rgba(52, 120, 255, 0.1)',
    active: 'rgba(52, 120, 255, 0.2)'
  }
};

// Typography - Using Open Sans to match the application
const typography = {
  fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  },
  lineHeight: {
    xs: 1.25,
    sm: 1.43,
    md: 1.5,
    lg: 1.66,
    xl: 1.75
  }
};

// Spacing
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem'
};

// Border radius
const borderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  circle: '50%',
  // Adding round as an alias for circle to fix TypeScript errors
  round: '50%'
};

// Shadows with blue accent matching the primary color
const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  md: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  glow: '0 0 15px rgba(52, 120, 255, 0.5)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.2)'
};

// Transitions
const transitions = {
  fast: '0.1s ease',
  normal: '0.2s ease',
  slow: '0.3s ease'
};

// Z-index
const zIndex = {
  tooltip: 1500,
  modal: 1400,
  popover: 1300,
  dropdown: 1200,
  header: 1100,
  drawer: 1000
};

// Gradients - Adding to fix TypeScript errors
const gradients = {
  primary: 'linear-gradient(135deg, #3478ff 0%, #2361d9 100%)',
  secondary: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
};

// Export the theme object
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  gradients
};

export default theme;
