import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const MinimalApp: React.FC = () => {
  return (
    <Router>
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
          Redefine Church Admin
        </h1>
        
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '80%',
          maxWidth: '800px'
        }}>
          <h2 style={{ color: '#495057', marginBottom: '20px' }}>Docker Environment Working</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#6c757d' }}>React is Working</h3>
            <p>This minimal application is running correctly in Docker.</p>
          </div>
          
          <div style={{ 
            padding: '15px', 
            background: '#e9ecef', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#6c757d' }}>Next Steps</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Restore your original application code</li>
              <li>Fix any remaining module resolution issues</li>
              <li>Continue development of your widget architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default MinimalApp;
