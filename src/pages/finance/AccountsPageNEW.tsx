import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Using direct imports for finance components
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { FinanceWidgetContainer, FinanceContent } from '../../widgets/financewidget/FinanceWidgetStyled';
// Import for accounts module - not in pathconfig yet
import AccountsModule from '../../widgets/financewidget/modules/accounts';

/**
 * Accounts Page component
 * Uses the master template and provides a container for the accounts widget
 */
const AccountsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance Accounts">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <AccountsModule />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default AccountsPageNEW;
