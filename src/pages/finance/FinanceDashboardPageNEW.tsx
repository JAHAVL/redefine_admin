import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
import FinanceDashboard from '../../widgets/financewidget/modules/dashboard';

/**
 * Finance Dashboard Page component
 * Uses the master template and provides a container for the finance dashboard widget
 */
const FinanceDashboardPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <FinanceDashboard />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default FinanceDashboardPageNEW;
