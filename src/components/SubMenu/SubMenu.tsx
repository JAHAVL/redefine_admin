import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
let DollarSign: IconComponent;
let CreditCard: IconComponent;
let Book: IconComponent;
let FileSpreadsheet: IconComponent;
let FileCheck: IconComponent;
let Edit: IconComponent;
let MessageSquare: IconComponent;
let CheckCircle: IconComponent;
let Share: IconComponent;
let Map: IconComponent;
let BarChart2: IconComponent;
let Settings: IconComponent;

try {
  const icons = require('lucide-react');
  Calendar = icons.Calendar;
  FileText = icons.FileText;
  ClipboardList = icons.ClipboardList || icons.ListTodo;
  Star = icons.Star;
  Clock = icons.Clock;
  Folder = icons.Folder;
  Users = icons.Users;
  DollarSign = icons.DollarSign;
  CreditCard = icons.CreditCard;
  Book = icons.Book;
  FileSpreadsheet = icons.FileSpreadsheet || icons.File;
  FileCheck = icons.FileCheck || icons.CheckSquare;
  Edit = icons.Edit || icons.Pencil;
  MessageSquare = icons.MessageSquare;
  CheckCircle = icons.CheckCircle;
  Share = icons.Share2 || icons.Share;
  Map = icons.Map;
  BarChart2 = icons.BarChart2 || icons.BarChart;
  Settings = icons.Settings;
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
  DollarSign = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
  CreditCard = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  );
  Book = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
  FileSpreadsheet = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"></rect>
      <rect x="9" y="8" width="6" height="6"></rect>
      <line x1="15" y1="8" x2="15" y2="8"></line>
    </svg>
  );
  FileCheck = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"></path>
      <polyline points="15 7 20 12 15 17"></polyline>
      <polyline points="4 4 4 12 8 12"></polyline>
    </svg>
  );
  Edit = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
  MessageSquare = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
  CheckCircle = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
  Share = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
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
    case 'finance':
      menuItems = [
        { id: 'overview', label: '', icon: DollarSign, path: '/finance-new' },
        { id: 'transactions', label: '', icon: CreditCard, path: '/finance-new/transactions' },
        { id: 'accounts', label: '', icon: Book, path: '/finance-new/accounts' },
        { id: 'reports', label: '', icon: FileSpreadsheet, path: '/finance-new/reports' },
        { id: 'statements', label: '', icon: FileText, path: '/finance-new/statements' },
        { id: 'reconciliation', label: '', icon: FileCheck, path: '/finance-new/reconciliation' },
      ];
      break;
    case 'locations':
      menuItems = [
        { id: 'overview', label: 'Overview', icon: Folder, path: '/locations' },
        { id: 'map', label: 'Map View', icon: Map, path: '/locations/map' },
        { id: 'analytics', label: 'Analytics', icon: BarChart2, path: '/locations/analytics' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/locations/settings' },
      ];
      break;
    case 'mail':
      menuItems = [
        { id: 'overview', label: '', icon: Folder, path: '/mail-new' },
        { id: 'templates', label: '', icon: FileText, path: '/mail-new/templates' },
        { id: 'settings', label: '', icon: FileCheck, path: '/mail-new/settings' },
      ];
      break;
    case 'content-creator':
      menuItems = [
        { id: 'all-posts', label: 'All Content', icon: Folder, path: '/content-creator' },
        { id: 'create', label: 'Create New', icon: Edit, path: '/content-creator/new' },
        { id: 'review', label: 'Review', icon: CheckCircle, path: '/content-creator/review-queue' },
        { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/content-creator/schedule' },
        { id: 'visual-scheduler', label: 'Visual Scheduler', icon: Calendar, path: '/content-creator/visual-scheduler' },
        { id: 'analytics', label: 'Analytics', icon: FileSpreadsheet, path: '/content-creator/analytics' },
      ];
      break;
    case 'task-manager':
      menuItems = [
        { id: 'overview', label: '', icon: Calendar, path: '/task-manager-new' },
        // Add more task manager submenu items if needed in the future
      ];
      break;
    case 'schedule':
      menuItems = [
        { id: 'overview', label: '', icon: Calendar, path: '/scheduler-new' },
        { id: 'series', label: '', icon: FileText, path: '/scheduler-new/series' },
        { id: 'teams', label: '', icon: Users, path: '/scheduler-new/teams' },
        { id: 'songs', label: '', icon: FileSpreadsheet, path: '/scheduler-new/songs' },
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
    // If we're already on the same path, don't navigate
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  // Check if an item is active based on the current URL path
  const isActive = (item: SubMenuItem) => {
    const currentPath = location.pathname.toLowerCase();
    const itemPath = item.path.toLowerCase();
    
    // Exact match
    if (currentPath === itemPath) return true;
    
    // Special case for scheduler section - when viewing event details, activate the first icon
    if (item.id === 'overview' && mainSection === 'schedule' && 
        (currentPath.includes('/scheduler-new/events/') || 
         currentPath.includes('/scheduler-new/series/'))) {
      return true;
    }
    
    // File Manager section
    if (item.id === 'files' && currentPath === '/file-manager-new') return true;
    if (item.id === 'groups' && currentPath === '/file-manager-new/groups') return true;
    
    // Finance section
    if (item.id === 'overview' && (currentPath === '/finance-new' || currentPath === '/finance-new/dashboard')) return true;
    if (item.id === 'transactions' && currentPath === '/finance-new/transactions') return true;
    if (item.id === 'accounts' && currentPath === '/finance-new/accounts') return true;
    if (item.id === 'reports' && currentPath === '/finance-new/reports') return true;
    if (item.id === 'statements' && currentPath === '/finance-new/statements') return true;
    if (item.id === 'reconciliation' && currentPath === '/finance-new/reconciliation') return true;
    
    // Locations section
    if (item.id === 'overview' && (currentPath === '/locations' || currentPath === '/locations/')) return true;
    if (item.id === 'map' && currentPath === '/locations/map') return true;
    if (item.id === 'analytics' && currentPath === '/locations/analytics') return true;
    if (item.id === 'settings' && currentPath === '/locations/settings') return true;
    
    // Mail section
    if (item.id === 'overview' && currentPath === '/mail-new') return true;
    if (item.id === 'templates' && currentPath === '/mail-new/templates') return true;
    if (item.id === 'settings' && currentPath === '/mail-new/settings') return true;
    
    // Task Manager section
    if (item.id === 'overview' && currentPath === '/task-manager-new') return true;
    
    // Scheduler section
    if (item.id === 'overview' && currentPath === '/scheduler-new') return true;
    if (item.id === 'series' && currentPath.startsWith('/scheduler-new/series')) return true;
    if (item.id === 'teams' && currentPath === '/scheduler-new/teams') return true;
    if (item.id === 'songs' && currentPath === '/scheduler-new/songs') return true;
    
    return false;
  };

  const liStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    backgroundColor: active ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: active ? 'rgba(25, 118, 210, 0.15)' : 'rgba(0, 0, 0, 0.04)'
    },
    color: active ? '#1976d2' : 'var(--text-muted)',
    position: 'relative',
    flexShrink: 0
  } as React.CSSProperties);

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '24px',
    height: '24px',
    color: 'inherit'
  };

  return (
    <div className="sub-menu">
      <div className="submenu-container">
        <ul className="submenu-list">
          {menuItems.map((item) => {
            const isItemActive = isActive(item);
            const Icon = item.icon || FileText; // Fallback to FileText icon if none provided
            return (
              <li 
                key={item.id} 
                className={`submenu-item ${isItemActive ? 'active' : ''}`}
                onClick={() => handleItemClick(item.path)}
                style={liStyle(isItemActive)}
                title={item.label}
              >
                <div className="menu-icon" style={iconStyle}>
                  {React.createElement(Icon, {
                    size: 20,
                    color: isItemActive ? '#1976d2' : 'currentColor',
                    style: { display: 'block' }
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SubMenu;
