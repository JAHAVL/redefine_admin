import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
import ReconciliationModule from '../../widgets/financewidget/modules/reconciliation/ReconciliationModule';

/**
 * Reconciliation Page component
 * Uses the master template and provides a container for the reconciliation widget
 */
const ReconciliationPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance Reconciliation">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <ReconciliationModule />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default ReconciliationPageNEW;
