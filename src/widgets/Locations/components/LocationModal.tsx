import React, { ReactNode } from 'react';
import './LocationModal.css';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="location-modal-overlay" onClick={handleOverlayClick}>
      <div className="location-modal">
        <div className="location-modal-header">
          <h2 className="location-modal-title">{title}</h2>
          <button className="location-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="location-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
