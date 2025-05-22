# Refactoring Patterns

This document outlines effective refactoring patterns and strategies for maintaining and improving the codebase while minimizing disruption to the application.

## Planning Refactoring

### Refactoring Assessment

Before beginning any refactoring effort, assess the following:

1. **Scope** - What components or systems will be affected?
2. **Impact** - How will this affect existing functionality?
3. **Dependencies** - What dependencies exist between the refactored code and other systems?
4. **Risk** - What could go wrong and how can it be mitigated?
5. **Testing** - How will the changes be tested?

### Refactoring Plan Template

```
# Refactoring Plan: [Name of Refactoring]

## Objective
[Clear statement of what is being refactored and why]

## Scope
[List of files/components to be modified]

## Benefits
[Expected improvements from the refactoring]

## Risks
[Potential issues that could arise]

## Implementation Strategy
[Step-by-step approach]

## Testing Strategy
[How changes will be tested]

## Rollback Plan
[How to revert changes if needed]

## Timeline
[Estimated time for completion]
```

## Common Refactoring Patterns

### 1. Path Centralization

Centralizing import paths to improve maintainability and resolve path-related issues:

#### Before:

```tsx
// Multiple files with direct imports
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import TopMenu from '../../components/TopMenu/TopMenu';
```

#### After:

```tsx
// pathconfig.ts
const PATHS = {
  MAIN_PAGE_TEMPLATE: '../layouts/MainPageTemplate/MainPageTemplate',
  LEFT_MENU: '../components/LeftMenu/LeftMenu',
  TOP_MENU: '../components/TopMenu/TopMenu',
};

export function getComponentPath(key: keyof typeof PATHS) {
  return require(PATHS[key]).default;
}

// Component file
import { getComponentPath } from '../utils/pathconfig';
const MainPageTemplate = getComponentPath('MAIN_PAGE_TEMPLATE');
const LeftMenu = getComponentPath('LEFT_MENU');
const TopMenu = getComponentPath('TOP_MENU');
```

### 2. Component Template Migration

Migrating components to use a consistent template system:

#### Before:

```tsx
// OldPage.tsx
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';

const OldPage: React.FC = () => {
  return (
    <div className="page">
      <Header />
      <div className="main">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};
```

#### After:

```tsx
// NewPage.tsx
import React from 'react';
import { getComponentPath } from '../utils/pathconfig';

const MainPageTemplate = getComponentPath('MAIN_PAGE_TEMPLATE');
const ContentWidget = getComponentPath('CONTENT_WIDGET');

const NewPage: React.FC = () => {
  return (
    <MainPageTemplate>
      <ContentWidget />
    </MainPageTemplate>
  );
};
```

### 3. Route Consolidation

Consolidating route definitions for better maintainability:

#### Before:

```tsx
// Multiple route definition files
// routes/AuthRoutes.tsx
// routes/FeatureRoutes.tsx
// routes/AdminRoutes.tsx
```

#### After:

```tsx
// Consolidated in routes/ProtectedRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth components
// Feature components
// Admin components

export const ProtectedRoute = ({ component: Component }) => {
  // Authentication logic
};

const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes */}
      {/* Feature routes */}
      {/* Admin routes */}
    </Routes>
  );
};
```

### 4. Bridge Pattern for Backward Compatibility

Creating a bridge to maintain compatibility during refactoring:

```tsx
// src/components/MainPageTemplate/index.ts (Bridge file)
import { getComponentPath } from '../../utils/pathconfig';

// Re-export from the centralized system
const MainPageTemplate = getComponentPath('MAIN_PAGE_TEMPLATE');
export default MainPageTemplate;
```

## Maintaining Backward Compatibility

### Parallel Implementation Strategy

1. **Create New Implementations** - Develop new components alongside existing ones
2. **Use Distinctive Names** - Use suffixes like "NEW" to distinguish new versions
3. **Migrate Gradually** - Migrate routes and features one by one
4. **Test Each Migration** - Thoroughly test each migration before proceeding
5. **Clean Up** - Remove old implementations after all references are updated

### Example: Parallel Implementation

```tsx
// Original component remains untouched
// src/pages/FinancePage.tsx

// New implementation
// src/pages/finance/FinancePageNEW.tsx
import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';

const MainPageTemplate = getComponentPath('MAIN_PAGE_TEMPLATE');
const FinanceWidget = getComponentPath('FINANCE_WIDGET');

const FinancePageNEW: React.FC = () => {
  return (
    <MainPageTemplate>
      <FinanceWidget />
    </MainPageTemplate>
  );
};

// Routes updated to use new implementation
<Route path="/finance-new" element={<ProtectedRoute component={FinancePageNEW} />} />
```

## Testing Refactored Code

### Test First Approach

1. **Identify Critical Paths** - Define critical user journeys through the application
2. **Write Regression Tests** - Create tests for existing functionality
3. **Refactor** - Implement the refactoring
4. **Run Tests** - Verify that existing functionality still works
5. **Add New Tests** - Add tests for any new functionality

### Testing Strategies

#### Component Testing

```tsx
// src/components/Button/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders with correct text', () => {
    const { getByText } = render(<Button label="Click me" onClick={() => {}} />);
    expect(getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### Integration Testing

```tsx
// src/tests/integration/finance-workflow.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('Finance workflow', () => {
  it('navigates from dashboard to transactions', async () => {
    const { getByText, findByText } = render(
      <MemoryRouter initialEntries={['/finance-new']}>
        <App />
      </MemoryRouter>
    );
    
    // Click on transactions link
    fireEvent.click(getByText('Transactions'));
    
    // Verify navigation worked
    await waitFor(() => {
      expect(findByText('Transaction History')).toBeInTheDocument();
    });
  });
});
```

## Handling Refactoring Failures

### Early Detection Strategies

1. **Incremental Changes** - Make small, testable changes
2. **Feature Flags** - Use feature flags to enable/disable new code
3. **Monitoring** - Implement monitoring to detect issues early
4. **User Feedback** - Collect user feedback on refactored features

### Rollback Plan

1. **Version Control** - Use clear commit messages and branches
2. **Deployment Strategy** - Plan for quick rollbacks if needed
3. **Documentation** - Document known issues and workarounds
4. **Communication** - Communicate changes and potential issues to users

## Directory and File Reorganization

### Safe File Movement Strategy

1. **Move Files** - Move files to their new locations
2. **Create Bridges** - Create bridge files at old locations that re-export from new locations
3. **Update Imports** - Update imports throughout the codebase
4. **Remove Bridges** - Remove bridge files once all imports are updated

### Example: File Movement with Bridge

```tsx
// 1. Move file from:
// src/routes/pages/LoginPage.tsx
// to:
// src/pages/auth/LoginPage.tsx

// 2. Create bridge file at old location:
// src/routes/pages/LoginPage.tsx
import LoginPage from '../../pages/auth/LoginPage';
export default LoginPage;

// 3. Update imports in consuming files
// 4. Eventually remove the bridge file
```

## Best Practices

1. **Small Steps** - Refactor in small, manageable increments
2. **Test Coverage** - Maintain good test coverage
3. **Documentation** - Document refactoring decisions and patterns
4. **Consistent Approach** - Use consistent refactoring patterns
5. **Communication** - Communicate changes to the team
6. **Review** - Conduct code reviews for refactored code
7. **Monitoring** - Monitor application performance and errors after refactoring
