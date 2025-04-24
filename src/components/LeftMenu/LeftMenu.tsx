import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './LeftMenu.css';

// Icon imports or fallbacks
let ChevronLeft: any;
let ChevronRight: any;
let LayoutDashboard: any;
let Users: any;
let Calendar: any;
let UserPlus: any;
let DollarSign: any;
let Youtube: any;
let MapPin: any;
let FileEdit: any;

try {
  const icons = require('lucide-react');
  ChevronLeft = icons.ChevronLeft;
  ChevronRight = icons.ChevronRight;
  LayoutDashboard = icons.LayoutDashboard;
  Users = icons.Users;
  Calendar = icons.Calendar;
  UserPlus = icons.UserPlus;
  DollarSign = icons.DollarSign;
  Youtube = icons.Youtube;
  MapPin = icons.MapPin;
  FileEdit = icons.FileEdit;
} catch (error) {
  // Fallback SVG icons
  ChevronLeft = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
  ChevronRight = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

// Define props interface
interface LeftMenuProps {
  activeItem?: string;
  onCollapse?: (collapsed: boolean) => void;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ activeItem = 'dashboard', onCollapse }) => {
  // Add state for collapsed menu - default to collapsed (true)
  const [collapsed, setCollapsed] = useState(true);

  // Toggle collapsed state
  const toggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    // Call the onCollapse prop if provided
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  // Define menu items - matching the original admin menu structure
  const menuItems = [
    { id: 'dashboard', label: 'Dashboards', icon: 'https://images.ctfassets.net/1itkm9rji8jb/3P8hpCQVYoLhlMHVj2tVOZ/2182d9aa3cb5bd0c2585482d8cc11fa3/dashIcon.png', link: '/admin/dashboard' },
    { id: 'people', label: 'People', icon: 'https://images.ctfassets.net/1itkm9rji8jb/5Ge0I3BVeTdtrZTCOpiosW/9f770ffed189d3a9c63237d55c5e7166/ico-people.svg', link: '/people' },
    { id: 'schedule', label: 'Schedules', icon: 'https://images.ctfassets.net/1itkm9rji8jb/262tDgGk3FOuhQ8nlVUoiY/d0232b2f29e5193aaedae4a4b6bfe08f/ico-sch.svg', link: '/scheduler-new' },
    { id: 'groups', label: 'Groups', icon: 'https://images.ctfassets.net/1itkm9rji8jb/4X5RS42wn101bgkUkdQqF0/2b5fe2c4b5a56b3fda01fd2b66a955de/ico-group.svg', link: '/groups' },
    { id: 'kids', label: 'Kids', icon: 'https://images.ctfassets.net/1itkm9rji8jb/1Qy0TsteEmKbYWTPuaSZSG/faa5a80eadea3cec0e5cc5ed381f1c34/ico-kid.svg', link: '/kids' },
    { id: 'giving', label: 'Giving', icon: 'https://images.ctfassets.net/1itkm9rji8jb/2Tm3pHUA0oiUCmU5nsT4l4/a7e43a934909b17de1d9af6837ddfb02/ico-giving.svg', link: '/giving' },
    { id: 'finance', label: 'Finance', icon: 'dollar-sign', iconComponent: DollarSign, link: '/finance-new' },
    { id: 'livestream', label: 'Live Stream', icon: 'https://images.ctfassets.net/1itkm9rji8jb/6lyyozpxIzbB1ESrcbFC1v/27d14aac52adc9aaada713d7b48f7b22/ico-stream.svg', link: '/livestream' },
    { id: 'locations', label: 'Locations', icon: 'map-pin', iconComponent: MapPin, link: '/locations-new' },
    { id: 'system-posts', label: 'System Posts', icon: 'file-edit', iconComponent: FileEdit, link: '/system-posts' },
    { id: 'task-manager', label: 'Task Manager', icon: 'task', iconComponent: Calendar, link: '/task-manager-new' },
    { id: 'file-manager', label: 'File Manager', icon: 'file', iconComponent: FileEdit, link: '/file-manager-new' },
    { id: 'mail', label: 'Mail', icon: 'mail', iconComponent: FileEdit, link: '/mail-new' },
  ];

  // Render icon based on the item type (URL or component)
  const renderIcon = (item: any) => {
    // If item has an iconComponent property, use it
    if (item.iconComponent) {
      const IconComponent = item.iconComponent;
      return <IconComponent size={20} className="menu-icon" />
    }
    // Otherwise use the image URL
    return item.icon ? <img src={item.icon} alt={item.label} className="menu-icon" /> : null;
  };

  return (
    <div className={`left-menu ${collapsed ? 'collapsed' : ''}`}>
      {/* Menu header with collapse button */}
      <div className="menu-header">
        <button className="collapse-button" onClick={toggleCollapse} aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Menu items */}
      <div className="header-menu-main-left">
        <div className="header-menu newmenuDesign">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className={activeItem === item.id ? 'active' : ''}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {renderIcon(item)}
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
