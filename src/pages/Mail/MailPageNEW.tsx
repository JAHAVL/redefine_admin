import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import MailWidget from '../../widgets/Mail/MailWidget';

/**
 * Mail Page component
 * Uses MainPageTemplate with MailWidget directly embedded
 */
const MailPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Mail">
      <MailWidget />
    </MainPageTemplate>
  );
};

export default MailPageNEW;
