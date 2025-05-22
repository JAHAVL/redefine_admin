# File Naming Conventions

This document outlines the file naming conventions used throughout the application to ensure consistency and maintainability.

## General Principles

- Use descriptive names that clearly indicate the purpose of the file
- Maintain consistent casing across similar file types
- Group related files using consistent naming patterns
- Avoid spaces in file and directory names

## Component Files

### React Component Files

- Use **PascalCase** for component files
- Name should match the component's name
- Use `.tsx` extension for TypeScript components, `.jsx` for JavaScript components
- Include the component type in the name when it helps with clarity

```
Button.tsx
UserProfile.tsx
AdminDashboard.tsx
LoginPage.tsx
FinanceDashboardWidget.tsx
```

### Component-Related Files

- Use the same base name as the component with appropriate suffixes
- CSS files: `ComponentName.css`
- Test files: `ComponentName.test.tsx` or `ComponentName.spec.tsx`
- Story files (Storybook): `ComponentName.stories.tsx`
- Type definition files: `ComponentName.types.ts`

```
Button.tsx
Button.css
Button.test.tsx
Button.stories.tsx
Button.types.ts
```

## Directory Names

### Component Directories

- Use **PascalCase** for component directories
- Match the name of the primary component inside
- Can include the component type for clarity

```
/Button
/UserProfile
/AdminDashboard
/LoginPage
```

### Feature Directories

- Use **PascalCase** for feature directories
- Avoid spaces (use PascalCase or kebab-case instead)
- Be consistent with pluralization

```
/Finance
/Locations
/UserManagement
/FileManager
```

### Utility Directories

- Use **lowercase** for utility directories
- Use kebab-case for multi-word directory names

```
/utils
/hooks
/contexts
/services
/api-clients
```

## Special File Types

### Context Files

- Use **PascalCase** with `Context` suffix
- Export both the context and a custom hook

```
AuthContext.tsx  // exports AuthContext and useAuth hook
ThemeContext.tsx // exports ThemeContext and useTheme hook
```

### Hook Files

- Use **camelCase** with `use` prefix
- Clearly describe what the hook does

```
useAuth.ts
useFetch.ts
useLocalStorage.ts
useWindowSize.ts
```

### Utility Files

- Use **camelCase** for utility files
- Name should describe the functionality

```
pathconfig.ts
formatters.ts
validators.ts
dateUtils.ts
```

### Service Files

- Use **camelCase** with `Service` suffix
- Name should indicate the domain/feature

```
authService.ts
userService.ts
financeService.ts
```

### API Client Files

- Use **camelCase** with `Api` or `Client` suffix

```
financeApi.ts
userManagementClient.ts
```

### Type Definition Files

- Use **camelCase** with `types` suffix
- Or group related types in a directory with an `index.ts` file

```
userTypes.ts
financeTypes.ts
```

## Page Components

- Use **PascalCase** with `Page` suffix
- Place in feature-specific directories

```
/pages
  /finance
    FinanceDashboardPage.tsx
    TransactionsPage.tsx
  /auth
    LoginPage.tsx
    RegistrationPage.tsx
```

## Widget Components

- Use **PascalCase** with `Widget` or `Module` suffix
- Place in feature-specific directories

```
/widgets
  /finance
    FinanceDashboardWidget.tsx
    TransactionsModule.tsx
```

## Special Name Patterns

### Template Files

- Use **PascalCase** with `Template` suffix

```
MainPageTemplate.tsx
AdminTemplate.tsx
```

### Provider Components

- Use **PascalCase** with `Provider` suffix

```
ThemeProvider.tsx
AuthProvider.tsx
FinanceThemeProvider.tsx
```

### Higher-Order Components (HOCs)

- Use **camelCase** with `with` prefix

```
withAuth.tsx
withTheme.tsx
withErrorBoundary.tsx
```

## Version Transition Naming

When transitioning between versions of components:

- Add suffix to indicate new version (e.g., `NEW`, `V2`)
- Once transition is complete, rename to remove suffix

```
// During transition
FinancePage.tsx        // old version
FinancePageNEW.tsx     // new version

// After transition
FinancePage.tsx        // renamed from FinancePageNEW.tsx
```

## Test Files

- Mirror the structure of the source files
- Use `.test.tsx` or `.spec.tsx` suffix
- Group related tests in test directories when appropriate

```
Button.test.tsx           // Component test
userService.test.ts       // Service test
/tests
  /integration
    auth-flow.test.ts     // Integration test
```

## Configuration Files

- Use standard naming conventions for configuration files
- Use lowercase with appropriate extensions

```
.eslintrc.js
.prettierrc
tsconfig.json
package.json
```

## Best Practices

1. **Consistency** - Be consistent with naming patterns across the codebase
2. **Clarity** - Names should clearly indicate the purpose and type of the file
3. **Grouping** - Use consistent prefixes/suffixes to group related files
4. **Avoid Collisions** - Use suffixes and prefixes to avoid name collisions
5. **Descriptive** - Favor descriptive names over short but ambiguous names
6. **Avoid Special Characters** - Stick to alphanumeric characters and hyphens/underscores
7. **Documentation** - Document naming conventions and keep them updated
