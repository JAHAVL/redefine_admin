# Styling Approach

This document outlines the styling approach used in the application, covering component-specific styling, global themes, and CSS organization.

## Styling Architecture

The application uses a combination of component-specific CSS files and global themes to create a consistent design system while maintaining component encapsulation.

## Component-Specific Styling

Each component has its own CSS file that encapsulates styles specific to that component:

```
/ComponentName
  ComponentName.tsx
  ComponentName.css
```

### Example Component with CSS:

```tsx
// MainPageTemplate.tsx
import React from 'react';
import './MainPageTemplate.css';

interface MainPageTemplateProps {
  children: React.ReactNode;
}

const MainPageTemplate: React.FC<MainPageTemplateProps> = ({ children }) => {
  return (
    <div className="main-template-container">
      <div className="top-menu">
        {/* Top menu content */}
      </div>
      <div className="content-container">
        <div className="left-menu">
          {/* Left menu content */}
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainPageTemplate;
```

```css
/* MainPageTemplate.css */
.main-template-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.top-menu {
  height: 60px;
  background-color: var(--primary-color);
  color: white;
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-menu {
  width: 250px;
  background-color: var(--background-light);
  overflow-y: auto;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
```

## Global Styling

Global styles are defined in dedicated files in the `/src/styles` directory:

```
/src/styles
  /variables.css    # CSS variables for colors, fonts, etc.
  /reset.css        # CSS reset styles
  /typography.css   # Typography styles
  /utilities.css    # Utility classes
  /themes/          # Theme-specific styles
    /light.css
    /dark.css
    /finance.css
    /scheduler.css
  /App.css          # Application-wide styles
```

### Variables for Consistent Design

CSS variables are used to maintain a consistent design system:

```css
/* variables.css */
:root {
  /* Colors */
  --primary-color: #4a6cf7;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  
  /* Background colors */
  --background-main: #f8f9fa;
  --background-light: #ffffff;
  --background-dark: #343a40;
  
  /* Text colors */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-light: #f8f9fa;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Font sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  
  /* Border radius */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Z-index layers */
  --z-index-dropdown: 1000;
  --z-index-modal: 2000;
  --z-index-tooltip: 3000;
}

## Separation of Structure and Theme

### Important: Clear Separation of Concerns

Components should maintain complete control over their own structure, layout, and sizing. Themes should **only** influence visual styling aspects such as:

- Colors
- Typography (font families, weights, sizes)
- Border styles and radii
- Shadows and elevations
- Opacity and transparency
- Animation timing and easing

This clear separation of concerns ensures that:

1. **Component Integrity** - Components remain structurally intact regardless of theme changes
2. **Predictable Theming** - Themes can be swapped without breaking layouts
3. **Simpler Maintenance** - Structure and visual styling can be maintained independently
4. **Better Reusability** - Components can be used in different contexts while maintaining their core structure

### Example: Proper Separation

```css
/* Component CSS - Controls structure and layout */
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin: 8px;
  /* No colors, fonts, or visual styling here */
}

/* Theme CSS - Controls visual appearance only */
.light-theme .button {
  background-color: var(--primary-color);
  color: var(--text-light);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
  transition: background-color 0.2s ease;
}

.dark-theme .button {
  background-color: var(--primary-dark);
  color: var(--text-dark);
  /* Other visual properties */
}
```

### Anti-Pattern: Mixing Structure and Theme

```css
/* Problematic approach - mixing structure and theme */
.light-theme .button {
  display: flex; /* ❌ Structure in theme */
  width: 120px; /* ❌ Sizing in theme */
  padding: 12px; /* ❌ Layout in theme */
  background-color: blue;
}

.dark-theme .button {
  display: block; /* ❌ Different structure based on theme */
  width: 100px; /* ❌ Different sizing based on theme */
  padding: 8px; /* ❌ Different layout based on theme */
  background-color: gray;
}
```

By maintaining this separation, themes can be changed or updated without risking layout issues, and components can maintain their structural integrity regardless of the applied theme.

## Theme Implementation

Themes are implemented using CSS variables and class-based toggles:

```css
/* themes/light.css */
.light-theme {
  --background-main: #f8f9fa;
  --background-light: #ffffff;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  /* More theme variables */
}

/* themes/dark.css */
.dark-theme {
  --background-main: #343a40;
  --background-light: #495057;
  --text-primary: #f8f9fa;
  --text-secondary: #adb5bd;
  /* More theme variables */
}

/* themes/finance.css */
.finance-theme {
  --primary-color: #28a745;
  --secondary-color: #20c997;
  /* Finance-specific theme variables */
}
```

## Theme Providers

Feature-specific themes are implemented using context providers:

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext } from 'react';
import '../styles/themes/light.css';
import '../styles/themes/dark.css';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

// Theme context implementation...

// Feature-specific theme provider
export const FinanceThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="finance-theme">
      {children}
    </div>
  );
};
```

## CSS Organization Rules

1. **Component Encapsulation** - Each component has its own CSS file
2. **BEM Naming Convention** - Follow Block-Element-Modifier naming for CSS classes
3. **CSS Variables** - Use CSS variables for colors, spacing, and other design values
4. **Class Prefixing** - Prefix classes with component name to avoid conflicts
5. **Minimal Global Styles** - Keep global styles to a minimum
6. **Mobile-First Approach** - Design for mobile first, then enhance for larger screens

## Responsive Design

The application follows a mobile-first approach with responsive design principles:

```css
/* Responsive breakpoints */
:root {
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}

/* Example of responsive design in a component */
.main-template-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content-container {
  display: flex;
  flex-direction: column; /* Mobile: stack layout */
}

@media (min-width: 768px) {
  .content-container {
    flex-direction: row; /* Desktop: side-by-side layout */
  }
  
  .left-menu {
    width: 250px;
  }
}
```

## Best Practices

1. **Consistent Naming** - Use a consistent naming convention (BEM recommended)
2. **CSS Variables** - Use CSS variables for design values
3. **Component Isolation** - Keep component styles isolated
4. **Responsive Design** - Design for mobile first
5. **Avoid Inline Styles** - Prefer external CSS files over inline styles
6. **Avoid Global Selectors** - Use specific, scoped selectors
7. **Theme Consistency** - Maintain theme consistency across components
8. **Performance** - Consider CSS performance (avoid deep nesting, over-specificity)
9. **Documentation** - Document CSS variables and utility classes
