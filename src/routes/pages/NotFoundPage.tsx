import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Not Found (404) page component
 */
const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '72px', margin: '20px 0', color: '#343a40' }}>404</h1>
      <h2 style={{ marginBottom: '30px', color: '#495057' }}>Page Not Found</h2>
      
      <p style={{ fontSize: '18px', color: '#6c757d', marginBottom: '30px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/"
        style={{ 
          display: 'inline-block',
          padding: '12px 24px',
          background: '#4285f4',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
