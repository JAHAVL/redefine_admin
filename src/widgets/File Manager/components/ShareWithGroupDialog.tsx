import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import { ShareGroup } from '../api';
import theme from '../theme';

// Define FileItem interface if it's not exported from api
interface FileItem {
  id: string;
  name: string;
  type: string;
  size?: number;
  modified?: string;
  path?: string;
  shared?: boolean;
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

const DialogContent = styled.div`
  background-color: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.md};
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const DialogTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: ${theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.light};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.light};
  }
`;

const GroupList = styled.div`
  margin-top: ${theme.spacing.md};
  max-height: 300px;
  overflow-y: auto;
`;

const GroupItem = styled.div<{ isShared: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${props => props.isShared 
    ? theme.colors.primary.light 
    : theme.colors.background.light};
  margin-bottom: ${theme.spacing.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isShared 
      ? theme.colors.primary.light 
      : theme.colors.background.hover};
  }
`;

const GroupName = styled.div`
  font-weight: bold;
  color: ${theme.colors.text.primary};
`;

const GroupDescription = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9em;
  margin-top: ${theme.spacing.xs};
`;

const GroupMemberCount = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9em;
`;

const PermissionSelect = styled.select`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.light};
  color: ${theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
  }
`;

const ShareButton = styled.button<{ isShared: boolean }>`
  background-color: ${props => props.isShared 
    ? theme.colors.status.warning 
    : theme.colors.primary.main};
  color: ${props => props.isShared 
    ? '#ffffff' 
    : theme.colors.primary.contrastText};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isShared 
      ? theme.colors.status.warning 
      : theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${theme.colors.background.dark};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.status.error};
  margin-bottom: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: ${theme.borderRadius.sm};
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${props => props.active ? theme.colors.primary.main : 'transparent'};
  color: ${props => props.active ? theme.colors.primary.contrastText : theme.colors.text.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? theme.colors.primary.main : theme.colors.background.hover};
  }
  
  &:not(:last-child) {
    margin-right: ${theme.spacing.sm};
  }
