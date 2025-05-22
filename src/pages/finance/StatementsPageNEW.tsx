import React from 'react';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { FinanceWidgetContainer, FinanceContent } from '../../widgets/financewidget/FinanceWidgetStyled';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import GivingStatementsModule from '../../widgets/financewidget/modules/statements/GivingStatementsModule';

/**
 * Statements Page component
 * Uses the master template and provides a container for the statements widget
 */
const StatementsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance Statements">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <GivingStatementsModule />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default StatementsPageNEW;
