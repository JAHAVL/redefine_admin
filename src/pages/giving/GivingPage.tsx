import React, { useState, useEffect, useRef } from 'react';
import '../../styles/TaskManagerPage.css';
import LeftMenu from '../../components/Left Menu/LeftMenu';
import RAIChat from '../../components/RAI_Chat/RAIChat';
import TopMenu from '../../components/Top Menu/TopMenu';
import SubMenu from '../../components/Sub Menu/SubMenu';

import GivingWidget from '../../widgets/givingwidget/GivingWidget';

const GivingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true);
  const [raiChatExpanded, setRaiChatExpanded] = useState(true);
  const headerRef = useRef<HTMLElement | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuCollapse = (collapsed: boolean) => {
    setLeftMenuCollapsed(collapsed);
  };

  const handleRaiChatExpand = (expanded: boolean) => {
    setRaiChatExpanded(expanded);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      } else {
        document.documentElement.style.setProperty(
          "--header-height",
          "80px"
        );
      }
    };
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    } else {
      updateHeaderHeight();
    }
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

      {/* Sub Menu Component (update activeItem/mainSection for Giving) */}
      <SubMenu activeItem="giving" mainSection="giving" />

      <div className="main-content-wrapper">
        <div className={`admin-dashboard-left ${leftMenuCollapsed ? 'collapsed' : ''}`}>
          <LeftMenu 
            activeItem="giving" 
            onCollapse={handleMenuCollapse}
          />
        </div>
        <main className={`task-manager-content ${raiChatExpanded ? 'rai-expanded' : 'rai-collapsed'}`} style={{ padding: 0, marginTop: 0, overflowY: 'auto', background: 'transparent', backgroundColor: 'transparent' }}>
          <GivingWidget />
        </main>
        <RAIChat 
          expanded={raiChatExpanded} 
          onExpand={handleRaiChatExpand} 
        />
      </div>
      <div className={`mobileMenuDesign ${menuOpen ? "open" : ""}`} style={{ top: '100px' }}> 
        <div className="mobile-menu-content">
          <LeftMenu activeItem="giving" />
        </div>
      </div>
    </div>
  );
};

export default GivingPage;
