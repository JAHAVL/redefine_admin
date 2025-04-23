import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
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
