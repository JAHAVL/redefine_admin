import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
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
