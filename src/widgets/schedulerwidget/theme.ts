// Theme configuration for the Scheduler Widget
// This ensures consistent styling across the widget components

export const theme = {
  colors: {
    primary: '#4a6cf7',
    primaryDark: '#3a5ce5',
    secondary: '#f8f9fa',
    accent: '#ff9800',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336',
    dangerDark: '#d32f2f',
    background: '#f0f2f5',
    card: '#ffffff',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#999999',
      white: '#ffffff'
    },
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    round: '50%'
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem'
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease'
  },
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1600px'
  }
};

export default theme;
