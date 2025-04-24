import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

/**
 * Groups Page component for File Manager
 * Uses MainPageTemplate with empty content
 * Ready for a new widget implementation
 */
const GroupsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Groups">
      <div style={{ padding: '20px' }}>
        {/* Placeholder for new groups widget */}
        <h2>File Groups</h2>
        <p>Ready for new implementation</p>
      </div>
    </MainPageTemplate>
  );
};

export default GroupsPageNEW;
