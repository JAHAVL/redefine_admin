import React from 'react';
import FinancePageTemplate from '../../templates/page-templates/financepagetemplate';
import FinanceWidget from '../../widgets/financewidget';

const FinancePage: React.FC = () => {
  return (
    <FinancePageTemplate>
      <FinanceWidget />
    </FinancePageTemplate>
  );
};

export default FinancePage;
