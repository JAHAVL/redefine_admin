import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubMenu.css';

// Define interface for icon props
interface IconProps {
  size?: number;
  color?: string;
  [key: string]: any;
}

// Define type for icon components
type IconComponent = React.FC<IconProps>;

// Initialize icon components
let Calendar: IconComponent;
let FileText: IconComponent;
let ClipboardList: IconComponent;
let Star: IconComponent;
let Clock: IconComponent;
let Folder: IconComponent;
let Users: IconComponent;

try {
  const icons = require('lucide-react');
  Calendar = icons.Calendar;
  FileText = icons.FileText;
  ClipboardList = icons.ClipboardList || icons.ListTodo;
  Star = icons.Star;
  Clock = icons.Clock;
  Folder = icons.Folder;
  Users = icons.Users;
} catch (e) {
  // Fallback SVG components if lucide-react is not available
  Calendar = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
  FileText = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
  ClipboardList = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="5" width="10" height="14" rx="2"></rect>
      <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"></path>
      <line x1="12" y1="10" x2="16" y2="10"></line>
      <line x1="12" y1="14" x2="16" y2="14"></line>
      <line x1="12" y1="18" x2="16" y2="18"></line>
    </svg>
  );
  Star = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
  Clock = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
  Folder = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
  Users = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

interface SubMenuItem {
  id: string;
  label: string;
  icon?: IconComponent;
  path: string;
}

interface SubMenuProps {
  activeItem?: string;
  mainSection?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({ activeItem = 'board', mainSection = 'dashboard' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  let menuItems: SubMenuItem[] = [];

  // Define menu items based on the main section
  switch (mainSection) {
    case 'file-manager':
      menuItems = [
        { id: 'files', label: '', icon: Folder, path: '/file-manager-new' },
        { id: 'groups', label: '', icon: Users, path: '/file-manager-new/groups' },
      ];
      break;
    default:
      // Generate default placeholder icon menu items
      menuItems = [
        { id: 'one', label: '', icon: Calendar, path: '/placeholder-one' },
        { id: 'two', label: '', icon: FileText, path: '/placeholder-two' },
        { id: 'three', label: '', icon: Star, path: '/placeholder-three' },
        { id: 'four', label: '', icon: ClipboardList, path: '/placeholder-four' }
      ];
  }

  // Handle menu item click
  const handleItemClick = (path: string) => {
    navigate(path);
  };

  // Check if an item is active based on the current URL path
  const isActive = (item: SubMenuItem) => {
    const currentPath = location.pathname.toLowerCase();
    const itemPath = item.path.toLowerCase();
    
    // Exact match
    if (currentPath === itemPath) return true;
    
    // For the 'files' item, it should be active when exactly on file-manager-new path
    if (item.id === 'files' && currentPath === '/file-manager-new') return true;
    
    // For the 'groups' item, it should be active when on file-manager-new/groups path
    if (item.id === 'groups' && currentPath === '/file-manager-new/groups') return true;
    
    return false;
  };

  const liStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    padding: '8px',
    margin: '4px'
  };

  const iconStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0
  };

  return (
    <div className="sub-menu">
      <ul className="centered-icons">
        {menuItems.map((item) => (
          <li 
            key={item.id} 
            className={isActive(item) ? 'active' : ''}
            onClick={() => handleItemClick(item.path)}
            style={liStyle}
          >
            {item.icon && <span className="menu-icon" style={iconStyle}><item.icon size={20} /></span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubMenu;
