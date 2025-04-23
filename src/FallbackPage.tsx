import React from 'react';

interface FallbackPageProps {
  errorInfo?: any;
}

const FallbackPage: React.FC<FallbackPageProps> = ({ errorInfo }) => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>Redefine Church Admin</h1>
      <p>If you're seeing this page, the main application is having trouble loading.</p>
      <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Troubleshooting Steps:</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>Check browser console for JavaScript errors</li>
          <li>Verify that all required modules are installed</li>
          <li>Ensure API endpoints are accessible</li>
          <li>Check network connectivity</li>
        </ul>
      </div>
      
      {errorInfo && (
        <div style={{ margin: '20px 0', padding: '15px', background: '#fff0f0', borderRadius: '5px', textAlign: 'left' }}>
          <h3>Error Details:</h3>
          <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
            {errorInfo.toString()}
          </pre>
        </div>
      )}
      <button 
        onClick={() => window.location.reload()} 
        style={{ 
          padding: '10px 20px', 
          background: '#4285f4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reload Application
      </button>
    </div>
  );
};

export default FallbackPage;
