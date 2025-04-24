import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import MailSettings from '../../widgets/Mail/mailsettings/MailSettings';

/**
 * Mail Settings Page component
 * Uses MainPageTemplate with MailSettings widget directly embedded
 */
const MailSettingsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Mail Settings">
      <MailSettings />
    </MainPageTemplate>
  );
};

export default MailSettingsPageNEW;
