import React from 'react';
import { useFinanceTheme } from '../theme/FinanceThemeProvider';

// Define interface for icon props
interface IconProps {
  size?: number;
  color?: string;
  [key: string]: any;
}

// Define type for icon components
type IconComponent = React.FC<IconProps>;

// Initialize icon components
let Edit: IconComponent;
let Trash: IconComponent;
let Eye: IconComponent;
let Download: IconComponent;
let Copy: IconComponent;
let MoreHorizontal: IconComponent;

try {
  const icons = require('lucide-react');
  Edit = icons.Edit;
  Trash = icons.Trash;
  Eye = icons.Eye;
  Download = icons.Download;
  Copy = icons.Copy;
  MoreHorizontal = icons.MoreHorizontal;
} catch (e) {
  // Fallback SVG components if lucide-react is not available
  Edit = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
  
  Trash = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
  
  Eye = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  
  Download = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  
  Copy = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
  
  MoreHorizontal = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export interface ActionIconsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  showMore?: boolean;
  onMore?: () => void;
  size?: number;
}

/**
 * ActionIcons component for consistent action buttons across the application
 */
const ActionIcons: React.FC<ActionIconsProps> = ({
  onView,
  onEdit,
  onDelete,
  onDownload,
  onCopy,
  showMore = false,
  onMore,
  size = 18
}) => {
  const theme = useFinanceTheme();
  
  const iconButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    padding: 0,
    margin: '0 2px'
  };
  
  const hoverEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = theme.colors.background.highlight;
  };
  
  const leaveEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {onView && (
        <button 
          style={iconButtonStyle} 
          onClick={onView}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
          title="View"
        >
          <Eye size={size} color={theme.colors.text.primary} />
        </button>
      )}
      
      {onEdit && (
        <button 
          style={iconButtonStyle} 
          onClick={onEdit}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
          title="Edit"
        >
          <Edit size={size} color={theme.colors.text.primary} />
        </button>
      )}
      
      {onDelete && (
        <button 
          style={iconButtonStyle} 
          onClick={onDelete}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
          title="Delete"
        >
          <Trash size={size} color={theme.colors.state.error} />
        </button>
      )}
      
      {onDownload && (
        <button 
          style={iconButtonStyle} 
          onClick={onDownload}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
          title="Download"
        >
          <Download size={size} color={theme.colors.text.primary} />
        </button>
      )}
      
      {onCopy && (
        <button 
          style={iconButtonStyle} 
          onClick={onCopy}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
          title="Copy"
        >
          <Copy size={size} color={theme.colors.text.primary} />
        </button>
      )}
      
      {showMore && onMore && (
        <button 
          style={iconButtonStyle} 
          onClick={onMore}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
          title="More Options"
        >
          <MoreHorizontal size={size} color={theme.colors.text.primary} />
        </button>
      )}
    </div>
  );
};

export default ActionIcons;
