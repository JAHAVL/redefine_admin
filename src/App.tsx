import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css';
import { RAIChatProvider } from './components/RAIChat';

// Import ProtectedRoutes from the routes directory
const ProtectedRoutes = React.lazy(() => import('./routes/ProtectedRoutes'));

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('App component mounted');
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RAIChatProvider>
      <Router>
        <div className="app-container" style={{ height: '100vh', width: '100%' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh', 
              fontSize: '20px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Loading Redefine Church Admin...
            </div>
          ) : (
            <Suspense fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                fontSize: '20px',
                fontFamily: 'Arial, sans-serif'
              }}>
                Loading routes...
              </div>
            }>
              <ProtectedRoutes />
            </Suspense>
          )}
        </div>
      </Router>
    </RAIChatProvider>
  );
};

export default App;
