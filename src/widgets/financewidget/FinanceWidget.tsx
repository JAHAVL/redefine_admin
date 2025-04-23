import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from './FinanceWidgetStyled/index';
import { FinanceThemeProvider } from './theme/FinanceThemeProvider';

// Import module components
import FinanceDashboard from './modules/dashboard';
import TransactionsModule from './modules/transactions';
import AccountsModule from './modules/accounts';
import ReportsModule from './modules/reports/ReportsModule';
import ReconciliationModule from './modules/reconciliation/ReconciliationModule';
import BudgetModule from './modules/budget/BudgetModule';
import GivingStatementsModule from './modules/statements/GivingStatementsModule';

// This will be our main Finance Widget container component
const FinanceWidget: React.FC = () => {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState('dashboard');

  // Helper to determine which module is active based on URL
  const determineActiveModule = () => {
    const path = location.pathname;
    if (path.includes('/transactions')) return 'transactions';
    if (path.includes('/accounts')) return 'accounts';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/reconciliation')) return 'reconciliation';
    if (path.includes('/budget')) return 'budget';
    if (path.includes('/statements')) return 'statements';
    return 'dashboard';
  };
  
  // Set the active module based on the URL when component mounts or URL changes
  useEffect(() => {
    setActiveModule(determineActiveModule());
  }, [location.pathname]);

  // Render the appropriate module content based on active module
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <FinanceDashboard />;
      case 'transactions':
        return <TransactionsModule />;
      case 'accounts':
        return <AccountsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'reconciliation':
        return <ReconciliationModule />;
      case 'budget':
        return <BudgetModule />;
      case 'statements':
        return <GivingStatementsModule />;
      default:
        return <FinanceDashboard />;
    }
  };

  return (
    <FinanceThemeProvider>
      <FinanceWidgetContainer>
        <FinanceContent>
          {renderModuleContent()}
        </FinanceContent>
      </FinanceWidgetContainer>
    </FinanceThemeProvider>
  );
};

export default FinanceWidget;
