import React from 'react';
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

/**
 * File Manager Page component
 * Uses MainPageTemplate with empty content
 * Ready for a new widget implementation
 */
const FileManagerPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Manager">
      <div style={{ padding: '20px' }}>
        {/* Placeholder for new file manager widget */}
        <h2>File Manager</h2>
        <p>Ready for new implementation</p>
      </div>
    </MainPageTemplate>
  );
};

export default FileManagerPageNEW;
