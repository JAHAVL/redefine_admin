import React from 'react';
import { getComponentPath } from '../../utils/pathconfig';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Using direct imports for finance components
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { FinanceWidgetContainer, FinanceContent } from '../../widgets/financewidget/FinanceWidgetStyled';
// Import for reconciliation module - not in pathconfig yet
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
