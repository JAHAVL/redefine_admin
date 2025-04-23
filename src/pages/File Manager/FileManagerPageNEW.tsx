import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

/**
 * File Manager Page NEW component
 * Uses the master template and provides a container for widget content
 */
const FileManagerPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Manager NEW">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default FileManagerPageNEW;
