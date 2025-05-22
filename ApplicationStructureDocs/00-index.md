# React Application Architecture Documentation

This documentation describes a robust, maintainable architecture for React applications with TypeScript, designed for scalability and ease of maintenance. It provides patterns that can be followed to create consistent, reliable web applications.

## Table of Contents

1. [Directory Structure](01-directory-structure.md)
   - Project organization and file placement
   - Naming conventions and patterns

2. [Component Architecture](02-component-architecture.md)
   - Component types (presentations, containers, layouts)
   - Component organization
   - File structure within components

3. [Routing System](03-routing-system.md)
   - Centralized routing approach
   - Protected routes implementation
   - Route organization and grouping

4. [Path Management](04-path-management.md)
   - Centralized path configuration
   - Dynamic import handling
   - Solutions for problematic paths (spaces in directory names)

5. [State Management](05-state-management.md)
   - Local vs global state
   - Context API usage
   - State organization patterns

6. [Styling Approach](06-styling-approach.md)
   - CSS organization
   - Component-specific styling
   - **Separation of structure and theme**
   - Global themes

7. [Template System](07-template-system.md)
   - Page templates
   - Layout components
   - Widget containment pattern

8. [Common Patterns](08-common-patterns.md)
   - Loading states
   - Error handling
   - Authentication flow

9. [File Naming Conventions](09-file-naming-conventions.md)
   - Component files
   - Utility files
   - Test files

10. [Refactoring Patterns](10-refactoring-patterns.md)
    - How to approach code refactoring
    - Maintaining backward compatibility
    - Testing refactored code
