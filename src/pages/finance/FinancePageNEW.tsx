import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import FinanceWidget from '../../widgets/financewidget';

/**
 * Finance Page component
 * Uses the master template and provides a container for widget content
 */
const FinancePageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceWidget />
      </div>
    </MainPageTemplate>
  );
};

export default FinancePageNEW;
