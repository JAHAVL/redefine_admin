import React, { useState, useEffect, useRef } from 'react';
import '../../styles/TaskManagerPage.css';
import LeftMenu from '../../components/Left Menu/LeftMenu';
import RAIChat from '../../components/RAI_Chat/RAIChat';
import TopMenu from '../../components/Top Menu/TopMenu';
import SubMenu from '../../components/Sub Menu/SubMenu';

// Import the Mail Widget
import MailWidget from '../../widgets/Mail/MailWidget';

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

const MailPage: React.FC = () => {
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

      {/* Sub Menu Component */}
      <SubMenu activeItem="inbox" mainSection="mail" />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Left Sidebar/Menu - Now in a detached container with rounded corners */}
        <div className={`admin-dashboard-left ${leftMenuCollapsed ? 'collapsed' : ''}`}>
          <LeftMenu 
            activeItem="mail" 
            onCollapse={handleMenuCollapse}
          />
        </div>
        
        {/* Main Content - Will dynamically resize based on sidebar and chat states */}
        <main className={`task-manager-content ${raiChatExpanded ? 'rai-expanded' : 'rai-collapsed'}`} style={{ padding: 0, overflow: 'hidden' }}>
          <div className="mail-container" style={{ height: '100%', width: '100%', background: 'transparent', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Integrate the Mail Widget with style to ensure it fills the container */}
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
              <MailWidget />
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
          <LeftMenu activeItem="mail" />
        </div>
      </div>
    </div>
  );
};

export default MailPage;
