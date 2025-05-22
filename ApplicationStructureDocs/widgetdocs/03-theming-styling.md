# Theming and Styling

This guide outlines the approach to theming and styling widgets in the SoSocial CRM application, with a strict separation between structural layout and visual theming.

## Core Principles

### Strict Separation of Layout and Theme

The widget architecture enforces a fundamental distinction between:

1. **Structure and Layout**: 
   - Dimensions, spacing, positioning
   - Grid and flex layouts
   - Content organization
   - Overflow behavior

2. **Theming**:
   - Colors and opacity
   - Typography (fonts, sizes)
   - Border radiuses
   - Shadows and visual effects

This separation offers several benefits:
- Enables system-wide theme changes without breaking layouts
- Allows consistent visual styling across widgets
- Supports features like dark mode and branded themes
- Maintains predictable widget sizing and positioning

## Implementation Strategy

### Directory Structure

Each widget should have these styling-related files:

- `theme.ts` - Theme variable definitions (colors, fonts, etc.)
- `theme.module.css` - CSS implementation of theme variables
- `ComponentName.module.css` - Component-specific structural styles

### Theme Implementation

#### 1. Theme Variables (`theme.ts`)

This file defines all theming variables using CSS variables with fallbacks:

```tsx
// theme.ts - Default theme variables

export const COLORS = {
  primary: 'var(--widget-primary-color, #3498db)',
  secondary: 'var(--widget-secondary-color, #2ecc71)',
  danger: 'var(--widget-danger-color, #e74c3c)',
  text: {
    primary: 'var(--widget-text-primary-color, #333333)',
    secondary: 'var(--widget-text-secondary-color, #666666)',
    disabled: 'var(--widget-text-disabled-color, #999999)',
  },
  background: {
    primary: 'var(--widget-background-primary, #ffffff)',
    secondary: 'var(--widget-background-secondary, #f5f5f7)',
    tertiary: 'var(--widget-background-tertiary, #e9ecef)',
  }
};

export const TYPOGRAPHY = {
  fontFamily: 'var(--widget-font-family, "Inter", system-ui, sans-serif)',
  sizes: {
    xs: 'var(--widget-font-size-xs, 0.75rem)',
    sm: 'var(--widget-font-size-sm, 0.875rem)',
    md: 'var(--widget-font-size-md, 1rem)',
    lg: 'var(--widget-font-size-lg, 1.25rem)',
    xl: 'var(--widget-font-size-xl, 1.5rem)',
  },
  weights: {
    regular: 'var(--widget-font-weight-regular, 400)',
    medium: 'var(--widget-font-weight-medium, 500)',
    semibold: 'var(--widget-font-weight-semibold, 600)',
    bold: 'var(--widget-font-weight-bold, 700)',
  },
  lineHeights: {
    tight: 'var(--widget-line-height-tight, 1.2)',
    normal: 'var(--widget-line-height-normal, 1.5)',
    loose: 'var(--widget-line-height-loose, 1.8)',
  }
};

export const BORDERS = {
  radius: {
    sm: 'var(--widget-border-radius-sm, 2px)',
    md: 'var(--widget-border-radius-md, 4px)',
    lg: 'var(--widget-border-radius-lg, 8px)',
    pill: 'var(--widget-border-radius-pill, 9999px)',
  },
  width: {
    thin: 'var(--widget-border-width-thin, 1px)',
    medium: 'var(--widget-border-width-medium, 2px)',
    thick: 'var(--widget-border-width-thick, 3px)',
  }
};

export const SHADOWS = {
  sm: 'var(--widget-shadow-sm, 0 1px 3px rgba(0,0,0,0.1))',
  md: 'var(--widget-shadow-md, 0 4px 6px rgba(0,0,0,0.1))',
  lg: 'var(--widget-shadow-lg, 0 10px 15px rgba(0,0,0,0.1))',
  inner: 'var(--widget-shadow-inner, inset 0 2px 4px rgba(0,0,0,0.05))',
};

export const TRANSITIONS = {
  fast: 'var(--widget-transition-fast, 150ms ease)',
  normal: 'var(--widget-transition-normal, 250ms ease)',
  slow: 'var(--widget-transition-slow, 350ms ease)',
};

export const FOCUS = {
  outline: `var(--widget-focus-outline, 0 0 0 2px ${COLORS.primary}80)`,
};
```

#### 2. Theme CSS Module (`theme.module.css`)

This file implements CSS classes for applying theme styles:

```css
/* theme.module.css - CSS implementation of theme */

.container {
  /* ONLY theme properties */
  color: var(--widget-text-primary-color, #333333);
  background-color: var(--widget-background-primary, #ffffff);
  font-family: var(--widget-font-family, "Inter", system-ui, sans-serif);
  border-radius: var(--widget-border-radius-md, 4px);
  box-shadow: var(--widget-shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
}

.headerText {
  color: var(--widget-text-primary-color, #333333);
  font-size: var(--widget-font-size-lg, 1.25rem);
  font-weight: var(--widget-font-weight-semibold, 600);
}

.primaryButton {
  /* ONLY theme properties */
  color: white;
  background-color: var(--widget-primary-color, #3498db);
  border-radius: var(--widget-border-radius-md, 4px);
  font-weight: var(--widget-font-weight-medium, 500);
  transition: background-color var(--widget-transition-fast, 150ms ease);
  border: none;
}

.primaryButton:hover {
  background-color: var(--widget-primary-color-hover, #2980b9);
}

.secondaryButton {
  color: var(--widget-text-primary-color, #333333);
  background-color: transparent;
  border: var(--widget-border-width-thin, 1px) solid var(--widget-border-color, #ddd);
  border-radius: var(--widget-border-radius-md, 4px);
  font-weight: var(--widget-font-weight-medium, 500);
  transition: background-color var(--widget-transition-fast, 150ms ease);
}

.divider {
  background-color: var(--widget-border-color, #ddd);
}

.card {
  background-color: var(--widget-background-primary, #ffffff);
  border-radius: var(--widget-border-radius-md, 4px);
  box-shadow: var(--widget-shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
}

/* NO STRUCTURE OR LAYOUT PROPERTIES IN THIS FILE */
```

