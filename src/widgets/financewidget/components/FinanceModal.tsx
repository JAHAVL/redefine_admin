import React, { ReactNode } from 'react';
import { useFinanceTheme } from '../theme/FinanceThemeProvider';
import { Button } from '../FinanceWidgetStyled';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  footer?: ReactNode;
}

/**
 * Reusable modal component for finance widget
 */
const FinanceModal: React.FC<FinanceModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  primaryAction,
  secondaryAction,
  footer
}) => {
  const theme = useFinanceTheme();
  
  if (!isOpen) return null;
  
  // Determine modal width based on size
  const getModalWidth = () => {
    switch (size) {
      case 'small': return '320px';
      case 'large': return '580px';
      case 'medium':
      default: return '450px';
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        paddingTop: '60px',
        paddingBottom: '20px',
        overflow: 'auto'
      }}
      onClick={(e) => {
        // Only close if clicking the backdrop directly
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: theme.colors.background.card,
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          width: '95%',
          maxWidth: getModalWidth(),
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          minWidth: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          borderBottom: `1px solid ${theme.colors.border.light}`
        }}>
          <h2 style={{ 
            fontSize: theme.typography.fontSize.large,
            margin: 0
          }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: theme.colors.text.secondary,
              padding: '5px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="modal-content-body" style={{
          padding: theme.spacing.lg,
          overflow: 'auto',
          flexGrow: 1,
          maxHeight: 'calc(80vh - 120px)', // Limit height and enable scrolling for lengthy content
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem' // Add spacing between child elements
        }}>
          {children}
        </div>
        
        {/* Modal Footer */}
        {(primaryAction || secondaryAction || footer) && (
          <div style={{
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            borderTop: `1px solid ${theme.colors.border.light}`,
            display: 'flex',
            justifyContent: footer ? 'space-between' : 'flex-end',
            alignItems: 'center'
          }}>
            {footer && (
              <div>
                {footer}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              {secondaryAction && (
                <Button 
                  style={{ 
                    backgroundColor: theme.colors.background.highlight,
                    color: theme.colors.text.primary
                  }}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button 
                  style={{ 
                    backgroundColor: primaryAction.disabled 
                      ? '#e0e0e0' /* Fallback disabled background color */ 
                      : theme.colors.accent,
                    color: primaryAction.disabled 
                      ? '#999999' /* Fallback disabled text color */ 
                      : theme.colors.text.light,
                    cursor: primaryAction.disabled ? 'not-allowed' : 'pointer'
                  }}
                  onClick={primaryAction.disabled ? undefined : primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceModal;
