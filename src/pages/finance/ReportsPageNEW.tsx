import React from 'react';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { FinanceWidgetContainer, FinanceContent } from '../../widgets/financewidget/FinanceWidgetStyled';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
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
