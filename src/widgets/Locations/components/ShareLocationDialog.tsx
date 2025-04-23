import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Location, ShareGroup } from '../types';
import { shareLocationWithUsers, shareLocationWithGroups } from '../actions';

// Types
interface ShareLocationDialogProps {
  location: Location;
  onClose: () => void;
  onLocationUpdated: (location: Location) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
}

// Mock users for demo - in a real app, these would come from an API
const mockUsers: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', department: 'Marketing' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', department: 'Sales' },
  { id: 'user-3', name: 'Alice Johnson', email: 'alice@example.com', department: 'Design' },
  { id: 'user-4', name: 'Bob Wilson', email: 'bob@example.com', department: 'Development' },
  { id: 'user-5', name: 'Carol Taylor', email: 'carol@example.com', department: 'HR' },
];

// Mock groups for demo - in a real app, these would come from an API
const mockGroups: ShareGroup[] = [
  { id: 'group-1', name: 'Marketing Team', type: 'department' },
  { id: 'group-2', name: 'Sales Team', type: 'department' },
  { id: 'group-3', name: 'Administrators', type: 'role' },
  { id: 'group-4', name: 'Content Creators', type: 'custom' },
  { id: 'group-5', name: 'Event Planners', type: 'custom' },
];

// Styled components
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
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const DialogContent = styled.div`
  background-color: rgba(30, 30, 45, 0.9);
  border-radius: 12px;
  padding: 24px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
`;

const DialogTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.active ? 'rgba(52, 120, 255, 0.8)' : 'transparent'};
    transition: all 0.2s;
  }
  
  &:hover {
    color: #fff;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  background-color: rgba(20, 20, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: rgba(52, 120, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(52, 120, 255, 0.2);
  }
`;

const ListContainer = styled.div`
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(20, 20, 30, 0.5);
`;

const ListItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.isSelected ? 'rgba(52, 120, 255, 0.2)' : 'transparent'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(52, 120, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(52, 120, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDetail = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const Checkbox = styled.input`
  margin-left: 12px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ShareButton = styled(Button)`
  background-color: rgba(52, 120, 255, 0.8);
  border: 1px solid rgba(52, 120, 255, 0.8);
  color: #fff;
  
  &:hover {
    background-color: rgba(52, 120, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 120, 255, 0.3);
  }
  
  &:disabled {
    background-color: rgba(52, 120, 255, 0.4);
    border-color: rgba(52, 120, 255, 0.4);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const PermissionSelect = styled.select`
  background-color: rgba(20, 20, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  padding: 8px 12px;
  margin-bottom: 16px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: rgba(52, 120, 255, 0.5);
  }
`;

// Main component
const ShareLocationDialog: React.FC<ShareLocationDialogProps> = ({ location, onClose, onLocationUpdated }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(location.shared_with || []);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    location.shared_groups?.map(group => group.id) || []
  );
  const [permissionLevel, setPermissionLevel] = useState<'read' | 'write' | 'admin'>('read');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter groups based on search query
  const filteredGroups = mockGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  // Toggle group selection
  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  // Handle share button click
  const handleShare = async () => {
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'users' && selectedUserIds.length > 0) {
        const updatedLocation = await shareLocationWithUsers(location.id, selectedUserIds);
        if (updatedLocation) {
          onLocationUpdated(updatedLocation);
        }
      } else if (activeTab === 'groups' && selectedGroupIds.length > 0) {
        const updatedLocation = await shareLocationWithGroups(
          location.id, 
          selectedGroupIds, 
          permissionLevel
        );
        if (updatedLocation) {
          onLocationUpdated(updatedLocation);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error sharing location:', error);
      // In a real app, show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Share Location: {location.name}</DialogTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </DialogHeader>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Share with Users
          </Tab>
          <Tab 
            active={activeTab === 'groups'} 
            onClick={() => setActiveTab('groups')}
          >
            Share with Groups
          </Tab>
        </TabContainer>
        
        <SearchInput 
          type="text" 
          placeholder={`Search ${activeTab === 'users' ? 'users' : 'groups'}...`} 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        
        {activeTab === 'groups' && (
          <PermissionSelect 
            value={permissionLevel}
            onChange={e => setPermissionLevel(e.target.value as 'read' | 'write' | 'admin')}
          >
            <option value="read">Read Access</option>
            <option value="write">Write Access</option>
            <option value="admin">Admin Access</option>
          </PermissionSelect>
        )}
        
        <ListContainer>
          {activeTab === 'users' && (
            filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <ListItem 
                  key={user.id} 
                  isSelected={selectedUserIds.includes(user.id)}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <Avatar>{getInitials(user.name)}</Avatar>
                  <ItemInfo>
                    <ItemName>{user.name}</ItemName>
                    <ItemDetail>{user.email} {user.department && `• ${user.department}`}</ItemDetail>
                  </ItemInfo>
                  <Checkbox 
                    type="checkbox" 
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    onClick={e => e.stopPropagation()}
                  />
                </ListItem>
              ))
            ) : (
              <EmptyState>No users found matching your search criteria.</EmptyState>
            )
          )}
          
          {activeTab === 'groups' && (
            filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <ListItem 
                  key={group.id} 
                  isSelected={selectedGroupIds.includes(group.id)}
                  onClick={() => toggleGroupSelection(group.id)}
                >
                  <Avatar>{group.name.substring(0, 1).toUpperCase()}</Avatar>
                  <ItemInfo>
                    <ItemName>{group.name}</ItemName>
                    <ItemDetail>Type: {group.type.charAt(0).toUpperCase() + group.type.slice(1)}</ItemDetail>
                  </ItemInfo>
                  <Checkbox 
                    type="checkbox" 
                    checked={selectedGroupIds.includes(group.id)}
                    onChange={() => toggleGroupSelection(group.id)}
                    onClick={e => e.stopPropagation()}
                  />
                </ListItem>
              ))
            ) : (
              <EmptyState>No groups found matching your search criteria.</EmptyState>
            )
          )}
        </ListContainer>
        
        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ShareButton 
            onClick={handleShare}
            disabled={
              isSubmitting || 
              (activeTab === 'users' && selectedUserIds.length === 0) || 
              (activeTab === 'groups' && selectedGroupIds.length === 0)
            }
          >
            {isSubmitting ? 'Sharing...' : 'Share Location'}
          </ShareButton>
        </ButtonContainer>
      </DialogContent>
    </DialogOverlay>
  );
};

export default ShareLocationDialog;
