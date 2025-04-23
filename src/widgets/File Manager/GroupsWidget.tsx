import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import theme from './theme';
import AddGroupMembersModal from './components/AddGroupMembersModalV2';

// Define types locally to avoid API dependency
interface User {
  id: string;
  name: string;
}

interface ShareGroup {
  id: string;
  name: string;
  description?: string;
  member_count?: number;
  members?: User[];
  owner?: User;
}

// Styled components for the Groups Widget
const GroupsWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.background.transparent};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  color: ${theme.colors.text.primary};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: ${theme.typography.fontFamily};
  box-shadow: ${theme.shadows.md};
  backdrop-filter: blur(5px);
`;

const GroupsHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.background.header};
  border-bottom: 1px solid ${theme.colors.border.main};
  gap: ${theme.spacing.md};
`;

const GroupsTitle = styled.h1`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const GroupsSearch = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.main};
  background-color: ${theme.colors.background.dark};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.md};
  transition: all ${theme.transitions.fast};
  padding-left: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: ${theme.shadows.glow};
    background-color: ${theme.colors.background.light};
  }

  &::placeholder {
    color: ${theme.colors.text.hint};
  }
`;

const GroupsActionsTop = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-left: auto;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.background.light};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
  
  &:hover {
    background-color: ${theme.colors.primary.transparent};
    border-color: ${theme.colors.primary.main};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const CreateButton = styled(ActionButton)`
  background-color: ${theme.colors.primary.main};
  border-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
    border-color: ${theme.colors.primary.dark};
  }
`;

const GroupsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.main};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary.main};
  }
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm};
`;

const GroupCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
    background-color: ${theme.colors.background.light};
  }
`;

const GroupCardHeader = styled.div`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background.header};
  border-bottom: 1px solid ${theme.colors.border.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GroupCardTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const GroupCardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const GroupActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.background.light};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  svg {
    color: ${theme.colors.text.secondary};
  }
  
  &:hover {
    background-color: ${theme.colors.primary.transparent};
    border-color: ${theme.colors.primary.main};
    
    svg {
      color: ${theme.colors.primary.main};
    }
  }
`;

const GroupCardContent = styled.div`
  padding: ${theme.spacing.md};
  flex: 1;
`;

const GroupCardDescription = styled.p`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const GroupCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.background.dark};
  border-top: 1px solid ${theme.colors.border.main};
`;

const GroupMemberCount = styled.div`
  display: flex;
  align-items: center;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const GroupOwnerInfo = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.secondary};
  
  svg {
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.text.disabled};
  }
`;

const EmptyStateText = styled.p`
  font-size: ${theme.typography.fontSize.md};
  margin-bottom: ${theme.spacing.md};
`;

const CreateGroupModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  width: 100%;
  max-width: 500px;
  box-shadow: ${theme.shadows.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.lg};
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.main};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.dark};
  color: ${theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.transparent};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.main};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background.dark};
  color: ${theme.colors.text.primary};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.transparent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: transparent;
  border: 1px solid ${theme.colors.border.main};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.background.light};
  }
