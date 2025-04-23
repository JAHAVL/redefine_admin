import React from 'react';
import styled from 'styled-components';
import MailTheme from '../theme';

// Types
interface SidebarProps {
  currentFolder: string;
  setCurrentFolder: (folder: string) => void;
  onCompose: () => void;
  unreadCount: number;
}

interface FolderItemProps {
  active: boolean;
}

// Styled Components
const SidebarContainer = styled.div`
  width: 240px;
  background-color: transparent;
  backdrop-filter: blur(5px);
  border-right: none;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: ${MailTheme.spacing.md};
  height: 100%;
  flex-shrink: 0;
`;

const ComposeButton = styled.button`
  background-color: ${MailTheme.colors.primary.main};
  color: ${MailTheme.colors.primary.contrastText};
  border: none;
  border-radius: ${MailTheme.borderRadius.md};
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.md};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${MailTheme.spacing.lg};
  transition: background-color ${MailTheme.transitions.fast} ease;

  &:hover {
    background-color: ${MailTheme.colors.primary.dark};
  }
`;

const FolderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FolderItem = styled.li<FolderItemProps>`
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.md};
  margin-bottom: ${MailTheme.spacing.xs};
  border-radius: ${MailTheme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.active ? MailTheme.colors.interactive.selected : 'transparent'};
  color: ${props => props.active ? MailTheme.colors.primary.main : MailTheme.colors.text.primary};
  font-weight: ${props => props.active ? MailTheme.typography.fontWeight.medium : MailTheme.typography.fontWeight.regular};
  transition: background-color ${MailTheme.transitions.fast} ease;

  &:hover {
    background-color: ${props => props.active ? MailTheme.colors.interactive.selected : MailTheme.colors.interactive.hover};
  }
`;

const FolderName = styled.span`
  flex-grow: 1;
`;

const Badge = styled.span`
  background-color: ${MailTheme.colors.primary.main};
  color: ${MailTheme.colors.primary.contrastText};
  border-radius: ${MailTheme.borderRadius.circle};
  padding: 2px 8px;
  font-size: ${MailTheme.typography.fontSize.xs};
  font-weight: ${MailTheme.typography.fontWeight.bold};
`;

const SidebarSection = styled.div`
  margin-bottom: ${MailTheme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.secondary};
  margin-bottom: ${MailTheme.spacing.sm};
  padding: 0 ${MailTheme.spacing.md};
`;

// Component
const Sidebar: React.FC<SidebarProps> = ({ 
  currentFolder, 
  setCurrentFolder, 
  onCompose, 
  unreadCount 
}) => {
  const folders = [
    { id: 'inbox', name: 'Inbox', count: unreadCount },
    { id: 'starred', name: 'Starred', count: 0 },
    { id: 'sent', name: 'Sent', count: 0 },
    { id: 'drafts', name: 'Drafts', count: 0 },
    { id: 'trash', name: 'Trash', count: 0 },
  ];

  return (
    <SidebarContainer>
      <ComposeButton onClick={onCompose}>
        Compose
      </ComposeButton>

      <SidebarSection>
        <FolderList>
          {folders.map(folder => (
            <FolderItem 
              key={folder.id}
              active={currentFolder === folder.id}
              onClick={() => setCurrentFolder(folder.id)}
            >
              <FolderName>{folder.name}</FolderName>
              {folder.count > 0 && <Badge>{folder.count}</Badge>}
            </FolderItem>
          ))}
        </FolderList>
      </SidebarSection>

      <SidebarSection>
        <SectionTitle>Labels</SectionTitle>
        <FolderList>
          <FolderItem active={false} onClick={() => {}}>
            <FolderName>Important</FolderName>
          </FolderItem>
          <FolderItem active={false} onClick={() => {}}>
            <FolderName>Personal</FolderName>
          </FolderItem>
          <FolderItem active={false} onClick={() => {}}>
            <FolderName>Work</FolderName>
          </FolderItem>
        </FolderList>
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
