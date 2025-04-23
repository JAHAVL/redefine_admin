import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import { ShareGroup, User } from '../api';
import theme from '../theme';

const ShareGroupManagerContainer = styled.div`
  background-color: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.md};
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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

const GroupList = styled.div`
  margin-top: ${theme.spacing.md};
`;

const GroupItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.light};
  margin-bottom: ${theme.spacing.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.background.hover};
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

const ActionButtons = styled.div`
  display: flex;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.primary.main};
    background-color: ${theme.colors.background.hover};
  }
  
  &:not(:last-child) {
    margin-right: ${theme.spacing.xs};
  }
`;

const FormContainer = styled.div`
  margin-top: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.light};
  color: ${theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.light};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.light};
  color: ${theme.colors.text.primary};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.light};
  }
`;

const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${theme.colors.background.dark};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: ${theme.colors.background.light};
  color: ${theme.colors.text.primary};
  margin-right: ${theme.spacing.sm};
  
  &:hover {
    background-color: ${theme.colors.background.hover};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
`;

const MembersList = styled.div`
  margin-top: ${theme.spacing.md};
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm};
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MemberName = styled.div`
  color: ${theme.colors.text.primary};
`;

const MemberEmail = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9em;
`;

const RemoveMemberButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.status.error};
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
  }
`;

const SearchInput = styled(Input)`
  margin-bottom: ${theme.spacing.md};
