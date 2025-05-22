/**
 * Scheduler Widget Theme
 * 
 * Theme configuration aligned with the application's brand colors and design system.
 * Based on the dark theme used throughout the application.
 */

// Define theme types for better TypeScript support
interface TextColors {
    primary: string;
    secondary: string;
    light: string;
    white: string;
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
    
    // Text colors
    text: TextColors;
    
    // Border and shadow colors
    border: string;
    shadow: string;

    // Component-specific color systems
    fileTypes: {
        pdf: string;
        audio: string;
        video: string;
        image: string;
        zip: string;
        document: string;
        other: string;
    };
    
    noteTypes: {
        vocals: string;
        production: string;
        band: string;
        lighting: string;
        audio: string;
        general: string;
    };
    
    noteTypesHover: {
        vocals: string;
        production: string;
        band: string;
        lighting: string;
        audio: string;
        general: string;
    };
    
    sectionTypes: {
        intro: { background: string; text: string; };
        verse: { background: string; text: string; };
        chorus: { background: string; text: string; };
        bridge: { background: string; text: string; };
        outro: { background: string; text: string; };
        default: { background: string; text: string; };
    };
}

interface ThemeSpacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
}

interface ThemeBorderRadius {
    sm: string;
    md: string;
    lg: string;
    round: string;
}

interface ThemeTypographyFontSizes {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
}

interface ThemeTypographyFontWeights {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
}

interface ThemeTypography {
    fontFamily: string;
    fontSizes: ThemeTypographyFontSizes;
    fontWeights: ThemeTypographyFontWeights;
}

interface ThemeShadows {
    sm: string;
    md: string;
    lg: string;
}

interface ThemeTransitions {
    default: string;
    fast: string;
    slow: string;
}

interface ThemeBreakpoints {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

export interface Theme {
    colors: ThemeColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    typography: ThemeTypography;
    shadows: ThemeShadows;
    transitions: ThemeTransitions;
    breakpoints: ThemeBreakpoints;
}

// Define the theme with dark mode colors matching the application brand
export const theme: Theme = {
    colors: {
        // Brand colors
        primary: '#3478ff',       // Blue primary brand color
        primaryDark: '#2361d9',   // Darker blue for hover states
        primaryLight: '#5b9eff',  // Lighter blue for accents
        secondary: '#6c757d',     // Gray for secondary elements
        accent: '#ffb400',        // Yellow/gold for accents (matching starred items)
        
        // Status colors
        success: '#4caf50',       // Green for success states
        warning: '#ff9800',       // Orange for warning states
        danger: '#f44336',        // Red for error/danger states
        dangerDark: '#d32f2f',    // Darker red for hover states
        info: '#3478ff',          // Blue for info states
        
        // Background colors
        background: '#171717',     // Dark gray main background
        card: '#222222',          // Slightly lighter card background
        highlight: '#2a2a2a',     // Highlighted background
        
        // Text colors
        text: {
            primary: '#ffffff',               // White text
            secondary: 'rgba(255, 255, 255, 0.7)',  // Semi-transparent white
            light: 'rgba(255, 255, 255, 0.5)',      // Lighter text for less emphasis
            white: '#ffffff'                  // Pure white
        },
        
        // Border and shadow colors
        border: 'rgba(255, 255, 255, 0.2)',  // Semi-transparent white borders
        shadow: 'rgba(0, 0, 0, 0.3)',         // Darker shadow for contrast
        
        // File type colors - based on the backup file
        fileTypes: {
            pdf: '#f44336',        // Red
            audio: '#3478ff',      // Blue (primary)
            video: '#ff9800',      // Orange
            image: '#4caf50',      // Green
            zip: '#ff9800',        // Orange (warning)
            document: '#3478ff',   // Blue
            other: '#6c757d'       // Gray (secondary)
        },
        
        // Note type colors - from the backup file
        noteTypes: {
            vocals: '#e91e63',     // Pink
            production: '#9c27b0', // Purple
            band: '#673ab7',       // Deep Purple
            lighting: '#3f51b5',   // Indigo
            audio: '#2196f3',      // Blue
            general: '#607d8b'     // Blue Gray
        },
        
        // Note type hover colors - darker variants
        noteTypesHover: {
            vocals: '#d81b60',     // Darker Pink
            production: '#8e24aa', // Darker Purple
            band: '#5e35b1',       // Darker Deep Purple
            lighting: '#3949ab',   // Darker Indigo
            audio: '#1e88e5',      // Darker Blue
            general: '#546e7a'     // Darker Blue Gray
        },
        
        // Section type colors - from the backup file
        sectionTypes: {
            intro: { 
                background: 'rgba(52, 152, 219, 0.7)', // Light blue
                text: 'white' 
            },
            verse: { 
                background: 'rgba(46, 204, 113, 0.7)', // Light green
                text: 'white' 
            },
            chorus: { 
                background: 'rgba(155, 89, 182, 0.7)', // Light purple
                text: 'white' 
            },
            bridge: { 
                background: 'rgba(241, 196, 15, 0.7)', // Light yellow
                text: 'white' 
            },
            outro: { 
                background: 'rgba(231, 76, 60, 0.7)', // Light red
                text: 'white' 
            },
            default: { 
                background: 'rgba(149, 165, 166, 0.7)', // Light gray
                text: 'white' 
            }
        }
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
