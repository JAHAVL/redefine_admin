import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface MainLayoutProps {
  toolbarContent: ReactNode;
  mainContent: ReactNode;
  sidebarContent?: ReactNode;
  statusBarContent?: ReactNode;
}

// Container for the entire PostCreator widget
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

// Toolbar area
const ToolbarArea = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

// Main content wrapper
const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Main content area
const MainContentArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
`;

// Sidebar area
const SidebarArea = styled.div`
  width: 320px;
  border-left: 1px solid #e0e0e0;
  overflow: auto;
  padding: 16px;
  background-color: #fafafa;
`;

// Status bar area
const StatusBarArea = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
  font-size: 0.875rem;
  color: #616161;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

/**
 * Main layout component for the PostCreator widget
 * 
 * Handles the basic structure and layout of the widget:
 * - Toolbar at the top for actions and controls
 * - Main content area for editing/viewing posts
 * - Optional sidebar for additional tools and information
 * - Status bar at the bottom for contextual information
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  toolbarContent,
  mainContent,
  sidebarContent,
  statusBarContent
}) => {
  return (
    <Container>
      <ToolbarArea>{toolbarContent}</ToolbarArea>
      
      <ContentWrapper>
        <MainContentArea>{mainContent}</MainContentArea>
        {sidebarContent && <SidebarArea>{sidebarContent}</SidebarArea>}
      </ContentWrapper>
      
      {statusBarContent && <StatusBarArea>{statusBarContent}</StatusBarArea>}
    </Container>
  );
};

export default MainLayout;