#### 3. Component Structural Styles (`ComponentName.module.css`)

These files define the structural layout only:

```css
/* Button.module.css - Component-specific structural styles */

.button {
  /* STRUCTURAL PROPERTIES ONLY */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  min-width: 80px;
  height: 36px;
  cursor: pointer;
  
  /* NO COLOR, FONT, OR VISUAL PROPERTIES HERE */
}

.buttonLarge {
  padding: 12px 24px;
  min-width: 100px;
  height: 48px;
}

.buttonSmall {
  padding: 4px 12px;
  min-width: 60px;
  height: 28px;
}

.icon {
  margin-right: 8px;
}

.iconOnly {
  padding: 8px;
  min-width: 36px;
  width: 36px;
}
```

### Component Implementation

When building components, combine structural and theme styles:

```tsx
// Button.tsx
import React from 'react';
import structureStyles from './Button.module.css';
import themeStyles from '../../theme.module.css';
import { COLORS, TYPOGRAPHY } from '../../theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  icon,
  children,
  onClick
}) => {
  // Determine structure class based on size
  const sizeClass = 
    size === 'small' ? structureStyles.buttonSmall :
    size === 'large' ? structureStyles.buttonLarge :
    '';
  
  // Determine theme class based on variant
  const themeClass = 
    variant === 'primary' ? themeStyles.primaryButton :
    themeStyles.secondaryButton;
  
  return (
    <button
      className={`
        ${structureStyles.button} 
        ${sizeClass} 
        ${themeClass}
      `}
      onClick={onClick}
    >
      {icon && <span className={structureStyles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
```

## System-Wide Theme Integration

### Root CSS Variables

The system provides global CSS variables that widgets can use:

```css
/* In a system-wide theme file (outside widget) */
:root {
  /* Global theme that all widgets inherit */
  --widget-primary-color: #1a73e8;
  --widget-secondary-color: #34a853;
  --widget-danger-color: #ea4335;
  --widget-background-primary: #ffffff;
  --widget-text-primary-color: #202124;
  --widget-border-radius-md: 8px;
  --widget-font-family: 'Roboto', sans-serif;
}

/* Dark mode theme */
.dark-theme {
  --widget-primary-color: #8ab4f8;
  --widget-background-primary: #202124;
  --widget-background-secondary: #303134;
  --widget-text-primary-color: #e8eaed;
  --widget-text-secondary-color: #9aa0a6;
}

/* Branded theme example */
.brand-theme-blue {
  --widget-primary-color: #0052cc;
  --widget-secondary-color: #0065ff;
  --widget-background-secondary: #f4f5f7;
}
```

### Theme Provider Integration

For more dynamic theming needs, a ThemeProvider component can be used:

```tsx
// In the application (outside widget)
import { ThemeProvider } from '../theme/ThemeContext';

const App = () => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeProvider theme={theme}>
      <div className={theme === 'dark' ? 'dark-theme' : ''}>
        {/* Application content including widgets */}
      </div>
    </ThemeProvider>
  );
};
```

## Layout Best Practices

While strictly separated from theming, layout follows these principles:

1. **Container Responsibility**
   - Containers define dimensions and positioning
   - Content adapts to container constraints
   - Use percentages and viewport units when possible

2. **Flexbox and Grid**
   - Use flexbox for one-dimensional layouts
   - Use grid for two-dimensional layouts
   - Keep layout simple and predictable

3. **Responsive Considerations**
   - Design for different screen sizes
   - Use media queries for major layout changes
   - Use relative units for sizing

4. **Overflow Handling**
   - Be explicit about overflow behavior
   - Prevent unintended scrolling
   - Respect system-wide scroll preferences

## Enforcing the Separation

To enforce the separation between layout and theming:

1. **Code Reviews**
   - Check CSS modules for proper separation
   - Flag instances of theming in structure files
   - Flag structural properties in theme files

2. **ESLint Rules**
   - Configure linting rules for CSS modules
   - Check for inappropriate CSS properties

3. **Documentation**
   - Provide clear examples of the separation
   - Document which properties belong where

## Debugging Theme Issues

When debugging theme issues:

1. **Browser DevTools**
   - Inspect element to see applied CSS
   - Check if CSS variables are being overridden
   - Use computed styles to see final values

2. **Theme Visualizer**
   - Create a theme visualizer page
   - Display all theme variables in use
   - Demonstrate theme switching

## Conclusion

This strict separation of structural layout and visual theming creates a robust, maintainable styling system. Widgets maintain their functionality and layout integrity while adapting to system-wide visual themes.

For component architecture guidelines, see the [Component Architecture](./04-components.md) guide.
