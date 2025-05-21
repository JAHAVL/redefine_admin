/**
 * Widget Template Theme
 * 
 * Standard theme configuration aligned with the application's brand colors and design system.
 * This theme file should be used by all widgets for consistent styling.
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
        primaryLight: '#5694ff',  // Lighter blue for highlights
        secondary: '#6c757d',     // Gray secondary color
        accent: '#ff9500',        // Orange accent color
        
        // Status colors
        success: '#4caf50',      // Green for success states
        warning: '#ff9500',      // Orange for warning states
        danger: '#ff3b30',       // Red for error states
        dangerDark: '#d9342c',   // Darker red for error hovers
        info: '#17a2b8',         // Teal for info states
        
        // Background colors
        background: '#f8f9fa',    // Light gray background
        card: '#ffffff',          // White card background
        highlight: '#f1f7ff',     // Light blue highlight
        
        // Text colors
        text: {
            primary: '#212529',    // Dark gray for primary text
            secondary: '#6c757d',  // Medium gray for secondary text
            light: '#adb5bd',      // Light gray for tertiary text
            white: '#ffffff',      // White text for dark backgrounds
        },
        
        // Border and shadow colors
        border: '#dee2e6',        // Light gray border
        shadow: 'rgba(0, 0, 0, 0.1)', // Shadow with 10% opacity
        
        // Component-specific color systems for files
        fileTypes: {
            pdf: '#f44336',         // Red for PDFs
            audio: '#9c27b0',       // Purple for audio files
            video: '#673ab7',       // Deep purple for video files
            image: '#2196f3',       // Blue for images
            zip: '#ff9800',         // Orange for archives
            document: '#4caf50',    // Green for documents
            other: '#607d8b',       // Blue gray for other files
        },
    },
    
    spacing: {
        xs: '0.25rem',     // 4px
        sm: '0.5rem',      // 8px
        md: '1rem',        // 16px
        lg: '1.5rem',      // 24px
        xl: '2rem',        // 32px
        xxl: '3rem',       // 48px
    },
    
    borderRadius: {
        sm: '0.25rem',     // 4px
        md: '0.5rem',      // 8px
        lg: '1rem',        // 16px
        round: '50%',      // Circular
    },
    
    typography: {
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        fontSizes: {
            xs: '0.75rem',     // 12px
            sm: '0.875rem',    // 14px
            md: '1rem',        // 16px
            lg: '1.25rem',     // 20px
            xl: '1.5rem',      // 24px
            xxl: '2rem',       // 32px
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },
    
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    
    transitions: {
        default: 'all 0.3s ease',
        fast: 'all 0.15s ease',
        slow: 'all 0.5s ease',
    },
    
    breakpoints: {
        xs: '0px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
    },
};