`;

const SubmitButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary.main};
  border: 1px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.primary.contrastText};
  cursor: pointer;
  font-weight: ${theme.typography.fontWeight.medium};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${theme.colors.background.dark};
    border-color: ${theme.colors.border.main};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const GroupsWidget: React.FC = () => {
  // Initialize with data from localStorage or default mock data
  const [groups, setGroups] = useState<{
    owned_groups: ShareGroup[];
    member_groups: ShareGroup[];
  }>(() => {
    // Try to get groups from localStorage first
    const savedGroups = localStorage.getItem('shareGroups');
    if (savedGroups) {
      try {
        return JSON.parse(savedGroups);
      } catch (e) {
        console.error('Error parsing saved groups:', e);
      }
    }
    
    // Default mock data if nothing in localStorage
    return {
      owned_groups: [
        {
          id: 'group-1',
          name: 'Marketing Team',
          description: 'Group for marketing team documents',
          member_count: 5,
          owner: { id: 'user-1', name: 'You' }
        },
        {
          id: 'group-2',
          name: 'Design Team',
          description: 'Group for design team documents',
          member_count: 3,
          owner: { id: 'user-1', name: 'You' }
        }
      ],
      member_groups: [
        {
          id: 'group-3',
          name: 'Development Team',
          description: 'Group for development team documents',
          member_count: 8,
          owner: { id: 'user-2', name: 'John Doe' }
        }
      ]
    };
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');

  // Filter groups based on search term
  const filteredGroups = useCallback(() => {
    // Ensure groups exist before trying to spread them
    const ownedGroups = groups.owned_groups || [];
    const memberGroups = groups.member_groups || [];
    const allGroups = [...ownedGroups, ...memberGroups];
    
    console.log('Filtering groups:', { ownedGroups, memberGroups, allGroups });
    
    if (!searchTerm) return allGroups;
    
    return allGroups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [groups, searchTerm]);

  // Handle creating a new group
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    console.log('Creating group with name:', groupName, 'and description:', groupDescription);
    
    // Create a new group object
    const newGroup: ShareGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      description: groupDescription || '',
      member_count: 0,
      owner: { id: 'current-user', name: 'You' }
    };
    
    // Update the groups state with the new group
    const updatedGroups = {
      ...groups,
      owned_groups: [...groups.owned_groups, newGroup]
    };
    
    // Save to state
    setGroups(updatedGroups);
    
    // Save to localStorage
    localStorage.setItem('shareGroups', JSON.stringify(updatedGroups));
    
    // Reset form and close modal
    setGroupName('');
    setGroupDescription('');
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  // Render user icon and name
  const renderUserInfo = (user?: User) => {
    if (!user) return 'Unknown';
    
    const initials = user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
      
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: theme.colors.primary.main,
          color: theme.colors.primary.contrastText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          marginRight: '8px'
        }}>
          {initials}
        </div>
        <span>{user.name}</span>
      </div>
    );
  };

  return (
    <GroupsWidgetContainer>
      <GroupsHeader>
        <GroupsTitle>Share Groups</GroupsTitle>
        
        <GroupsSearch>
          <SearchInput
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </GroupsSearch>
        
        <GroupsActionsTop>
          <CreateButton onClick={() => setIsModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Group
          </CreateButton>
        </GroupsActionsTop>
      </GroupsHeader>
      
      <GroupsContent>
        {loading ? (
          <EmptyState>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="6" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
            <EmptyStateText>Loading groups...</EmptyStateText>
          </EmptyState>
        ) : error ? (
          <EmptyState>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
            <EmptyStateText>{error}</EmptyStateText>
          </EmptyState>
        ) : filteredGroups().length === 0 ? (
          <EmptyState>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <EmptyStateText>No groups found</EmptyStateText>
            <CreateButton onClick={() => setIsModalOpen(true)}>
              Create a Group
            </CreateButton>
          </EmptyState>
        ) : (
          <GroupsGrid>
            {/* Log filtered groups for debugging */}
            {filteredGroups().map(group => {
              console.log('Rendering group card for:', group);
              return (
                <GroupCard key={group.id}>
                  <GroupCardHeader>
                    <GroupCardTitle>{group.name}</GroupCardTitle>
                    <GroupCardActions>
                      <GroupActionButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupId(group.id);
                          setSelectedGroupName(group.name);
                          setIsAddMembersModalOpen(true);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Add Members
                      </GroupActionButton>
                    </GroupCardActions>
                  </GroupCardHeader>
                  <GroupCardContent>
                    <GroupCardDescription>
                      {group.description || 'No description provided.'}
                    </GroupCardDescription>
                  </GroupCardContent>
                  <GroupCardFooter>
                    <GroupMemberCount>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {group.member_count || 0} members
                    </GroupMemberCount>
                    <GroupOwnerInfo>
                      {group.owner ? `Owner: ${group.owner.name}` : ''}
                    </GroupOwnerInfo>
                  </GroupCardFooter>
                </GroupCard>
              );
            })}
          </GroupsGrid>
        )}
      </GroupsContent>
      
      {/* Create Group Modal */}
      <CreateGroupModal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create New Group</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          
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
          
          <ButtonGroup>
            <CancelButton onClick={() => setIsModalOpen(false)}>Cancel</CancelButton>
            <SubmitButton 
              type="button"
              onClick={() => {
                console.log('Create button clicked with name:', groupName);
                handleCreateGroup();
              }}
              disabled={isSubmitting || !groupName.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </SubmitButton>
          </ButtonGroup>
        </ModalContent>
      </CreateGroupModal>
      
      {/* Add Members Modal */}
      {isAddMembersModalOpen && (
        <AddGroupMembersModal
          isOpen={isAddMembersModalOpen}
          onClose={() => setIsAddMembersModalOpen(false)}
          groupId={selectedGroupId}
          groupName={selectedGroupName}
          onMembersAdded={(members) => {
            // Update the group's member count in the UI
            setGroups(prevGroups => {
              // Create a new object with the same structure
              const newGroups = {
                owned_groups: [...prevGroups.owned_groups],
                member_groups: [...prevGroups.member_groups]
              };
              
              // Update the member count in the appropriate group array
              const updateGroupInArray = (groupArray: ShareGroup[]): ShareGroup[] => {
                return groupArray.map((group: ShareGroup) =>
                  group.id === selectedGroupId
                    ? {
                        ...group,
                        member_count: (group.member_count || 0) + members.length
                      }
                    : group
                );
              };
              
              // Update both arrays
              newGroups.owned_groups = updateGroupInArray(newGroups.owned_groups);
              newGroups.member_groups = updateGroupInArray(newGroups.member_groups);
              
              return newGroups;
            });
          }}
        />
      )}
    </GroupsWidgetContainer>
  );
};

export default GroupsWidget;
