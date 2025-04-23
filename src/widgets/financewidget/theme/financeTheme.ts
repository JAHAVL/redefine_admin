/**
 * Finance Widget Theme Configuration
 * 
 * This file contains all theme variables for the Finance Widget.
 * Customize these values to match your application's branding.
 */

export interface FinanceTheme {
  // Primary UI colors
  colors: {
    primary: string;         // Main brand color
    secondary: string;       // Secondary brand color
    accent: string;          // Accent color for highlights
    
    // Background colors
    background: {
      main: string;          // Main background
      card: string;          // Card background
      highlight: string;     // Highlighted background
    };
    
    // Text colors
    text: {
      primary: string;       // Main text color
      secondary: string;     // Secondary text color
      light: string;         // Light text (on dark backgrounds)
      muted: string;         // Muted/gray text
    };
    
    // Border colors
    border: {
      light: string;         // Light borders
      medium: string;        // Medium borders
      dark: string;          // Dark borders
    };
    
    // State colors
    state: {
      success: string;       // Success state (green)
      successLight: string;  // Light success background
      error: string;         // Error state (red)
      errorLight: string;    // Light error background
      warning: string;       // Warning state (yellow/orange)
      warningLight: string;  // Light warning background
      info: string;          // Info state (blue)
      infoLight: string;     // Light info background
      pending: string;       // Pending state
      pendingLight: string;  // Light pending background
    };
    
    // Financial-specific colors
    finance: {
      positive: string;      // For positive amounts (income)
      negative: string;      // For negative amounts (expenses)
      neutral: string;       // For neutral financial data
    };
  };
  
  // Typography
  typography: {
    fontFamily: string;
    heading: {
      fontWeight: number | string;
      lineHeight: number | string;
    };
    body: {
      fontWeight: number | string;
      lineHeight: number | string;
    };
    fontSize: {
      small: string;
      base: string;
      medium: string;
      large: string;
      xlarge: string;
      xxlarge: string;
    };
  };
  
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  
  // Borders
  border: {
    radius: {
      small: string;
      medium: string;
      large: string;
      round: string;
    };
    width: {
      thin: string;
      medium: string;
      thick: string;
    };
  };
  
  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  
  // Transitions
  transitions: {
    short: string;
    medium: string;
    long: string;
  };
}

/**
 * Default theme for the Finance Widget
 * This can be overridden by the implementing application
 */
export const defaultTheme: FinanceTheme = {
  colors: {
    primary: '#3478ff',      // Blue
    secondary: '#6c757d',    // Gray
    accent: '#5b9eff',       // Light Blue
    
    background: {
      main: '#171717',       // Dark gray (matching app theme)
      card: '#222222',       // Slightly lighter dark gray
      highlight: '#2a2a2a',  // Highlighted dark gray
    },
    
    text: {
      primary: '#ffffff',    // White
      secondary: 'rgba(255, 255, 255, 0.7)',  // Semi-transparent white
      light: '#ffffff',      // White
      muted: 'rgba(255, 255, 255, 0.5)',      // Muted white
    },
    
    border: {
      light: 'rgba(255, 255, 255, 0.1)',      // Very light border
      medium: 'rgba(255, 255, 255, 0.2)',     // Medium border
      dark: 'rgba(255, 255, 255, 0.3)',       // Dark border
    },
    
    state: {
      success: '#4caf50',    // Green
      successLight: 'rgba(76, 175, 80, 0.2)',
      error: '#f44336',      // Red
      errorLight: 'rgba(244, 67, 54, 0.2)',
      warning: '#ff9800',    // Orange/Yellow
      warningLight: 'rgba(255, 152, 0, 0.2)',
      info: '#3478ff',       // Blue
      infoLight: 'rgba(52, 120, 255, 0.2)',
      pending: '#9e9e9e',    // Gray
      pendingLight: 'rgba(158, 158, 158, 0.2)',
    },
    
    finance: {
      positive: '#4caf50',   // Green
      negative: '#f44336',   // Red
      neutral: '#9e9e9e',    // Gray
    },
  },
  
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    heading: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body: {
      fontWeight: 400,
      lineHeight: 1.5,
    },
    fontSize: {
      small: '12px',
      base: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '24px',
      xxlarge: '32px',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  border: {
    radius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '50%',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '3px',
    },
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },
  
  transitions: {
    short: '0.15s ease',
    medium: '0.3s ease',
    long: '0.5s ease',
  },
};

/**
 * Create a custom finance theme by merging with the default theme
 * @param customTheme - Partial theme to override default values
 * @returns Complete theme with custom values merged with defaults
 */
export const createFinanceTheme = (customTheme: Partial<FinanceTheme> = {}): FinanceTheme => {
  // Deep merge to handle nested objects
  return deepMerge(defaultTheme, customTheme);
};

/**
 * Helper function to deep merge objects
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Helper function to check if value is an object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default defaultTheme;
