import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Using direct imports for finance components
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { FinanceWidgetContainer, FinanceContent } from '../../widgets/financewidget/FinanceWidgetStyled';
import TransactionsModule from '../../widgets/financewidget/modules/transactions';

/**
 * Transactions Page component
 * Uses the master template and provides a container for the transactions widget
 */
const TransactionsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance Transactions">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <TransactionsModule />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default TransactionsPageNEW;
