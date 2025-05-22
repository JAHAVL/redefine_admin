# Widget Overview and Directory Structure

## Introduction

Widgets are self-contained, reusable components that provide specific functionality within the SoSocial CRM application. Each widget follows a consistent structure designed to maximize maintainability, performance, and reusability.

## Key Principles

The widget architecture is built on several core principles:

1. **Separation of Concerns**
   - Clear distinction between layout and theming
   - Separation of data fetching and UI rendering
   - Component-specific logic stays with components

2. **Self-Containment**
   - Widgets include all necessary code to function
   - Minimal dependencies on external application code
   - Well-defined public API for integration

3. **Consistent Structure**
   - Standardized directory structure
   - Common file naming conventions
   - Predictable organization of code

4. **Scalable Architecture**
   - Supports simple to complex widget implementations
   - Scales from basic display widgets to interactive applications
   - Supports cross-page usage with different configurations

## Standard Directory Structure

A well-organized widget should follow this structure:

```
/WidgetName/
├── README.md                # Widget documentation
├── REQUIREMENTS.md          # Functional requirements for the widget
├── index.tsx                # Main entry point that exports the widget
├── WidgetName.tsx           # Main widget component (simplified export version)
├── actions.ts               # Action creators for state management
├── api.ts                   # API integration functions
├── types.ts                 # TypeScript type definitions
├── theme.ts                 # Theming variables (colors, fonts, radiuses ONLY)
├── theme.module.css         # CSS module for theming variables
├── utils.ts                 # Utility functions specific to the widget
├── pathConfig.ts            # Centralized file path definitions for the widget
├── hooks/                   # Custom hooks
│   ├── useWidgetState.ts    # Hook for widget state management
│   └── ...
├── context/                 # Context providers
│   ├── WidgetContext.tsx    # Widget state context
│   └── ...
├── layouts/                 # Layout components for widget organization
│   ├── MainLayout.tsx       # Primary widget layout
│   ├── DetailLayout.tsx     # Detail view layout
│   └── ...
├── components/              # Sub-components
│   ├── ComponentA.tsx       # Individual components
│   ├── ComponentB.tsx
│   └── ...
│   ├── types.ts             # Component-specific types
│   ├── modals/              # Modal components (kept in widget, not pages)
│   │   ├── DetailModal.tsx
│   │   ├── sections/        # Sections for complex modals
│   │   │   └── ...
│   │   └── ...
└── tests/                   # Unit and integration tests
    ├── unit/                # Unit tests for individual components
    │   ├── ComponentA.test.tsx
    │   └── ...
    ├── integration/         # Integration tests for component combinations
    │   ├── WidgetFlow.test.tsx
    │   └── ...
    └── mocks/               # Test mocks and fixtures
        ├── data.ts
        └── ...
```

## Folder Structure Explanation

### Root Files

The root directory contains:
- Documentation files (`README.md`, `REQUIREMENTS.md`)
- Main component files (`index.tsx`, `WidgetName.tsx`)
- Core utility files (`actions.ts`, `api.ts`, `types.ts`, etc.)
- State management files

These files form the core API and entry points for your widget.

### Subdirectories

The widget is organized into focused subdirectories:

1. **hooks/** - Custom React hooks for state management, effects, and behavior
2. **context/** - React Context providers and consumers for state management
3. **layouts/** - Layout components for structural organization 
4. **components/** - UI components that make up the widget interface
5. **tests/** - Comprehensive test suite for the widget

## Key Relationships

- `index.tsx` exports the main `WidgetName.tsx` component and other public API items
- `WidgetName.tsx` utilizes contexts and components to build the complete widget
- Components use hooks and utils for behavior and logic
- Layouts determine structural organization while theme files control visual appearance

## Importance of Consistency

Maintaining this structure across all widgets provides several benefits:

- Developers can quickly locate code in any widget
- New widgets can be scaffolded consistently
- Common patterns emerge that can be reused
- Testing and maintenance become more predictable

## Next Steps

With the overall structure in place, let's explore each file's specific responsibilities in the [File Structure and Responsibilities](./02-file-structure.md) guide.