`;

interface ShareWithGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem;
  onShareUpdated?: () => void;
}

enum TabType {
  MY_GROUPS = 'my_groups',
  MEMBER_GROUPS = 'member_groups',
  SHARED_GROUPS = 'shared_groups'
}

const ShareWithGroupDialog: React.FC<ShareWithGroupDialogProps> = ({
  isOpen,
  onClose,
  file,
  onShareUpdated
}) => {
  const [ownedGroups, setOwnedGroups] = useState<ShareGroup[]>([]);
  const [memberGroups, setMemberGroups] = useState<ShareGroup[]>([]);
  const [sharedGroups, setSharedGroups] = useState<ShareGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SHARED_GROUPS);
  
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, file.id]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all groups the user is associated with
      const { owned_groups, member_groups } = await api.getShareGroups();
      setOwnedGroups(owned_groups);
      setMemberGroups(member_groups);
      
      // Fetch groups that have access to this file
      const documentGroups = await api.getDocumentGroups(file.id);
      setSharedGroups(documentGroups);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load groups. Please try again.');
      setLoading(false);
    }
  };
  
  const handleShareWithGroup = async (group: ShareGroup, permissionLevel: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Check if the group is already shared
      const isAlreadyShared = sharedGroups.some(g => g.id === group.id);
      
      if (isAlreadyShared) {
        // Remove group access
        // Cast api to any to bypass TypeScript error until types are properly updated
        await (api as any).removeGroupDocumentAccess(file.id, group.id);
        setSharedGroups(sharedGroups.filter(g => g.id !== group.id));
      } else {
        // Share with group
        // Cast api to any to bypass TypeScript error until types are properly updated
        await (api as any).shareDocumentWithGroup(
          file.id, 
          group.id, 
          permissionLevel as 'read' | 'write' | 'admin'
        );
        
        // Add to shared groups with permission level
        const updatedGroup = { ...group, permission_level: permissionLevel as 'read' | 'write' | 'admin' };
        setSharedGroups([...sharedGroups, updatedGroup]);
      }
      
      if (onShareUpdated) {
        onShareUpdated();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating group access:', error);
      setError('Failed to update group access. Please try again.');
      setLoading(false);
    }
  };
  
  const handleUpdatePermission = async (group: ShareGroup, permissionLevel: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Cast api to any to bypass TypeScript error until types are properly updated
      await (api as any).updateGroupDocumentPermission(
        file.id,
        group.id,
        permissionLevel as 'read' | 'write' | 'admin'
      );
      
      // Update the permission level in the shared groups list
      setSharedGroups(sharedGroups.map(g => 
        g.id === group.id 
          ? { ...g, permission_level: permissionLevel as 'read' | 'write' | 'admin' } 
          : g
      ));
      
      if (onShareUpdated) {
        onShareUpdated();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating permission level:', error);
      setError('Failed to update permission level. Please try again.');
      setLoading(false);
    }
  };
  
  const filteredOwnedGroups = ownedGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredMemberGroups = memberGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredSharedGroups = sharedGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const renderGroupList = (groups: ShareGroup[], isSharedTab: boolean = false) => {
    if (groups.length === 0) {
      return (
        <EmptyState>
          {isSharedTab 
            ? "This file isn't shared with any groups yet." 
            : "No groups found."}
        </EmptyState>
      );
    }
    
    return (
      <GroupList>
        {groups.map(group => {
          const isShared = sharedGroups.some(g => g.id === group.id);
          const sharedGroup = sharedGroups.find(g => g.id === group.id);
          const permissionLevel = sharedGroup?.permission_level || 'read';
          
          return (
            <GroupItem key={group.id} isShared={isShared}>
              <div>
                <GroupName>{group.name}</GroupName>
                {group.description && <GroupDescription>{group.description}</GroupDescription>}
                <GroupMemberCount>
                  {group.member_count || 0} member{(group.member_count || 0) !== 1 ? 's' : ''}
                </GroupMemberCount>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isShared && (
                  <PermissionSelect 
                    value={permissionLevel}
                    onChange={(e) => handleUpdatePermission(group, e.target.value)}
                    style={{ marginRight: theme.spacing.sm }}
                  >
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="admin">Admin</option>
                  </PermissionSelect>
                )}
                <ShareButton 
                  isShared={isShared}
                  onClick={() => handleShareWithGroup(group, permissionLevel)}
                  disabled={loading}
                >
                  {isShared ? 'Unshare' : 'Share'}
                </ShareButton>
              </div>
            </GroupItem>
          );
        })}
      </GroupList>
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Share "{file.name}" with Groups</DialogTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </DialogHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <TabContainer>
          <Tab 
            active={activeTab === TabType.SHARED_GROUPS} 
            onClick={() => setActiveTab(TabType.SHARED_GROUPS)}
          >
            Shared With
          </Tab>
          <Tab 
            active={activeTab === TabType.MY_GROUPS} 
            onClick={() => setActiveTab(TabType.MY_GROUPS)}
          >
            My Groups
          </Tab>
          <Tab 
            active={activeTab === TabType.MEMBER_GROUPS} 
            onClick={() => setActiveTab(TabType.MEMBER_GROUPS)}
          >
            Member Of
          </Tab>
        </TabContainer>
        
        <SearchInput 
          type="text" 
          placeholder="Search groups..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {loading ? (
          <LoadingIndicator>Loading groups...</LoadingIndicator>
        ) : (
          <>
            {activeTab === TabType.SHARED_GROUPS && renderGroupList(filteredSharedGroups, true)}
            {activeTab === TabType.MY_GROUPS && renderGroupList(filteredOwnedGroups)}
            {activeTab === TabType.MEMBER_GROUPS && renderGroupList(filteredMemberGroups)}
          </>
        )}
      </DialogContent>
    </DialogOverlay>
  );
};

export default ShareWithGroupDialog;
