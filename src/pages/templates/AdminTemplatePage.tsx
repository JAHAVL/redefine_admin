import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

/**
 * Admin Template Page component
 * Uses the master template and provides a container for widget content
 */
const AdminTemplatePage: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Admin Template">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default AdminTemplatePage;
