import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
import ReportsModule from '../../widgets/financewidget/modules/reports/ReportsModule';

/**
 * Reports Page component
 * Uses the master template and provides a container for the reports widget
 */
const ReportsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance Reports">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <ReportsModule />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default ReportsPageNEW;