`;

interface ShareGroupManagerProps {
  onClose?: () => void;
  onGroupCreated?: (group: ShareGroup) => void;
  onGroupUpdated?: (group: ShareGroup) => void;
  onGroupDeleted?: (groupId: string) => void;
}

enum TabType {
  MY_GROUPS = 'my_groups',
  MEMBER_GROUPS = 'member_groups',
  CREATE_GROUP = 'create_group',
  EDIT_GROUP = 'edit_group',
  VIEW_GROUP = 'view_group'
}

const ShareGroupManager: React.FC<ShareGroupManagerProps> = ({
  onClose,
  onGroupCreated,
  onGroupUpdated,
  onGroupDeleted
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.MY_GROUPS);
  const [ownedGroups, setOwnedGroups] = useState<ShareGroup[]>([]);
  const [memberGroups, setMemberGroups] = useState<ShareGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ShareGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchShareGroups();
  }, []);
  
  const fetchShareGroups = async () => {
    try {
      setLoading(true);
      // Cast api to any to bypass TypeScript error until types are properly updated
      const { owned_groups, member_groups } = await (api as any).getShareGroups();
      setOwnedGroups(owned_groups);
      setMemberGroups(member_groups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching share groups:', error);
      setError('Failed to load share groups. Please try again.');
      setLoading(false);
    }
  };
  
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    
    try {
      setLoading(true);
      // Cast api to any to bypass TypeScript error until types are properly updated
      const newGroup = await (api as any).createShareGroup(groupName, groupDescription);
      setOwnedGroups([...ownedGroups, newGroup]);
      setGroupName('');
      setGroupDescription('');
      setActiveTab(TabType.MY_GROUPS);
      
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error creating share group:', error);
      setError('Failed to create share group. Please try again.');
      setLoading(false);
    }
  };
  
  const handleUpdateGroup = async () => {
    if (!selectedGroup) return;
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    
    try {
      setLoading(true);
      // Cast api to any to bypass TypeScript error until types are properly updated
      const updatedGroup = await (api as any).updateShareGroup(
        selectedGroup.id,
        groupName,
        groupDescription
      );
      
      setOwnedGroups(ownedGroups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      ));
      
      setActiveTab(TabType.MY_GROUPS);
      
      if (onGroupUpdated) {
        onGroupUpdated(updatedGroup);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating share group:', error);
      setError('Failed to update share group. Please try again.');
      setLoading(false);
    }
  };
  
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      // Cast api to any to bypass TypeScript error until types are properly updated
      await (api as any).deleteShareGroup(groupId);
      setOwnedGroups(ownedGroups.filter(group => group.id !== groupId));
      
      if (onGroupDeleted) {
        onGroupDeleted(groupId);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error deleting share group:', error);
      setError('Failed to delete share group. Please try again.');
      setLoading(false);
    }
  };
  
  const handleViewGroup = async (group: ShareGroup) => {
    try {
      setLoading(true);
      // Cast api to any to bypass TypeScript error until types are properly updated
      const groupDetails = await (api as any).getShareGroup(group.id);
      setSelectedGroup(groupDetails);
      setActiveTab(TabType.VIEW_GROUP);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching share group details:', error);
      setError('Failed to load group details. Please try again.');
      setLoading(false);
    }
  };
  
  const handleEditGroup = (group: ShareGroup) => {
    setSelectedGroup(group);
    setGroupName(group.name);
    setGroupDescription(group.description || '');
    setActiveTab(TabType.EDIT_GROUP);
  };
  
  const handleRemoveMember = async (groupId: string, memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member from the group?')) {
      return;
    }
    
    try {
      setLoading(true);
      // Cast api to any to bypass TypeScript error until types are properly updated
      await (api as any).removeGroupMembers(groupId, [memberId]);
      
      // Update the selected group if we're viewing it
      if (selectedGroup && selectedGroup.id === groupId) {
        // Cast api to any to bypass TypeScript error until types are properly updated
        const updatedGroup = await (api as any).getShareGroup(groupId);
        setSelectedGroup(updatedGroup);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error removing member from group:', error);
      setError('Failed to remove member. Please try again.');
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
  
  const renderGroupList = (groups: ShareGroup[], isOwned: boolean) => {
    if (groups.length === 0) {
      return (
        <EmptyState>
          {isOwned 
            ? "You haven't created any share groups yet." 
            : "You aren't a member of any share groups yet."}
        </EmptyState>
      );
    }
    
    return (
      <GroupList>
        {groups.map(group => (
          <GroupItem key={group.id}>
            <div>
              <GroupName>{group.name}</GroupName>
              {group.description && <GroupDescription>{group.description}</GroupDescription>}
              <GroupMemberCount>
                {group.member_count || 0} member{(group.member_count || 0) !== 1 ? 's' : ''}
              </GroupMemberCount>
            </div>
            <ActionButtons>
              <ActionButton onClick={() => handleViewGroup(group)}>View</ActionButton>
              {isOwned && (
                <>
                  <ActionButton onClick={() => handleEditGroup(group)}>Edit</ActionButton>
                  <ActionButton onClick={() => handleDeleteGroup(group.id)}>Delete</ActionButton>
                </>
              )}
            </ActionButtons>
          </GroupItem>
        ))}
      </GroupList>
    );
  };
  
  return (
    <ShareGroupManagerContainer>
      <TabContainer>
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
        <Tab 
          active={activeTab === TabType.CREATE_GROUP} 
          onClick={() => {
            setGroupName('');
            setGroupDescription('');
            setActiveTab(TabType.CREATE_GROUP);
          }}
        >
          Create Group
        </Tab>
      </TabContainer>
      
      {(activeTab === TabType.MY_GROUPS || activeTab === TabType.MEMBER_GROUPS) && (
        <SearchInput 
          type="text" 
          placeholder="Search groups..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      
      {activeTab === TabType.MY_GROUPS && renderGroupList(filteredOwnedGroups, true)}
      {activeTab === TabType.MEMBER_GROUPS && renderGroupList(filteredMemberGroups, false)}
      
      {activeTab === TabType.CREATE_GROUP && (
        <FormContainer>
          <FormGroup>
            <Label htmlFor="groupName">Group Name</Label>
            <Input 
              id="groupName"
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="groupDescription">Description (Optional)</Label>
            <TextArea 
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description"
            />
          </FormGroup>
          {error && <div style={{ color: theme.colors.status.error, marginBottom: theme.spacing.sm }}>{error}</div>}
          <ButtonGroup>
            <CancelButton onClick={() => setActiveTab(TabType.MY_GROUPS)}>Cancel</CancelButton>
            <Button onClick={handleCreateGroup} disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </ButtonGroup>
        </FormContainer>
      )}
      
      {activeTab === TabType.EDIT_GROUP && selectedGroup && (
        <FormContainer>
          <FormGroup>
            <Label htmlFor="editGroupName">Group Name</Label>
            <Input 
              id="editGroupName"
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="editGroupDescription">Description (Optional)</Label>
            <TextArea 
              id="editGroupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description"
            />
          </FormGroup>
          {error && <div style={{ color: theme.colors.status.error, marginBottom: theme.spacing.sm }}>{error}</div>}
          <ButtonGroup>
            <CancelButton onClick={() => setActiveTab(TabType.MY_GROUPS)}>Cancel</CancelButton>
            <Button onClick={handleUpdateGroup} disabled={loading}>
              {loading ? 'Updating...' : 'Update Group'}
            </Button>
          </ButtonGroup>
        </FormContainer>
      )}
      
      {activeTab === TabType.VIEW_GROUP && selectedGroup && (
        <div>
          <h2>{selectedGroup.name}</h2>
          {selectedGroup.description && <p>{selectedGroup.description}</p>}
          
          <h3>Members</h3>
          {selectedGroup.members && selectedGroup.members.length > 0 ? (
            <MembersList>
              {selectedGroup.members.map(member => (
                <MemberItem key={member.id}>
                  <div>
                    <MemberName>{member.name}</MemberName>
                    {member.email && <MemberEmail>{member.email}</MemberEmail>}
                  </div>
                  {selectedGroup.owner_id && (
                    <RemoveMemberButton 
                      onClick={() => handleRemoveMember(selectedGroup.id, member.id)}
                    >
                      Remove
                    </RemoveMemberButton>
                  )}
                </MemberItem>
              ))}
            </MembersList>
          ) : (
            <EmptyState>This group has no members.</EmptyState>
          )}
          
          <ButtonGroup>
            <Button onClick={() => setActiveTab(TabType.MY_GROUPS)}>Back to Groups</Button>
          </ButtonGroup>
        </div>
      )}
    </ShareGroupManagerContainer>
  );
};

export default ShareGroupManager;
