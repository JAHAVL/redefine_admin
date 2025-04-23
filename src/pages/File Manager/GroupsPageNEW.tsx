import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

/**
 * Groups Page component for File Manager
 * Uses the master template and provides a container for widget content
 */
const GroupsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Groups">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default GroupsPageNEW;
