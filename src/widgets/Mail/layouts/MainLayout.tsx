import React from 'react';
import styled from 'styled-components';
import MailTheme from '../theme';

interface MainLayoutProps {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
}

// Container for the entire mail widget
const MailContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0; /* Critical for proper flex behavior */
  background-color: transparent;
  color: ${MailTheme.colors.text.primary};
  font-family: ${MailTheme.typography.fontFamily};
  backdrop-filter: blur(8px);
  flex: 1 1 auto; /* Grow and shrink as needed */
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${MailTheme.colors.background.transparent};
    pointer-events: none;
    z-index: -1;
  }
`;

// Container for the main content area
const ContentArea = styled.div`
  display: flex;
  flex: 1;
  min-width: 0; /* Prevent content from overflowing */
  min-height: 0; /* Prevent content from overflowing */
  overflow: hidden;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  background-color: transparent;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${MailTheme.colors.background.card};
    pointer-events: none;
    z-index: -1;
    backdrop-filter: blur(5px);
  }
`;

/**
 * MainLayout component for the Mail widget
 * Handles the basic structure and layout of the widget
 * Separates structure concerns from content
 */
const MainLayout: React.FC<MainLayoutProps> = ({ sidebarContent, mainContent }) => {
  return (
    <MailContainer>
      {sidebarContent}
      <ContentArea>
        {mainContent}
      </ContentArea>
    </MailContainer>
  );
};

export default MainLayout;
