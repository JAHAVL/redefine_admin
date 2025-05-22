# Template System

This document outlines the template system architecture used in the application, explaining how page templates, layouts, and the widget containment pattern work together to create a consistent user experience.

## Template Architecture Overview

The application uses a hierarchical template system that separates layout concerns from content, allowing for consistent UI while enabling feature-specific content to be easily swapped in and out.

### Public vs Admin Templates

The application distinguishes between public-facing templates and admin-only templates:

```
Public Templates (for unauthenticated users)
    └── Public Content (e.g., LoginForm, RegisterForm)

Admin Templates (for authenticated users)
    └── ThemeProvider (optional)
        └── Feature Widget (e.g., FinanceDashboardWidget)
```

This separation allows for appropriate styling and functionality based on the user's authentication status.

### Template Hierarchy

```
Layout (MainPageTemplate or PublicPageTemplate)
    └── ThemeProvider (optional)
        └── Feature Widget (e.g., FinanceDashboardWidget)
```

## Page Templates

Page templates define the overall structure of pages, including navigation elements, headers, footers, and content areas.

### Main Page Template

The primary template used throughout the application is `MainPageTemplate`:

```tsx
// src/layouts/MainPageTemplate/MainPageTemplate.tsx
import React from 'react';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import TopMenu from '../../components/TopMenu/TopMenu';
import SubMenu from '../../components/SubMenu/SubMenu';
import './MainPageTemplate.css';

interface MainPageTemplateProps {
  children: React.ReactNode;
  showSubMenu?: boolean;
}

const MainPageTemplate: React.FC<MainPageTemplateProps> = ({ 
  children,
  showSubMenu = true
}) => {
  return (
    <div className="main-template-container">
      <div className="top-menu-container">
        <TopMenu />
      </div>
      
      <div className="content-container">
        <div className="left-menu-container">
          <LeftMenu />
        </div>
        
        <div className="right-content-container">
          {showSubMenu && (
            <div className="sub-menu-container">
              <SubMenu />
            </div>
          )}
          
          <div className="main-content-area">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageTemplate;
```

## Feature Pages with Templates

Feature pages use the main page template and slot in feature-specific content:

```tsx
// src/pages/finance/FinanceDashboardPage.tsx
import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';

// Import using centralized path management
const MainPageTemplate = getComponentPath('MAIN_PAGE_TEMPLATE');
const FinanceThemeProvider = getComponentPath('FINANCE_THEME_PROVIDER');
const FinanceDashboardWidget = getComponentPath('FINANCE_DASHBOARD_WIDGET');

const FinanceDashboardPage: React.FC = () => {
  return (
    <MainPageTemplate>
      <FinanceThemeProvider>
        <FinanceDashboardWidget />
      </FinanceThemeProvider>
    </MainPageTemplate>
  );
};

export default FinanceDashboardPage;
```

## Widget Containment Pattern

The application uses a widget containment pattern where feature-specific functionality is encapsulated in widget components:

```tsx
// src/widgets/financewidget/modules/dashboard/FinanceDashboardWidget.tsx
import React from 'react';
import FinanceSummary from './components/FinanceSummary';
import RecentTransactions from './components/RecentTransactions';
import BudgetOverview from './components/BudgetOverview';
import './FinanceDashboardWidget.css';

const FinanceDashboardWidget: React.FC = () => {
  return (
    <div className="finance-dashboard-widget">
      <div className="widget-header">
        <h1>Finance Dashboard</h1>
      </div>
      
      <div className="widget-content">
        <div className="widget-row">
          <FinanceSummary />
        </div>
        
        <div className="widget-row widget-columns">
          <div className="widget-column">
            <RecentTransactions />
          </div>
          <div className="widget-column">
            <BudgetOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboardWidget;
```

## Feature-Specific Theme Providers

Feature areas can have their own theme providers that wrap the content to provide consistent styling:

```tsx
// src/contexts/FinanceThemeProvider.tsx
import React from 'react';
import './FinanceTheme.css';

interface FinanceThemeProviderProps {
  children: React.ReactNode;
}

const FinanceThemeProvider: React.FC<FinanceThemeProviderProps> = ({ children }) => {
  return (
    <div className="finance-theme">
      {children}
    </div>
  );
};

export default FinanceThemeProvider;
```

## Template Variants

For different sections of the application, template variants can be created:

```tsx
// src/layouts/AdminTemplate/AdminTemplate.tsx
import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';
import './AdminTemplate.css';

const TopMenu = getComponentPath('TOP_MENU');
const LeftMenu = getComponentPath('LEFT_MENU');

interface AdminTemplateProps {
  children: React.ReactNode;
}

const AdminTemplate: React.FC<AdminTemplateProps> = ({ children }) => {
  return (
    <div className="admin-template">
      <div className="admin-header">
        <TopMenu mode="admin" />
      </div>
      
      <div className="admin-body">
        <div className="admin-sidebar">
          <LeftMenu mode="admin" />
        </div>
        
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminTemplate;
```

## Implementing a Consistent Template System

To implement a consistent template system, follow these steps:

1. **Create Base Templates** - Define base templates for different sections of the application
2. **Define Widget Structure** - Create a consistent structure for feature widgets
3. **Use Path Configuration** - Use centralized path management for importing templates and widgets
4. **Apply Theme Providers** - Wrap content in appropriate theme providers
5. **Create Page Components** - Compose pages using templates and widgets

## Template Conversion Process

When converting an existing page to use the template system:

1. **Create New Page Component** - Create a new page component that uses the template system
2. **Import Required Components** - Import templates and widgets using the centralized path system
3. **Compose Components** - Compose the page using the template and widget structure
4. **Route Configuration** - Update routes to point to the new page component
5. **Testing** - Test the new page to ensure it functions correctly

### Template Conversion Example

```tsx
// Before: src/pages/OldFinancePage.tsx
import React from 'react';
import OldHeader from '../components/OldHeader';
import OldSidebar from '../components/OldSidebar';
import FinanceContent from '../components/FinanceContent';

const OldFinancePage: React.FC = () => {
  return (
    <div className="page-container">
      <OldHeader />
      <div className="content-wrapper">
        <OldSidebar />
        <FinanceContent />
      </div>
    </div>
  );
};

// After: src/pages/finance/FinanceDashboardPageNEW.tsx
import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';

const MainPageTemplate = getComponentPath('MAIN_PAGE_TEMPLATE');
const FinanceThemeProvider = getComponentPath('FINANCE_THEME_PROVIDER');
const FinanceDashboardWidget = getComponentPath('FINANCE_DASHBOARD_WIDGET');

const FinanceDashboardPageNEW: React.FC = () => {
  return (
    <MainPageTemplate>
      <FinanceThemeProvider>
        <FinanceDashboardWidget />
      </FinanceThemeProvider>
    </MainPageTemplate>
  );
};

export default FinanceDashboardPageNEW;
```

## Best Practices

1. **Consistent Structure** - Maintain a consistent structure across all templates
2. **Separation of Concerns** - Separate layout logic from feature content
3. **Centralized Imports** - Use centralized path management for imports
4. **Theme Consistency** - Apply consistent theming through providers
5. **Responsive Design** - Ensure templates work across all device sizes
6. **Accessibility** - Maintain accessibility standards in templates
7. **Performance** - Optimize template components for performance
8. **Documentation** - Document template structure and usage
