import React, { useState, useEffect, useRef } from 'react';
import '../../styles/TaskManagerPage.css';
import LeftMenu from '../../components/Left Menu/LeftMenu';
import RAIChat from '../../components/RAI_Chat/RAIChat';
import TopMenu from '../../components/Top Menu/TopMenu';
import SubMenu from '../../components/Sub Menu/SubMenu';

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

const SettingsPage: React.FC = () => {
  // State for mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  // State for collapsed left menu - initialize as collapsed (true) to match LeftMenu component
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true);
  // State for RAI Chat expanded state
  const [raiChatExpanded, setRaiChatExpanded] = useState(true);
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

  return (
    <div className="task-manager-page">
      {/* Top Menu Component */}
      <TopMenu 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen} 
        headerRef={headerRef}
      />

      {/* Sub Menu Component - Note that we set activeItem and mainSection */}
      <SubMenu activeItem="settings" mainSection="locations" />

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
            {/* Settings Container */}
            <div className="locations-widget">
              <div className="locations-header">
                <h2 className="locations-title">Location Settings</h2>
              </div>
              
              <div 
                className="locations-settings-container"
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.7)',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div className="settings-section">
                  <h3 className="settings-section-title">Google Maps API</h3>
                  <div className="settings-form-group">
                    <label className="settings-label">API Key</label>
                    <input 
                      type="text" 
                      className="settings-input"
                      placeholder="Enter Google Maps API Key"
                      defaultValue="AIzaSyDtAeAC_yffwUGk2zcq5bpSaWeBm23hvs8"
                      style={{
                        backgroundColor: 'rgba(40, 40, 40, 0.7)',
                        border: '1px solid rgba(80, 80, 80, 0.7)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        color: 'white',
                        width: '100%',
                        maxWidth: '500px'
                      }}
                    />
                    <p className="settings-helper-text" style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '4px' }}>
                      This key is used for address autocomplete and map display.
                    </p>
                  </div>
                </div>
                
                <div className="settings-section" style={{ marginTop: '24px' }}>
                  <h3 className="settings-section-title">Default Location Settings</h3>
                  <div className="settings-form-group">
                    <label className="settings-label">Default Notification Distance (meters)</label>
                    <input 
                      type="number" 
                      className="settings-input"
                      placeholder="Enter default distance"
                      defaultValue="1000"
                      style={{
                        backgroundColor: 'rgba(40, 40, 40, 0.7)',
                        border: '1px solid rgba(80, 80, 80, 0.7)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        color: 'white',
                        width: '100%',
                        maxWidth: '200px'
                      }}
                    />
                  </div>
                </div>
                
                <div className="settings-section" style={{ marginTop: '24px' }}>
                  <h3 className="settings-section-title">Display Settings</h3>
                  <div className="settings-form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <input 
                      type="checkbox" 
                      id="show-coordinates"
                      defaultChecked={true}
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="show-coordinates" className="settings-label">Show coordinates in location cards</label>
                  </div>
                  
                  <div className="settings-form-group" style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      id="enable-clustering"
                      defaultChecked={true}
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="enable-clustering" className="settings-label">Enable marker clustering on map</label>
                  </div>
                </div>
                
                <div className="settings-actions" style={{ marginTop: '32px' }}>
                  <button 
                    className="settings-save-button"
                    style={{
                      backgroundColor: '#3478ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
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

export default SettingsPage;
