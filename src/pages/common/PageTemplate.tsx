import React from 'react';

interface PageTemplateProps {
  title: string;
  description: string;
}

/**
 * Generic page template used for placeholder pages
 */
const PageTemplate: React.FC<PageTemplateProps> = ({ title, description }) => {
  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{title}</h1>
      <p>{description}</p>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h2>Widget Container</h2>
        <p>This is a placeholder for the widget that would normally be loaded here.</p>
        <p>Following the application architecture, this page would load specific widgets based on the route.</p>
      </div>
    </div>
  );
};

export default PageTemplate;
