import React, { useState, useEffect, useRef } from 'react';
import '../../styles/TaskManagerPage.css';
import LeftMenu from '../../components/Left Menu/LeftMenu';
import RAIChat from '../../components/RAI_Chat/RAIChat';
import TopMenu from '../../components/Top Menu/TopMenu';
import SubMenu from '../../components/Sub Menu/SubMenu';
import { getLocations } from '../../widgets/Locations/actions';
import { Location } from '../../widgets/Locations/types';

// Define interface for icon props
interface IconProps {
  size?: number;
  color?: string;
  [key: string]: any;
}

// Define type for icon components
type IconComponent = React.FC<IconProps>;

// Initialize icon components
let Menu: IconComponent;
let X: IconComponent;

try {
  const icons = require('lucide-react');
  Menu = icons.Menu;
  X = icons.X;
} catch (e) {
  // Fallback SVG components if lucide-react is not available
  Menu = () => null;
  X = () => null;
}

const AnalyticsPage: React.FC = () => {
  // State for mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  // State for collapsed left menu - initialize as collapsed (true) to match LeftMenu component
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true);
  // State for RAI Chat expanded state
  const [raiChatExpanded, setRaiChatExpanded] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef<HTMLElement | null>(null);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle left menu collapse state
  const handleMenuCollapse = (collapsed: boolean) => {
    setLeftMenuCollapsed(collapsed);
  };

  // Handle RAI Chat expand state
  const handleRaiChatExpand = (expanded: boolean) => {
    setRaiChatExpanded(expanded);
  };

  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await getLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Handle window resize to close menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Update header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      } else {
        // Set default if ref is not available
        document.documentElement.style.setProperty(
          "--header-height",
          "80px"
        );
      }
    };

    // Use ResizeObserver to monitor changes
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    } else {
      // Call once if ref is not available
      updateHeaderHeight();
    }

    // Cleanup observer on unmount
    return () => {
      if (headerRef.current) {
        resizeObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  // Generate mock analytics data
  const generateMockData = () => {
    if (locations.length === 0) return null;
    
    return {
      totalLocations: locations.length,
      averageNotificationDistance: Math.round(
        locations.reduce((sum, loc) => sum + loc.max_distance_to_notify, 0) / locations.length
      ),
      mostActiveLocation: locations.sort(() => 0.5 - Math.random())[0].name,
      visitorStats: [
        { month: 'Jan', visitors: Math.floor(Math.random() * 1000) },
        { month: 'Feb', visitors: Math.floor(Math.random() * 1000) },
        { month: 'Mar', visitors: Math.floor(Math.random() * 1000) },
        { month: 'Apr', visitors: Math.floor(Math.random() * 1000) },
        { month: 'May', visitors: Math.floor(Math.random() * 1000) },
        { month: 'Jun', visitors: Math.floor(Math.random() * 1000) }
      ]
    };
  };

  const analyticsData = !isLoading ? generateMockData() : null;

  // Render a simple bar chart
  const renderBarChart = (data: { month: string, visitors: number }[]) => {
    const maxValue = Math.max(...data.map(item => item.visitors));
    
    return (
      <div className="analytics-chart" style={{ marginTop: '20px' }}>
        <h4 style={{ marginBottom: '12px', color: '#fff' }}>Monthly Visitors</h4>
        <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end', gap: '12px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div 
                style={{ 
                  width: '100%', 
                  height: `${(item.visitors / maxValue) * 180}px`,
                  backgroundColor: '#3478ff',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }} 
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>{item.month}</div>
              <div style={{ fontSize: '10px', color: '#fff' }}>{item.visitors}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="task-manager-page">
      {/* Top Menu Component */}
      <TopMenu 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen} 
        headerRef={headerRef}
      />

      {/* Sub Menu Component - Note that we set activeItem and mainSection */}
      <SubMenu activeItem="analytics" mainSection="locations" />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Left Sidebar/Menu - Now in a detached container with rounded corners */}
        <div className={`admin-dashboard-left ${leftMenuCollapsed ? 'collapsed' : ''}`}>
          <LeftMenu 
            activeItem="locations" 
            onCollapse={handleMenuCollapse}
          />
        </div>
        
        {/* Main Content - Will dynamically resize based on sidebar and chat states */}
        <main className={`task-manager-content ${raiChatExpanded ? 'rai-expanded' : 'rai-collapsed'}`}>
          <div className="file-manager-container">
            {/* Analytics Container */}
            <div className="locations-widget">
              <div className="locations-header">
                <h2 className="locations-title">Location Analytics</h2>
              </div>
              
              {isLoading ? (
                <div className="locations-loading">
                  <p>Loading analytics...</p>
                </div>
              ) : (
                <div 
                  className="analytics-container"
                  style={{
                    backgroundColor: 'rgba(30, 30, 30, 0.7)',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {locations.length === 0 ? (
                    <div className="locations-empty-state">
                      <p>No locations found. Add locations to see analytics.</p>
                    </div>
                  ) : (
                    <>
                      <div className="analytics-summary" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div 
                          className="analytics-card" 
                          style={{ 
                            flex: '1 0 200px',
                            backgroundColor: 'rgba(40, 40, 40, 0.7)',
                            borderRadius: '8px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <h3 style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>Total Locations</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{analyticsData?.totalLocations}</p>
                        </div>
                        
                        <div 
                          className="analytics-card" 
                          style={{ 
                            flex: '1 0 200px',
                            backgroundColor: 'rgba(40, 40, 40, 0.7)',
                            borderRadius: '8px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <h3 style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>Avg. Notification Distance</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{analyticsData?.averageNotificationDistance}m</p>
                        </div>
                        
                        <div 
                          className="analytics-card" 
                          style={{ 
                            flex: '1 0 200px',
                            backgroundColor: 'rgba(40, 40, 40, 0.7)',
                            borderRadius: '8px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <h3 style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>Most Active Location</h3>
                          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{analyticsData?.mostActiveLocation}</p>
                        </div>
                      </div>
                      
                      <div 
                        className="analytics-chart-container"
                        style={{ 
                          marginTop: '24px',
                          backgroundColor: 'rgba(40, 40, 40, 0.7)',
                          borderRadius: '8px',
                          padding: '16px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {renderBarChart(analyticsData?.visitorStats || [])}
                      </div>
                      
                      <div className="analytics-actions" style={{ marginTop: '24px', textAlign: 'right' }}>
                        <button 
                          className="analytics-export-button"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#3478ff',
                            border: '1px solid #3478ff',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Export Report
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* AI Chat Component */}
        <RAIChat 
          expanded={raiChatExpanded} 
          onExpand={handleRaiChatExpand} 
        />
      </div>

      {/* Mobile Menu - Only visible on mobile devices */}
      <div className={`mobileMenuDesign ${menuOpen ? "open" : ""}`} style={{ top: '100px' }}> 
        <div className="mobile-menu-content">
          <LeftMenu activeItem="locations" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
