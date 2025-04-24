import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import MailTemplates from '../../widgets/Mail/mailtemplates/MailTemplates';

/**
 * Mail Templates Page component
 * Uses MainPageTemplate with MailTemplates widget directly embedded
 */
const MailTemplatesPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Mail Templates">
      <MailTemplates />
    </MainPageTemplate>
  );
};

export default MailTemplatesPageNEW;
