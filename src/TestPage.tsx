import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      height: '100vh',
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#343a40' }}>
        Redefine Church Admin - Test Page
      </h1>
      
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '80%',
        maxWidth: '800px'
      }}>
        <h2 style={{ color: '#495057', marginBottom: '20px' }}>Application Status</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#6c757d' }}>React is Working</h3>
          <p>If you can see this page, React is rendering correctly.</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#6c757d' }}>Component Structure</h3>
          <p>This test page is a simple React component outside your main application structure.</p>
        </div>
        
        <div style={{ 
          padding: '15px', 
          background: '#e9ecef', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#6c757d' }}>Next Steps</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>If this page renders but your main app doesn't, there's likely an issue with your routing or main components</li>
            <li>Check the browser console for specific error messages</li>
            <li>Verify that all dependencies are correctly installed</li>
            <li>Ensure your application structure follows the container pattern in your architecture</li>
          </ul>
        </div>
        
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Try Main Application
        </button>
      </div>
    </div>
  );
};

export default TestPage;
