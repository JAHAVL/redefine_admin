import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
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
