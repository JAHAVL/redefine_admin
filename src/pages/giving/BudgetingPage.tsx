import React, { useState, useEffect, useRef } from 'react';
import '../../styles/TaskManagerPage.css';
import LeftMenu from '../../components/Left Menu/LeftMenu';
import RAIChat from '../../components/RAI_Chat/RAIChat';
import TopMenu from '../../components/Top Menu/TopMenu';
import SubMenu from '../../components/Sub Menu/SubMenu';
import AccountSelectorWidget from '../../widgets/givingwidget/AccountSelectorWidget';
import BudgetSummaryWidget from '../../widgets/givingwidget/BudgetSummaryWidget';
import BudgetBuilderWidget from '../../widgets/givingwidget/BudgetBuilderWidget';


const MOCK_ACCOUNTS = [
  'General Fund',
  'Missions',
  'Benevolence',
  'Building Fund',
];

const BudgetingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true);
  const [raiChatExpanded, setRaiChatExpanded] = useState(true);
  const headerRef = useRef<HTMLElement | null>(null);

  // State for selected account
  const [selectedAccount, setSelectedAccount] = useState<string>(MOCK_ACCOUNTS[0]);

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
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', width: '100%' }}>
            <div style={{ flex: 1, background: 'transparent', minHeight: '340px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <AccountSelectorWidget selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} />
            </div>
            <div style={{ flex: 1, background: 'transparent', minHeight: '340px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '24px' }}>
              <BudgetSummaryWidget selectedAccount={selectedAccount} />
            </div>
          </div>
          <div style={{ background: 'transparent', minHeight: '480px', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', width: '100%', padding: '32px 16px' }}>
            <BudgetBuilderWidget />
          </div>
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

export default BudgetingPage;
