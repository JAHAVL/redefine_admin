/**
 * Locations Widget Theme
 * 
 * Theme configuration aligned with the application's brand colors and design system.
 * Uses a light theme with subtle backgrounds and appropriate accent colors for location-based features.
 */

// Define theme types for better TypeScript support
interface TextColors {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
}

interface ThemeColors {
    // Brand colors
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    
    // Status colors
    success: string;
    warning: string;
    danger: string;
    dangerDark: string;
    info: string;
    
    // Background colors
    background: string;
    card: string;
    highlight: string;
    mapBackground: string;
    
    // Text colors
    text: TextColors;
    
    // Border and shadow colors
    border: string;
    shadow: string;
}

interface ThemeSpacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
}

interface ThemeTypography {
    fontFamily: string;
    fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
    };
    fontWeights: {
        light: number;
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
    };
    lineHeights: {
        tight: string;
        normal: string;
        relaxed: string;
    };
}

interface ThemeBreakpoints {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

interface Theme {
    colors: ThemeColors;
    spacing: ThemeSpacing;
    typography: ThemeTypography;
    breakpoints: ThemeBreakpoints;
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    transitions: {
        quick: string;
        default: string;
        slow: string;
    };
}

// Create and export the theme
export const theme: Theme = {
    colors: {
        // Brand colors
        primary: '#3f51b5',      // Primary blue color
        primaryDark: '#303f9f',  // Darker blue for hover states
        primaryLight: '#7986cb', // Lighter blue for backgrounds
        secondary: '#f50057',    // Secondary pink color
        accent: '#ff4081',       // Accent pink color
        
        // Status colors
        success: '#4caf50',      // Green for success states
        warning: '#ff9800',      // Orange for warning states
        danger: '#f44336',       // Red for error/danger states
        dangerDark: '#d32f2f',   // Darker red
        info: '#2196f3',         // Blue for informational states
        
        // Background colors
        background: '#f5f7fa',   // Light gray/blue main background
        card: '#ffffff',         // White card background
        highlight: '#e3f2fd',    // Light blue highlight
        mapBackground: '#e5eef9', // Slightly blue map background
        
        // Text colors
        text: {
            primary: '#263238',   // Near black for primary text
            secondary: '#546e7a', // Dark gray for secondary text
            light: '#b0bec5',     // Light gray for disabled text
            dark: '#000000'       // Black text for high contrast
        },
        
        // Border and shadow colors
        border: '#e0e0e0',       // Light gray border
        shadow: 'rgba(0, 0, 0, 0.1)' // Shadow with 10% opacity
    },
    
    spacing: {
        xs: '0.25rem',  // 4px
        sm: '0.5rem',   // 8px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
        xxl: '3rem'     // 48px
    },
    
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSizes: {
            xs: '0.75rem',  // 12px
            sm: '0.875rem', // 14px
            md: '1rem',     // 16px
            lg: '1.25rem',  // 20px
            xl: '1.5rem',   // 24px
            xxl: '2rem'     // 32px
        },
        fontWeights: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        },
        lineHeights: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75'
        }
    },
    
    breakpoints: {
        xs: '0px',
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px'
    },
    
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px'
    },
    
    transitions: {
        quick: '0.1s ease-in-out',
        default: '0.2s ease-in-out',
        slow: '0.3s ease-in-out'
    }
};

export default theme;
