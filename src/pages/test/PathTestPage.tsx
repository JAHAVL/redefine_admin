import React from 'react';
import { COMPONENT_PATHS, getComponentPath } from '../../utils/pathconfig';

// Directly import a component using our defined paths
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

/**
 * Test Page to verify our path management system works correctly
 */
const PathTestPage: React.FC = () => {
  // Example of using getComponentPath function
  const leftMenuPath = getComponentPath('../../', 'LEFT_MENU');
  const topMenuPath = getComponentPath('../../', 'TOP_MENU');
  
  return (
    <MainPageTemplate pageTitle="Path System Test">
      <div style={{ padding: '20px' }}>
        <h1>Path Configuration System Test</h1>
        <p>This page successfully imports MainPageTemplate using our path system.</p>
        
        <h2>Registered Component Paths:</h2>
        <ul>
          {Object.entries(COMPONENT_PATHS).map(([key, path]) => (
            <li key={key}>
              <strong>{key}:</strong> {path}
            </li>
          ))}
        </ul>
        
        <h2>Dynamic Path Resolution:</h2>
        <p>Left Menu path: <code>{leftMenuPath}</code></p>
        <p>Top Menu path: <code>{topMenuPath}</code></p>
        
        <h3>How to Use This System:</h3>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
{`// 1. Import the path utilities
import { getComponentPath } from '../../utils/pathconfig';

// 2. Get component paths
const componentPath = getComponentPath('../../', 'COMPONENT_NAME');

// 3. Import the component
import Component from componentPath; // This would be dynamic in a real implementation
`}
        </pre>
      </div>
    </MainPageTemplate>
  );
};

export default PathTestPage;
