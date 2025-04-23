import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import './MainPageTemplate.css';

// Import components
import TopMenu from '../TopMenu/TopMenu';
import SubMenu from '../SubMenu/SubMenu';
import LeftMenu from '../LeftMenu/LeftMenu';
import RAIChat from '../RAIChat/RAIChat';

// We're now relying more on CSS classes for styling instead of inline styles
// This aligns better with the application's widget architecture

interface MainPageTemplateProps {
  children: React.ReactNode;
  pageTitle?: string;
}

/**
 * Main page template component that provides the standard layout for all pages
 * Includes the top menu, sub menu, left menu, and RAI chat
 */
const MainPageTemplate: React.FC<MainPageTemplateProps> = ({ 
  children, 
  pageTitle = 'Redefine Church' 
}) => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  
  // State for menu collapse
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState<boolean>(true);
  const [raiChatExpanded, setRaiChatExpanded] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Get the current section from the URL path
  const getCurrentSection = (): string => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };

  // Toggle functions
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuCollapse = (collapsed: boolean) => {
    setLeftMenuCollapsed(collapsed);
  };

  const handleRaiChatExpand = (expanded: boolean) => {
    setRaiChatExpanded(expanded);
  };

  // Add console logging to debug CSS conflicts
  useEffect(() => {
    console.log('RAI Chat expanded:', raiChatExpanded);
    console.log('Left menu collapsed:', leftMenuCollapsed);
  }, [raiChatExpanded, leftMenuCollapsed]);

  // Handle window resize to close menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

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

  const currentSection = getCurrentSection();

  return (
    <div className="main-page-template">
      {/* Single container with all components */}
      <div className="single-app-container">
        {/* Top Menu Component */}
        <TopMenu 
          toggleMenu={toggleMenu} 
          menuOpen={mobileMenuOpen} 
          headerRef={headerRef}
        />

        {/* Sub Menu Component */}
        <SubMenu 
          activeItem={currentSection} 
          mainSection={currentSection}
        />
        
        {/* Left Menu at fixed position */}
        <LeftMenu 
          activeItem={currentSection} 
          onCollapse={handleMenuCollapse}
        />
        
        {/* Main content with proper positioning and z-index */}
        <main 
          className="main-content"
          style={{
            position: 'absolute',
            marginLeft: leftMenuCollapsed ? '90px' : '260px',  
            marginRight: raiChatExpanded ? '310px' : '80px',   
            width: 'auto',
            backgroundColor: 'var(--accent-color)', 
            // Adjusted to 30px for more balanced spacing
            top: 'calc(var(--header-height) + var(--submenu-height) + 30px)', 
            height: 'auto', 
            bottom: '20px', 
            transition: 'all 0.3s ease',
            // Force a much higher z-index while still below top menu and submenu
            zIndex: 80 
          }}
        >
          {children}
        </main>

        {/* RAI Chat Component is positioned absolutely from RAIChat.css */}
        <RAIChat 
          expanded={raiChatExpanded} 
          onExpand={handleRaiChatExpand}
        />
      </div>
      
      {/* Mobile Menu - Only visible on mobile devices */}
      <div className={`mobileMenuDesign ${mobileMenuOpen ? "open" : ""}`} style={{ top: '100px' }}> 
        <div className="mobile-menu-content">
          <LeftMenu activeItem={currentSection} />
        </div>
      </div>
    </div>
  );
};

export default MainPageTemplate;
