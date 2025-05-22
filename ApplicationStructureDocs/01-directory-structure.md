# Directory Structure

A well-organized directory structure is crucial for maintainability as an application grows. This document outlines the recommended directory structure for React applications following this architecture.

## Root Level Structure

```
/src
  /components      # Reusable UI components
  /layouts         # Layout components and templates
  /pages           # Page components organized by feature
  /routes          # Routing configuration
  /utils           # Utility functions
  /hooks           # Custom React hooks
  /contexts        # React context definitions
  /services        # API and service layer
  /styles          # Global styles and themes
  /types           # TypeScript type definitions
  /assets          # Static assets (images, icons, etc.)
  /widgets         # Feature-specific widgets
  App.tsx          # Main application component
  index.tsx        # Application entry point
```

## Feature-Based Organization

Pages and related components are organized by feature rather than by component type. This makes it easier to locate all files related to a specific feature.

### Public vs. Admin Separation

The application distinguishes between public-facing pages and admin-only pages:

```
/src/pages
  /public          # Pages accessible to all users
    /home
    /about
    /contact
    /auth          # Authentication pages (login, register, etc.)
  /admin           # Pages requiring authentication
    /dashboard
    /finance
    /users
    /settings
```

This separation provides clear boundaries between different parts of the application and simplifies access control management.

### Example: Feature Directory Structure

```
/src/pages/admin/finance
  /FinanceDashboardPage.tsx
  /TransactionsPage.tsx
  /AccountsPage.tsx
  /ReportsPage.tsx
  /StatementsPage.tsx
  /ReconciliationPage.tsx
```

## Component Organization

Components follow a hierarchy from most specific to most reusable:

1. **Pages** - Feature-specific page components
2. **Layouts** - Layout templates used by pages
3. **Widgets** - Feature-specific functional components
4. **Components** - Reusable UI components used across features

## Naming Conventions

- Directories: Use PascalCase for component directories, lowercase with hyphens for utility directories
- Files: Use PascalCase for component files, camelCase for utility files
- Component files should match the name of the component they export
- Test files should have the same name as the file they test, with a `.test` or `.spec` suffix

## Import Organization

Imports should be organized consistently in each file:

1. External libraries (React, etc.)
2. Component imports (from most generic to most specific)
3. Utility/helper imports
4. Style imports

## Directory Naming Best Practices

- Avoid spaces in directory and file names (use PascalCase or kebab-case instead)
- Maintain consistent casing across similar directories
- Group related files in the same directory
- Create subdirectories when a directory contains more than 7-10 files
