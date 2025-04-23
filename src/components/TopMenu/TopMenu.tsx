import React from 'react';
import { Link } from 'react-router-dom';
import './TopMenu.css';

// Import icons if available, otherwise use text fallbacks
let Menu: any;
let Bell: any;
let User: any;
let Play: any;
let Users: any;
let MessageCircle: any;
let Heart: any;
let Connect: any;
let Message: any;

try {
  const icons = require('lucide-react');
  Menu = icons.Menu;
  Bell = icons.Bell;
  User = icons.User;
  Play = icons.Play;
  Users = icons.Users;
  MessageCircle = icons.MessageCircle;
  Heart = icons.Heart;
  Connect = icons.Network;
  Message = icons.MessageSquare;
} catch (error) {
  // Fallback if lucide-react is not available
  Menu = () => <span>☰</span>;
  Bell = () => <span>🔔</span>;
  User = () => <span>👤</span>;
  Play = () => <span>▶️</span>;
  Users = () => <span>👥</span>;
  MessageCircle = () => <span>💬</span>;
  Heart = () => <span>❤️</span>;
  Connect = () => <span>🔗</span>;
  Message = () => <span>✉️</span>;
}

interface TopMenuProps {
  toggleMenu: () => void;
  menuOpen: boolean;
  headerRef: React.RefObject<HTMLElement>;
}

const TopMenu: React.FC<TopMenuProps> = ({ toggleMenu, menuOpen, headerRef }) => {
  return (
    <header className="top-menu" ref={headerRef}>
      <div className="top-menu-inner">
        {/* Left section - Logo */}
        <div className="top-menu-left">
          <div className="logo-container">
            <Link to="/">
              <img 
                src="https://images.ctfassets.net/1itkm9rji8jb/48jN6KXbjOANg70fZ2oHFE/66ead803c36b23e6752a0a2602e659bc/logo__1_.png"
                alt="Redefine Church"
                className="church-logo-img"
              />
            </Link>
          </div>
        </div>
        
        {/* Center section - Main navigation icons */}
        <div className="main-nav-icons">
          <ul>
            <li>
              <Link to="/connect">
                <span className="nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/watch">
                <span className="nav-icon"><Play size={24} color="#fff" /></span>
              </Link>
            </li>
            <li>
              <Link to="/serve">
                <span className="nav-icon"><Users size={24} color="#fff" /></span>
              </Link>
            </li>
            <li>
              <Link to="/groups">
                <span className="nav-icon"><MessageCircle size={24} color="#fff" /></span>
              </Link>
            </li>
            <li>
              <Link to="/give">
                <span className="nav-icon"><Heart size={24} color="#fff" /></span>
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Right section - Header controls */}
        <div className="top-menu-right">
          {/* Messages icon */}
          <Link to="/messages" className="header-icon">
            <span className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className="header-icon">
            <Bell size={24} color="#fff" />
          </Link>
          
          {/* User Profile - restored with picture and name */}
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle mobile menu">
            <Menu size={24} color="#fff" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopMenu;
