import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, ShareGroup } from '../api';
import theme from '../theme';
import axios from 'axios';

interface AddGroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  onMembersAdded?: (users: User[]) => void;
  selectedUsers?: User[];
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

// Add a button to test API connection
const TestConnectionButton = styled.button`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: background-color ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${theme.colors.border.main};
    cursor: not-allowed;
  }
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.background.main};
  border-radius: ${theme.borderRadius.md};
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;
  
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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.main};
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

const ModalBody = styled.div`
  padding: ${theme.spacing.md};
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.main};
  background-color: ${theme.colors.background.dark};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.transparent};
  }
`;

const UserList = styled.div`
  margin-top: ${theme.spacing.md};
  max-height: 300px;
  overflow-y: auto;
  
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

const UserItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.selected ? theme.colors.primary.transparent : theme.colors.background.light};
  margin-bottom: ${theme.spacing.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.selected ? theme.colors.primary.transparent : theme.colors.background.hover};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.circle};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-right: ${theme.spacing.sm};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const UserEmail = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

const SelectedUsers = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.main};
`;

const SelectedUsersTitle = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
`;

const SelectedUsersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

const SelectedUserTag = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.primary.transparent};
  color: ${theme.colors.primary.main};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
`;

const RemoveUserButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  margin-left: ${theme.spacing.xs};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  
  &:hover {
    color: ${theme.colors.status.error};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border.main};
`;

const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background-color: transparent;
  border: 1px solid ${theme.colors.border.main};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.background.light};
  }
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.disabled ? theme.colors.background.dark : theme.colors.primary.main};
  border: 1px solid ${props => props.disabled ? theme.colors.border.main : theme.colors.primary.main};
  color: ${props => props.disabled ? theme.colors.text.disabled : theme.colors.primary.contrastText};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.disabled ? theme.colors.background.dark : theme.colors.primary.dark};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

const EmptyStateText = styled.p`
  margin-top: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.md};
`;

const ConnectionStatusContainer = styled.div<{ success: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.success ? '#e6f7e6' : '#ffebee'};
  border: 1px solid ${props => props.success ? '#4caf50' : '#f44336'};
`;

const ConnectionStatusIcon = styled.span<{ success: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.success ? '#4caf50' : '#f44336'};
  color: white;
  margin-right: ${theme.spacing.md};
  font-weight: bold;
`;

const ConnectionStatusMessage = styled.span`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  word-break: break-word;
`;

