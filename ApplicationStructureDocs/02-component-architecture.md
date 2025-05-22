# Component Architecture

This document outlines the component architecture used in the application, defining the different types of components, their responsibilities, and how they interact with each other.

## Component Types

### 1. Page Components

Page components represent entire pages in the application and are directly associated with routes.

**Characteristics:**
- Located in the `/src/pages` directory, organized by feature
- Responsible for page-level state management
- Utilize layout components for consistent structure
- Import and compose feature-specific widgets
- Named with the suffix "Page" (e.g., `FinanceDashboardPage.tsx`)

**Example:**
```tsx
import React from 'react';
import { getComponentPath } from '../utils/pathconfig';
import MainPageTemplate from getComponentPath('MAIN_PAGE_TEMPLATE');
import FinanceThemeProvider from getComponentPath('FINANCE_THEME_PROVIDER');
import FinanceDashboardWidget from getComponentPath('FINANCE_DASHBOARD_WIDGET');

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

### 2. Layout Components

Layout components define the structure and common UI elements of pages.

**Characteristics:**
- Located in the `/src/layouts` directory
- Responsible for consistent page structure
- Handle common UI elements (headers, footers, navigation)
- Accept children to render page content
- Named descriptively based on their purpose (e.g., `MainPageTemplate.tsx`)

**Example:**
```tsx
import React from 'react';
import LeftMenu from '../components/LeftMenu/LeftMenu';
import TopMenu from '../components/TopMenu/TopMenu';
import './MainPageTemplate.css';

interface MainPageTemplateProps {
  children: React.ReactNode;
}

const MainPageTemplate: React.FC<MainPageTemplateProps> = ({ children }) => {
  return (
    <div className="main-template-container">
      <div className="top-menu">
        <TopMenu />
      </div>
      <div className="content-container">
        <div className="left-menu">
          <LeftMenu />
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

### 3. Widget Components

Widget components are feature-specific functional components that encapsulate business logic.

**Characteristics:**
- Located in the `/src/widgets` directory, organized by feature
- Contain feature-specific business logic
- May maintain their own internal state
- Can be composed of multiple smaller components
- Named with the suffix "Widget" or "Module" (e.g., `FinanceDashboardWidget.tsx`)

**Example:**
```tsx
import React, { useState, useEffect } from 'react';
import { TransactionList, TransactionFilters, TransactionSummary } from '../components';
import { fetchTransactions } from '../services/transactionService';
import './TransactionsWidget.css';

const TransactionsWidget: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({});
  
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTransactions(filters);
      setTransactions(data);
    };
    
    loadData();
  }, [filters]);
  
  return (
    <div className="transactions-widget">
      <TransactionFilters onChange={setFilters} />
      <TransactionSummary transactions={transactions} />
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default TransactionsWidget;
```

### 4. UI Components

UI components are reusable building blocks used across the application.

**Characteristics:**
- Located in the `/src/components` directory
- Highly reusable and modular
- Generally stateless or with minimal internal state
- Accept props for customization
- Named based on function (e.g., `Button.tsx`, `Table.tsx`)

**Example:**
```tsx
import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button 
      className={`button ${variant}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
```

## Component Communication

- **Props** - Primary method for parent-to-child communication
- **Context** - For shared state across component trees
- **Custom hooks** - For reusable logic and state

## Component File Structure

Each component should be structured as follows:

```
/ComponentName
  ComponentName.tsx       # Main component file
  ComponentName.css       # Component-specific styles
  ComponentName.test.tsx  # Component tests
  index.ts                # Re-export for cleaner imports
```

## Best Practices

1. **Single Responsibility** - Each component should have a single, well-defined responsibility
2. **Composition Over Inheritance** - Use component composition rather than inheritance
3. **Props Interface** - Define interfaces for all component props
4. **Default Props** - Provide sensible defaults for optional props
5. **Memoization** - Use React.memo for performance optimization when appropriate
6. **Error Boundaries** - Implement error boundaries to prevent UI crashes
