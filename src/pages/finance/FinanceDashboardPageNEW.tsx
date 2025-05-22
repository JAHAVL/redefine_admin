import React from 'react';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Using direct imports for finance components instead of dynamic requires
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { FinanceWidgetContainer, FinanceContent } from '../../widgets/financewidget/FinanceWidgetStyled';
import FinanceDashboard from '../../widgets/financewidget/modules/dashboard/FinanceDashboard';

/**
 * Finance Dashboard Page component
 * Uses the master template and provides the finance dashboard widget with its required providers
 */
const FinanceDashboardPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance">
      <FinanceThemeProvider>
        <FinanceWidgetContainer>
          <FinanceContent>
            <FinanceDashboard />
          </FinanceContent>
        </FinanceWidgetContainer>
      </FinanceThemeProvider>
    </MainPageTemplate>
  );
};

export default FinanceDashboardPageNEW;