const AddGroupMembersModal: React.FC<AddGroupMembersModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  onMembersAdded,
  selectedUsers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsersState, setSelectedUsers] = useState<User[]>(selectedUsers || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  // Function to test API connection
  const testApiConnectionHandler = async () => {
    setTestingConnection(true);
    setConnectionStatus({ success: false, message: 'Testing connection...' });
    
    try {
      // Get auth token if available
      const authToken = localStorage.getItem('accessToken');
      console.log('Auth token available:', !!authToken);
      
      // Potential base URLs to try
      const baseUrls = [
        'http://localhost:3001', // Mock API server (prioritize this)
        'http://localhost:8001',
        'http://localhost:8000',
        window.location.origin,
        ''
      ];
      
      // Potential API prefixes to try
      const apiPrefixes = [
        '/api/v1',
        '/api',
        '/v1',
        ''
      ];
      
      // Test endpoint
      const endpoint = '/test';
      
      let success = false;
      let successResponse = null;
      let successUrl = '';
      let allErrors: string[] = [];
      
      // Try different combinations of base URLs and API prefixes
      for (const baseUrl of baseUrls) {
        if (success) break;
        
        for (const apiPrefix of apiPrefixes) {
          if (success) break;
          
          const fullUrl = `${baseUrl}${apiPrefix}${endpoint}`;
          console.log(`Testing API connection to ${fullUrl}`);
          
          try {
            // Prepare headers
            const headers: Record<string, string> = {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            };
            
            // Add auth token if available
            if (authToken) {
              headers['Authorization'] = `Bearer ${authToken}`;
            }
            
            const response = await axios.get(fullUrl, {
              headers,
              timeout: 5000 // 5 second timeout
            });
            
            if (response.status >= 200 && response.status < 300) {
              success = true;
              successResponse = response.data;
              successUrl = fullUrl;
              
              // Save the successful URL for future use
              localStorage.setItem('api_base_url', baseUrl);
              localStorage.setItem('api_prefix', apiPrefix);
              console.log('Saved successful API configuration:', { baseUrl, apiPrefix });
              
              break;
            } else {
              allErrors.push(`${fullUrl}: Status ${response.status}`);
            }
          } catch (error: any) {
            console.error(`Error testing ${fullUrl}:`, error);
            const errorMsg = error.response 
              ? `Status ${error.response.status}` 
              : (error.message || 'Unknown error');
            allErrors.push(`${fullUrl}: ${errorMsg}`);
          }
        }
      }
      
      const testResult = {
        success,
        message: success 
          ? `Connection successful to ${successUrl}! Server response: ${JSON.stringify(successResponse)}` 
          : `All connection attempts failed. Errors: ${allErrors.join('; ')}`
      };
      
      setConnectionStatus({ 
        success: testResult.success, 
        message: testResult.message
      });
    } catch (error: any) {
      console.error('API connection test failed:', error);
      setConnectionStatus({ 
        success: false, 
        message: `Connection error: ${error.message}` 
      });
    } finally {
      setTestingConnection(false);
    }
  };
  
  // Fetch users when search query changes (with debounce)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        console.log(`Searching for users with query: ${searchQuery}`);
        
        // Try multiple possible auth token keys
        let authToken = null;
        const possibleTokenKeys = ['auth_token', 'accessToken', 'token', 'jwt', 'bearerToken', 'apiToken'];
        
        for (const key of possibleTokenKeys) {
          const token = localStorage.getItem(key);
          if (token) {
            authToken = token;
            console.log(`Auth token found with key: ${key}`);
            break;
          }
        }
        
        console.log('Auth token available:', !!authToken);
        
        // Try to use previously successful API configuration
        let baseUrl = localStorage.getItem('api_base_url');
        let apiPrefix = localStorage.getItem('api_prefix');
        
        // Potential base URLs to try
        const baseUrls = baseUrl ? [baseUrl] : [
          'http://localhost:3001', // Mock API server (prioritize this)
          'http://localhost:8001',
          'http://localhost:8000',
          window.location.origin,
          ''
        ];
        
        // Potential API prefixes to try
        const apiPrefixes = apiPrefix ? [apiPrefix] : [
          '/api/v1',
          '/api',
          '/v1',
          ''
        ];
        
        // Possible endpoints to try (in order of likelihood)
        const endpoints = [
          '/users/search',                       // From api.tsx
          '/widgets/file-share-users/search',     // From routes/api.php
          '/v1/widgets/file-share-users/search',  // With v1 prefix
          '/file-share-users/search',            // Without widgets prefix
          '/search-users'                        // Simple endpoint
        ];
        
        // Log CORS headers for debugging
        console.log('Request will include these CORS headers:', {
          'Origin': window.location.origin,
          'Referer': window.location.href
        });
        
        let response = null;
        let error = null;
        let success = false;
        
        // Try different combinations of base URLs, API prefixes, and endpoints
        for (const baseUrl of baseUrls) {
          if (success) break;
          
          for (const apiPrefix of apiPrefixes) {
            if (success) break;
            
            for (const endpoint of endpoints) {
              if (success) break;
              
              const fullUrl = `${baseUrl}${apiPrefix}${endpoint}`;
              console.log(`Trying API URL: ${fullUrl}`);
              
              try {
                // Make the API request
                response = await axios.post(
                  fullUrl,
                  { search: searchQuery },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': authToken ? `Bearer ${authToken}` : undefined,
                      'X-Requested-With': 'XMLHttpRequest',
                      'Origin': window.location.origin
                    },
                    // IMPORTANT: Set to false for cross-origin requests
                    withCredentials: false,
                    // Add timeout to prevent long waiting periods
                    timeout: 10000
                  }
                );
                
                console.log(`API call succeeded:`, response.data);
                
                if (response.data && (response.data.success || Array.isArray(response.data.users))) {
                  success = true;
                  
                  // Save the successful URL and endpoint for future use
                  localStorage.setItem('api_base_url', baseUrl);
                  localStorage.setItem('api_prefix', apiPrefix);
                  localStorage.setItem('api_search_endpoint', endpoint);
                  console.log('Saved successful API configuration:', { baseUrl, apiPrefix, endpoint });
                  
                  break;
                }
              } catch (err) {
                console.error(`Error with ${fullUrl}:`, err);
                error = err;
              }
            }
          }
        }
        
        if (!success && error) {
          throw error;
        }
        
        // At this point, if success is true, response must be non-null
        if (success && response) {
          if (Array.isArray(response.data?.users)) {
            setUsers(response.data.users);
          } else if (response.data?.success) {
            setUsers(response.data.users || []);
          } else {
            console.error('Unexpected response format from user search API:', response.data);
            setError(response.data?.message || 'Invalid response from server');
          }
        } else {
          throw new Error('No successful response from any API endpoint');
        }
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error searching users:', err);
        
        // Provide more detailed error information
        let errorMessage = 'Network error';
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
          
          errorMessage = `Server error: ${err.response.status} - ${err.response.data?.message || err.message}`;
        } else if (err.request) {
          // The request was made but no response was received
          console.error('Error request:', err.request);
          errorMessage = 'No response from server. Check your network connection and server status.';
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
          errorMessage = err.message;
        }
        
        setError('Failed to search users: ' + errorMessage);
        setIsLoading(false);
      }
    };
    
    const debounceTimeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);
  
  const handleSelectUser = (user: User) => {
    if (selectedUsersState.some(u => u.id === user.id)) {
      // User is already selected, remove them
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    } else {
      // Add user to selection
      setSelectedUsers(prev => [...prev, user]);
    }
  };
  
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };
  
  const handleAddMembers = async () => {
    if (selectedUsersState.length === 0) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Call the addGroupMembers function directly with axios
      const memberIds = selectedUsersState.map(user => user.id);
      
      console.log(`Adding members to group ${groupId}:`, memberIds);
      
      // Get auth token if available
      const authToken = localStorage.getItem('accessToken');
      console.log('Auth token available:', !!authToken);
      
      // Try to use previously successful API configuration
      let baseUrl = localStorage.getItem('api_base_url');
      let apiPrefix = localStorage.getItem('api_prefix');
      
      // Potential base URLs to try
      const baseUrls = baseUrl ? [baseUrl] : [
        'http://localhost:3001', // Mock API server (prioritize this)
        'http://localhost:8001',
        'http://localhost:8000',
        window.location.origin,
        ''
      ];
      
      // Potential API prefixes to try
      const apiPrefixes = apiPrefix ? [apiPrefix] : [
        '/api/v1',
        '/api',
        '/v1',
        ''
      ];
      
      // Try to get the previously successful endpoint pattern
      const searchEndpoint = localStorage.getItem('api_search_endpoint');
      
      // Possible endpoints to try (in order of likelihood)
      const endpoints = [
        `/share-groups/${groupId}/add-members`,            // Standard endpoint
        `/groups/${groupId}/add-members`,                  // Without 'share-' prefix
        `/v1/share-groups/${groupId}/add-members`,         // With v1 prefix
        `/v1/groups/${groupId}/add-members`,               // With v1 prefix, without 'share-'
        `/group-members/add/${groupId}`                    // Alternative format
      ];
      
      // If we found a successful search endpoint before, use its pattern to create a likely add-members endpoint
      if (searchEndpoint && searchEndpoint.includes('/users/search')) {
        // If the search endpoint was '/users/search', try '/groups/members/add' first
        endpoints.unshift(`/groups/members/add/${groupId}`);
      }
      
      // Log CORS headers for debugging
      console.log('Request will include these CORS headers:', {
        'Origin': window.location.origin,
        'Referer': window.location.href
      });
      
      let response = null;
      let error = null;
      let success = false;
      
      // Try different combinations of base URLs, API prefixes, and endpoints
      for (const baseUrl of baseUrls) {
        if (success) break;
        
        for (const apiPrefix of apiPrefixes) {
          if (success) break;
          
          for (const endpoint of endpoints) {
            if (success) break;
            
            const fullUrl = `${baseUrl}${apiPrefix}${endpoint}`;
            console.log(`Trying API URL: ${fullUrl}`);
            
            try {
              // Make the API request
              response = await axios.post(
                fullUrl,
                { members: memberIds },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': authToken ? `Bearer ${authToken}` : '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': window.location.origin
                  },
                  // IMPORTANT: Set to false for cross-origin requests
                  withCredentials: false,
                  // Add timeout to prevent long waiting periods
                  timeout: 10000
                }
              );
              
              console.log(`API call succeeded:`, response.data);
              
              if (response.data && (response.data.success || Array.isArray(response.data.users))) {
                success = true;
                
                // Save the successful URL and endpoint for future use
                localStorage.setItem('api_base_url', baseUrl);
                localStorage.setItem('api_prefix', apiPrefix);
                localStorage.setItem('api_members_endpoint', endpoint);
                console.log('Saved successful API configuration:', { baseUrl, apiPrefix, endpoint });
                
                break;
              }
            } catch (err) {
              console.error(`Error with ${fullUrl}:`, err);
              error = err;
            }
          }
        }
      }
      
      if (!success && error) {
        throw error;
      }
      
      // At this point, if success is true, response must be non-null
      if (success && response) {
        if (response.data?.success || Array.isArray(response.data?.users)) {
          onClose();
          // Trigger a refresh of the group members list
          onMembersAdded?.(response.data?.users || selectedUsersState);
        } else {
          setError(response.data?.message || 'Failed to add members to the group');
        }
      } else {
        throw new Error('No successful response from any API endpoint');
      }
      
      setIsSubmitting(false);
    } catch (err: any) {
      console.error('Error adding members to group:', err);
      
      // Provide more detailed error information
      let errorMessage = 'Network error';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', err.response.headers);
        
        errorMessage = `Server error: ${err.response.status} - ${err.response.data?.message || err.message}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        errorMessage = 'No response from server. Check your network connection and server status.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        errorMessage = err.message;
      }
      
      setError('Failed to add members to the group: ' + errorMessage);
      setIsSubmitting(false);
    }
  };
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Members to {groupName}</ModalTitle>
          <TestConnectionButton 
            onClick={testApiConnectionHandler}
            type="button"
            disabled={testingConnection}
          >
            {testingConnection ? 'Testing...' : 'Test API Connection'}
          </TestConnectionButton>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {connectionStatus && (
            <ConnectionStatusContainer success={connectionStatus.success}>
              <ConnectionStatusIcon success={connectionStatus.success}>
                {connectionStatus.success ? '✓' : '✗'}
              </ConnectionStatusIcon>
              <ConnectionStatusMessage>
                {connectionStatus.message}
              </ConnectionStatusMessage>
            </ConnectionStatusContainer>
          )}
          <FormGroup>
            <Label htmlFor="userSearch">Search Users</Label>
            <Input
              id="userSearch"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
            />
          </FormGroup>
          
          {selectedUsersState.length > 0 && (
            <SelectedUsers>
              <SelectedUsersTitle>Selected Users ({selectedUsersState.length})</SelectedUsersTitle>
              <SelectedUsersList>
                {selectedUsersState.map(user => (
                  <SelectedUserTag key={user.id}>
                    {user.name}
                    <RemoveUserButton onClick={() => handleRemoveUser(user.id)}>×</RemoveUserButton>
                  </SelectedUserTag>
                ))}
              </SelectedUsersList>
            </SelectedUsers>
          )}
          
          <UserList>
            {isLoading ? (
              <EmptyState>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                <EmptyStateText>Searching users...</EmptyStateText>
              </EmptyState>
            ) : error ? (
              <EmptyState>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
                <EmptyStateText>{error}</EmptyStateText>
              </EmptyState>
            ) : users.length === 0 ? (
              searchQuery ? (
                <EmptyState>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <EmptyStateText>No users found matching "{searchQuery}"</EmptyStateText>
                </EmptyState>
              ) : (
                <EmptyState>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <EmptyStateText>Search for users to add to the group</EmptyStateText>
                </EmptyState>
              )
            ) : (
              users.map(user => (
                <UserItem 
                  key={user.id} 
                  selected={selectedUsersState.some(u => u.id === user.id)}
                  onClick={() => handleSelectUser(user)}
                >
                  <UserAvatar>{getInitials(user.name)}</UserAvatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    {user.email && <UserEmail>{user.email}</UserEmail>}
                  </UserInfo>
                </UserItem>
              ))
            )}
          </UserList>
        </ModalBody>
        
        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton 
            onClick={handleAddMembers}
            disabled={isSubmitting || selectedUsersState.length === 0}
          >
            {isSubmitting ? 'Adding...' : 'Add Members'}
          </SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddGroupMembersModal;
